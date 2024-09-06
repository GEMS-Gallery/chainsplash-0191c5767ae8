import Bool "mo:base/Bool";
import Hash "mo:base/Hash";

import HashMap "mo:base/HashMap";
import Principal "mo:base/Principal";
import Result "mo:base/Result";
import Int "mo:base/Int";
import Float "mo:base/Float";
import Array "mo:base/Array";
import Iter "mo:base/Iter";
import Time "mo:base/Time";
import Text "mo:base/Text";
import Blob "mo:base/Blob";
import Error "mo:base/Error";

actor {
  type WalletId = Text;
  type Amount = Float;
  type TransactionId = Text;

  type Wallet = {
    id: WalletId;
    balance: Amount;
  };

  type Transaction = {
    id: TransactionId;
    from: WalletId;
    to: WalletId;
    amount: Amount;
    timestamp: Time.Time;
  };

  stable var walletEntries : [(WalletId, Wallet)] = [];
  stable var transactionEntries : [(TransactionId, Transaction)] = [];

  let wallets = HashMap.fromIter<WalletId, Wallet>(walletEntries.vals(), 10, Text.equal, Text.hash);
  let transactions = HashMap.fromIter<TransactionId, Transaction>(transactionEntries.vals(), 10, Text.equal, Text.hash);

  public func createWallet() : async Result.Result<WalletId, Text> {
    let walletId = Int.toText(Time.now());
    let newWallet : Wallet = {
      id = walletId;
      balance = 0;
    };
    wallets.put(walletId, newWallet);
    #ok(walletId)
  };

  public query func getBalance(walletId : WalletId) : async Result.Result<Amount, Text> {
    switch (wallets.get(walletId)) {
      case null #err("Wallet not found");
      case (?wallet) #ok(wallet.balance);
    }
  };

  public func sendICP(from : WalletId, to : [WalletId], amounts : [Amount]) : async Result.Result<(), Text> {
    if (to.size() != amounts.size()) {
      return #err("Mismatch between recipients and amounts");
    };

    switch (wallets.get(from)) {
      case null return #err("Sender wallet not found");
      case (?fromWallet) {
        var totalAmount = 0.0;
        for (amount in amounts.vals()) {
          totalAmount += amount;
        };

        if (fromWallet.balance < totalAmount) {
          return #err("Insufficient balance");
        };

        // Update sender's balance
        wallets.put(from, { id = from; balance = fromWallet.balance - totalAmount });

        // Process each transfer
        for (i in Iter.range(0, to.size() - 1)) {
          let recipient = to[i];
          let amount = amounts[i];

          switch (wallets.get(recipient)) {
            case null {
              // Create new wallet for recipient if it doesn't exist
              wallets.put(recipient, { id = recipient; balance = amount });
            };
            case (?recipientWallet) {
              wallets.put(recipient, { id = recipient; balance = recipientWallet.balance + amount });
            };
          };

          // Record transaction
          let transaction : Transaction = {
            id = Int.toText(Time.now());
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

  public query func getTransactionHistory(walletId : WalletId) : async [Transaction] {
    Iter.toArray(Iter.filter(transactions.vals(), func (t : Transaction) : Bool {
      t.from == walletId or t.to == walletId
    }))
  };

  system func preupgrade() {
    walletEntries := Iter.toArray(wallets.entries());
    transactionEntries := Iter.toArray(transactions.entries());
  };

  system func postupgrade() {
    walletEntries := [];
    transactionEntries := [];
  };
}
