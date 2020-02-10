import { NextPage } from "next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TransactionHistory } from "../components/TransactionHistory";
import { DepositCash } from "../components/DepositCash";
import {
  selectCashTransactions,
  selectCashBalance
} from "../store/cashAccount/selectors";
import { CashTransaction } from "../store/cashAccount/types";
import { addCashTransaction } from "../store/cashAccount/actions";
import { WithdrawCash } from "../components/WithdrawCash";

type Props = {
  balance: number;
  transactions: CashTransaction[];
  addCashTransaction: (transaction: CashTransaction) => void;
};

const Home: NextPage<Props> = ({
  balance,
  transactions,
  addCashTransaction
}) => (
  <>
    <h1>My stock manager</h1>
    <div>
      <h2>Cash Account Balance: ${balance}</h2>

      <div>
        <DepositCash addTransaction={addCashTransaction} />
        <WithdrawCash addTransaction={addCashTransaction} />
        <TransactionHistory transactions={transactions} trades={[]} />
      </div>
    </div>
  </>
);

const mapStateToProps = state => ({
  balance: selectCashBalance(state),
  transactions: selectCashTransactions(state)
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addCashTransaction
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
