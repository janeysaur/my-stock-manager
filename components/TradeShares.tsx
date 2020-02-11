import React from "react";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { fetchCurrentSharePrice, addTrade } from "../store/actions";

type Props = {
  addTrade: typeof addTrade;
};

type State = {
  quantity: string;
  symbol: string;
  currentPrice?: number;
  fetchingPrice: boolean;
};

const fetchCurrentSharePriceDebounced = AwesomeDebouncePromise(
  fetchCurrentSharePrice,
  500
);

class TradeShares extends React.Component<Props, State> {
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

  buyStock = () => {
    const { addTrade } = this.props;
    const { symbol, quantity, currentPrice } = this.state;
    if (symbol && quantity && currentPrice) {
      addTrade(symbol, parseInt(quantity), currentPrice);
    }
  };

  sellStock = () => {
    const { addTrade } = this.props;
    const { symbol, quantity, currentPrice } = this.state;
    if (symbol && quantity && currentPrice) {
      addTrade(symbol, -1 * parseInt(quantity), currentPrice);
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
        <button type="button" onClick={this.buyStock}>
          Buy
        </button>
        <button type="button" onClick={this.sellStock}>
          Sell
        </button>
      </div>
    );
  }
}

export { TradeShares };
