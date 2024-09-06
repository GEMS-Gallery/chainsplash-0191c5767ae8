export const idlFactory = ({ IDL }) => {
  const WalletId = IDL.Text;
  const Result_2 = IDL.Variant({ 'ok' : WalletId, 'err' : IDL.Text });
  const Amount = IDL.Float64;
  const Result_1 = IDL.Variant({ 'ok' : Amount, 'err' : IDL.Text });
  const TransactionId = IDL.Text;
  const Time = IDL.Int;
  const Transaction = IDL.Record({
    'id' : TransactionId,
    'to' : WalletId,
    'from' : WalletId,
    'timestamp' : Time,
    'amount' : Amount,
  });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  return IDL.Service({
    'createWallet' : IDL.Func([], [Result_2], []),
    'getBalance' : IDL.Func([WalletId], [Result_1], ['query']),
    'getTransactionHistory' : IDL.Func(
        [WalletId],
        [IDL.Vec(Transaction)],
        ['query'],
      ),
    'sendICP' : IDL.Func(
        [WalletId, IDL.Vec(WalletId), IDL.Vec(Amount)],
        [Result],
        [],
      ),
  });
};
export const init = ({ IDL }) => { return []; };
