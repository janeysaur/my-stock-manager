export interface CashTransaction {
  date: string;
  amount: number;
  description?: string;
  tradeId?: string;
}

export interface ShareTransaction {
  tradeId: string;
  date: string;
  share: string;
  price: number;
  quantity: number;
}

export interface Transaction extends CashTransaction {
  trade?: ShareTransaction;
}

export interface ShareHolding {
  stock: string;
  quantity: number;
}

export enum ActionTypes {
  ADD_TRANSACTION = "ADD_TRANSACTION",
  ADD_TRADE = "ADD_TRADE"
}
