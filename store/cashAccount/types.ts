export interface CashTransaction {
  date: string;
  amount: string;
  description?: string;
  tradeId: string;
}

export enum CashAccountActionTypes {
  ADD_TRANSACTION = "@@cashAccount/ADD_TRANSACTION"
}

export interface CashAccountState {
  readonly transactions: CashTransaction[];
}
