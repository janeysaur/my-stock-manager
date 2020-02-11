import { CashTransaction, ShareTransaction } from "./types";

export interface ApplicationState {
  transactions: CashTransaction[];
  trades: ShareTransaction[];
}
