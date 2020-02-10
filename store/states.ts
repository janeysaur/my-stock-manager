import { CashAccountState } from "./cashAccount/types";
import { initialState as cashAccountInitialState } from "./cashAccount/reducer";

export interface ApplicationState {
  cashAccount: Readonly<CashAccountState>;
}

export const initialState: ApplicationState = {
  cashAccount: cashAccountInitialState
};
