import { Reducer } from "redux";
import { CashAccountState, CashAccountActionTypes } from "./types";

export const initialState: CashAccountState = {
  transactions: []
};

const reducer: Reducer<CashAccountState> = (state = initialState, action) => {
  switch (action.type) {
    case CashAccountActionTypes.ADD_TRANSACTION: {
      const { transaction } = action;
      return {
        ...state,
        transactions: state.transactions.concat(transaction)
      };
    }
    default: {
      return state;
    }
  }
};

export { reducer as cashAccount };
