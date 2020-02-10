import { combineReducers } from "redux";
import { cashAccount } from "./cashAccount/reducer";

const rootReducer = combineReducers({
  cashAccount
});

export default rootReducer;
