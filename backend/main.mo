import Bool "mo:base/Bool";
import Hash "mo:base/Hash";
import Nat "mo:base/Nat";

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";

actor {
  // Types
  type AccountId = Text;
  type Amount = Nat;
  type TransactionId = Text;

  type Account = {
    id: AccountId;
    balance: Amount;
  };

  type Transaction = {
    id: TransactionId;
    from: AccountId;
    to: AccountId;
    amount: Amount;
    timestamp: Time.Time;
  };

  // Stable variables
  stable var accountEntries : [(AccountId, Account)] = [];
  stable var transactionEntries : [(TransactionId, Transaction)] = [];

  // Create HashMaps from stable variables
  let accounts = HashMap.fromIter<AccountId, Account>(accountEntries.vals(), 10, Text.equal, Text.hash);
  let transactions = HashMap.fromIter<TransactionId, Transaction>(transactionEntries.vals(), 10, Text.equal, Text.hash);

  // Helper functions
  func generateId() : Text {
    Int.toText(Time.now())
  };

  // API methods
  public func createAccount() : async Result.Result<AccountId, Text> {
    let id = generateId();
    let newAccount : Account = {
      id = id;
      balance = 0;
    };
    accounts.put(id, newAccount);
    #ok(id)
  };

  public func importAccount(accountId : AccountId) : async Result.Result<(), Text> {
    switch (accounts.get(accountId)) {
      case null {
        let newAccount : Account = {
          id = accountId;
          balance = 0;
        };
        accounts.put(accountId, newAccount);
        #ok()
      };
      case (?_) #err("Account already exists")
    }
  };

  public query func getBalance(accountId : AccountId) : async Result.Result<Amount, Text> {
    switch (accounts.get(accountId)) {
      case null #err("Account not found");
      case (?account) #ok(account.balance);
    }
  };

  public shared(msg) func sendICP(from : AccountId, to : [AccountId], amounts : [Amount]) : async Result.Result<(), Text> {
    if (to.size() != amounts.size()) {
      return #err("Mismatch between recipients and amounts");
    };

    switch (accounts.get(from)) {
      case null return #err("Sender account not found");
      case (?fromAccount) {
        var totalAmount = 0;
        for (amount in amounts.vals()) {
          totalAmount += amount;
        };

        if (fromAccount.balance < totalAmount) {
          return #err("Insufficient balance");
        };

        // Update sender's balance
        accounts.put(from, { id = from; balance = fromAccount.balance - totalAmount });

        // Process each transfer
        for (i in Iter.range(0, to.size() - 1)) {
          let recipient = to[i];
          let amount = amounts[i];

          switch (accounts.get(recipient)) {
            case null {
              // Create new account for recipient if it doesn't exist
              accounts.put(recipient, { id = recipient; balance = amount });
            };
            case (?recipientAccount) {
              accounts.put(recipient, { id = recipient; balance = recipientAccount.balance + amount });
            };
          };

          // Record transaction
          let transaction : Transaction = {
            id = generateId();
            from = from;
            to = recipient;
            amount = amount;
            timestamp = Time.now();
          };
          transactions.put(transaction.id, transaction);
        };

        #ok()
      };
    }
  };

  public query func getTransactionHistory(accountId : AccountId) : async [Transaction] {
    Iter.toArray(Iter.filter(transactions.vals(), func (t : Transaction) : Bool {
      t.from == accountId or t.to == accountId
    }))
  };

  // Upgrade hooks
  system func preupgrade() {
    accountEntries := Iter.toArray(accounts.entries());
    transactionEntries := Iter.toArray(transactions.entries());
  };

  system func postupgrade() {
    accountEntries := [];
    transactionEntries := [];
  };
}
