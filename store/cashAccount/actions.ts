import { CashAccountActionTypes, CashTransaction } from "./types";

export const addCashTransaction = (transaction: CashTransaction) => ({
  type: CashAccountActionTypes.ADD_TRANSACTION,
  transaction
});
