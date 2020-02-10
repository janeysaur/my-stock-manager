import App from "next/app";
import React from "react";
import withReduxStore from "../lib/with-redux-store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";

type Props = {
  reduxStore: any;
  persistor: any;
};

class MyApp extends App<Props> {
  render() {
    const { Component, pageProps, reduxStore, persistor } = this.props;
    return (
      <>
        <Provider store={reduxStore}>
          <PersistGate loading={null} persistor={persistor}>
            <Component {...pageProps} />
          </PersistGate>{" "}
        </Provider>
      </>
    );
  }
}
export default withReduxStore(MyApp);
