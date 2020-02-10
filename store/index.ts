import { combineReducers } from "redux";
import { cashAccount } from "./cashAccount/reducers";

const rootReducer = combineReducers({
  cashAccount
});

export default rootReducer;
