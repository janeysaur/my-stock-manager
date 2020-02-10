import { createStore } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./store/index";

export function initializeStore(initialState = {}) {
  return createStore(rootReducer, initialState, composeWithDevTools());
}
