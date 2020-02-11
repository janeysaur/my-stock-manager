import { ActionTypes, CashTransaction } from "./types";

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
const getQuotes = (symbols: string[]): Promise<any> =>
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

export const fetchCurrentSharePrice = (symbol: string): Promise<number> => {
  return getQuotes([symbol]).then(response => {
    return response.json().then(({ quoteResponse: { result } }) => {
      if (result.length > 0) {
        // naively assume first result is an exact match for the symbol
        return result[0].regularMarketPrice;
      }
      throw new Error("No results found");
    });
  });
};
