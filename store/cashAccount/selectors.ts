import { createSelector } from "reselect";
import { CashAccountState, CashTransaction } from "./types";
import { initialState } from "./reducer";
import { ApplicationState } from "../states";

const selectCashAccount = (state: ApplicationState): CashAccountState =>
  state.cashAccount || initialState;

export const selectCashTransactions = createSelector(
  selectCashAccount,
  (cashAccount): CashTransaction[] => cashAccount.transactions
);

export const selectCashBalance = createSelector(
  selectCashAccount,
  (cashAccount): number =>
    cashAccount.transactions.reduce(
      (balance, transaction) => balance + transaction.amount,
      0
    )
);
