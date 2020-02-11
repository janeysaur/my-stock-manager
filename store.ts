import { createStore, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";
import thunkMiddleware from "redux-thunk";
import rootReducer from "./store/index";

const persistConfig = {
  key: "my-stock-manager",
  storage
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export function initializeStore() {
  const store = createStore(
    persistedReducer,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );
  const persistor = persistStore(store);
  return { store, persistor };
}
