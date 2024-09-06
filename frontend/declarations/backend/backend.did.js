export const idlFactory = ({ IDL }) => {
  const AccountId = IDL.Text;
  const Result_2 = IDL.Variant({ 'ok' : AccountId, 'err' : IDL.Text });
  const Amount = IDL.Nat;
  const Result_1 = IDL.Variant({ 'ok' : Amount, 'err' : IDL.Text });
  const TransactionId = IDL.Text;
  const Time = IDL.Int;
  const Transaction = IDL.Record({
    'id' : TransactionId,
    'to' : AccountId,
    'from' : AccountId,
    'timestamp' : Time,
    'amount' : Amount,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'createAccount' : IDL.Func([], [Result_2], []),
    'getBalance' : IDL.Func([AccountId], [Result_1], ['query']),
    'getTransactionHistory' : IDL.Func(
        [AccountId],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'importAccount' : IDL.Func([AccountId], [Result], []),
    'sendICP' : IDL.Func(
        [AccountId, IDL.Vec(AccountId), IDL.Vec(Amount)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
