import { createSelector } from "reselect";
import {
  CashTransaction,
  ShareTransaction,
  ShareHolding,
  Transaction
} from "./types";
import { ApplicationState } from "./states";

export const selectCashTransactions = (
  state: ApplicationState
): CashTransaction[] => state.transactions || [];

export const selectCashBalance = createSelector(
  selectCashTransactions,
  (transactions): number =>
    transactions.reduce(
      (balance, transaction) => balance + transaction.amount,
      0
    )
);

export const selectShareTransactions = (
  state: ApplicationState
): ShareTransaction[] => state.trades || [];

export const selectTransactionHistory = createSelector(
  selectCashTransactions,
  selectShareTransactions,
  (transactions, trades): Transaction[] =>
    transactions
      .map(transaction => {
        const trade = transaction.tradeId
          ? trades.find(trade => trade.tradeId === transaction.tradeId)
          : undefined;

        return {
          ...transaction,
          trade
        };
      })
      .reverse()
);

export const selectCurrentShareHoldings = createSelector(
  selectShareTransactions,
  (trades): ShareHolding[] => {
    const holdings = trades.reduce((holdings, trade) => {
      const { share, quantity } = trade;
      let total = quantity;
      if (holdings[share] !== undefined) {
        total += holdings[share];
      }

      return {
        ...holdings,
        [share]: total
      };
    }, {});
    return Object.keys(holdings)
      .sort()
      .map(stock => ({
        stock,
        quantity: holdings[stock]
      }));
  }
);
