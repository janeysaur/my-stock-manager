import React from "react";
import { CashTransaction } from "../store/cashAccount/types";

type WithdrawCashProps = {
  addTransaction: (transaction: CashTransaction) => void;
};

type WithdrawCashState = {
  amount: string;
  description: string;
};

class WithdrawCash extends React.Component<
  WithdrawCashProps,
  WithdrawCashState
> {
  state = {
    amount: "",
    description: ""
  };

  onAmountChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ amount: e.target.value });
  };

  onDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    this.setState({ description: e.target.value });
  };

  onSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
    e.preventDefault();

    const { addTransaction } = this.props;
    const { amount, description } = this.state;

    const transaction: CashTransaction = {
      date: new Date().toISOString(),
      amount: -1 * parseFloat(amount), // TODO: validation
      description: description
    };

    addTransaction(transaction);
    this.setState({ amount: "", description: "" });
  };

  render() {
    return (
      <div>
        <h4>Withdraw</h4>
        <label>
          Amount
          <input
            type="number"
            value={this.state.amount}
            onChange={this.onAmountChange}
          />
        </label>
        <br />
        <label>
          Description
          <input
            type="text"
            value={this.state.description}
            onChange={this.onDescriptionChange}
          />
        </label>
        <br />
        <button type="button" onClick={this.onSubmit}>
          Withdraw
        </button>
      </div>
    );
  }
}

export { WithdrawCash };
