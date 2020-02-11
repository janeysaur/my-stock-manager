import { Reducer } from "redux";
import uuid from "uuid/v1";
import { ApplicationState } from "./states";
import { ActionTypes, CashTransaction, ShareTransaction } from "./types";

export const initialState: ApplicationState = {
  transactions: [],
  trades: []
};

const reducer: Reducer<ApplicationState> = (state = initialState, action) => {
  switch (action.type) {
    case ActionTypes.ADD_TRANSACTION: {
      const { transaction } = action;
      return {
        ...state,
        transactions: state.transactions.concat(transaction)
      };
    }
    case ActionTypes.ADD_TRADE: {
      const { symbol, quantity, price } = action;
      const tradeId = uuid();
      const now = new Date().toISOString();

      const trade: ShareTransaction = {
        tradeId,
        date: now,
        share: symbol,
        price,
        quantity
      };

      const transaction: CashTransaction = {
        date: now,
        amount: quantity * price,
        description: "TRADE",
        tradeId
      };

      return {
        ...state,
        transactions: state.transactions.concat(transaction),
        trades: state.trades.concat(trade)
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as AppReducer };
