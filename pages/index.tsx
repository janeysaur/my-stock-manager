import { NextPage } from "next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TransactionHistory } from "../components/TransactionHistory";
import { DepositCash } from "../components/DepositCash";
import { TradeShares } from "../components/TradeShares";
import {
  selectCashBalance,
  selectTransactionHistory,
  selectCurrentShareHoldings
} from "../store/selectors";
import { CashTransaction, ShareHolding } from "../store/types";
import { addCashTransaction, addTrade } from "../store/actions";
import { WithdrawCash } from "../components/WithdrawCash";
import { ShareHoldings } from "../components/ShareHoldings";

type Props = {
  balance: number;
  transactions: CashTransaction[];
  holdings: ShareHolding[];
  addCashTransaction: typeof addCashTransaction;
  addTrade: typeof addTrade;
};

const Home: NextPage<Props> = ({
  balance,
  transactions,
  holdings,
  addCashTransaction,
  addTrade
}) => (
  <>
    <h1>My stock manager</h1>
    <div>
      <h2>Cash Account Balance: ${balance}</h2>

      <div>
        <DepositCash addTransaction={addCashTransaction} />
        <WithdrawCash addTransaction={addCashTransaction} />
        <TransactionHistory transactions={transactions} />
      </div>
      <div>
        <TradeShares addTrade={addTrade} />
        <ShareHoldings holdings={holdings} />
      </div>
    </div>
  </>
);

const mapStateToProps = state => ({
  balance: selectCashBalance(state),
  transactions: selectTransactionHistory(state),
  holdings: selectCurrentShareHoldings(state)
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addCashTransaction,
      addTrade
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
