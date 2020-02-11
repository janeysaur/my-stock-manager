import { ActionTypes, CashTransaction } from "./types";
import { selectCurrentShareHoldings } from "./selectors";

export const addCashTransaction = (transaction: CashTransaction) => ({
  type: ActionTypes.ADD_TRANSACTION,
  transaction
});

export const addTrade = (symbol: string, quantity: number, price: number) => ({
  type: ActionTypes.ADD_TRADE,
  symbol,
  quantity,
  price
});

const YFINANCE_API_URL = "https://apidojo-yahoo-finance-v1.p.rapidapi.com";
const getQuotes = async (symbols: string[]) =>
  fetch(
    `${YFINANCE_API_URL}/market/get-quotes?region=US&lang=en&symbols=${symbols.join(
      ","
    )}`,
    {
      method: "GET",
      headers: {
        "x-rapidapi-host": "apidojo-yahoo-finance-v1.p.rapidapi.com",
        "x-rapidapi-key": "25ba6c2e92mshcbc2d2eef098cb6p194aa5jsn19ffdc5a3c92"
      }
    }
  );

export const fetchCurrentSharePrice = async (symbol: string) => {
  const response = await getQuotes([symbol]);
  const {
    quoteResponse: { result }
  } = await response.json();
  if (result.length > 0) {
    // naively assume first result is an exact match for the symbol
    return result[0].regularMarketPrice;
  }
  throw new Error("No results found");
};

export const fetchCurrentHoldingsValue = async holdings => {
  const symbols = holdings.map(holding => holding.stock);
  if (symbols.length === 0) {
    return 0;
  }

  const response = await getQuotes(symbols);
  const {
    quoteResponse: { result }
  } = await response.json();
  const pricesBySymbol = result.reduce(
    (map: { [key: string]: number }, { regularMarketPrice, symbol }) => ({
      ...map,
      [symbol]: regularMarketPrice
    }),
    {}
  );

  // total portfolio value
  const totalValue = holdings.reduce(
    (total: number, { stock, quantity }) =>
      total + pricesBySymbol[stock] * quantity,
    0
  );
  return totalValue;
};
