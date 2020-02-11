import React from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { fetchCurrentSharePrice, addTrade } from "../store/actions";

type BuySharesProps = {
  addTrade: typeof addTrade;
};

type BuySharesState = {
  quantity: string;
  symbol: string;
  currentPrice?: number;
  fetchingPrice: boolean;
};

const fetchCurrentSharePriceDebounced = AwesomeDebouncePromise(
  fetchCurrentSharePrice,
  500
);

class BuyShares extends React.Component<BuySharesProps, BuySharesState> {
  state = {
    symbol: "",
    quantity: "",
    currentPrice: undefined,
    fetchingPrice: false
  };

  fetchCurrentSharePrice = async symbol => {
    this.setState({ fetchingPrice: true });
    const currentPrice = await fetchCurrentSharePriceDebounced(symbol);
    this.setState({ currentPrice, fetchingPrice: false });
  };

  handleSymbolChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
    const symbol = event.target.value.toUpperCase();
    this.setState({ symbol });
    this.fetchCurrentSharePrice(symbol);
  };

  handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ quantity: parseInt(e.target.value).toString() });
  };

  onSubmit = () => {
    const { addTrade } = this.props;
    const { symbol, quantity, currentPrice } = this.state;
    if (symbol && quantity && currentPrice) {
      addTrade(symbol, parseInt(quantity), currentPrice);
    }
  };

  render() {
    const { symbol, quantity, currentPrice, fetchingPrice } = this.state;
    return (
      <div>
        <h4>Buy</h4>
        <label>
          Share symbol
          <input
            type="text"
            value={symbol}
            onChange={this.handleSymbolChange}
          />
        </label>
        <label>
          Quantity
          <input
            type="number"
            value={quantity}
            onChange={this.handleQuantityChange}
          />
        </label>
        <div>
          Current Market Price:{" "}
          {fetchingPrice
            ? "fetching..."
            : currentPrice !== undefined
            ? `$${currentPrice}`
            : "Invalid symbol"}
        </div>
        <br />
        <button type="button" onClick={this.onSubmit}>
          Buy
        </button>
      </div>
    );
  }
}

export { BuyShares };
