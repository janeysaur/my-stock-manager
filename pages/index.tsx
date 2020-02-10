import { NextPage } from "next";
import { TransactionHistory } from "../components/TransactionHistory";
import { DepositCash } from "../components/DepositCash";

const Home: NextPage<{ userAgent: string }> = ({}) => (
  <>
    <h1>My stock manager</h1>
    <div>
      <h2>Cash Account Balance: $1000.00</h2>

      <div>
        <DepositCash />
        <TransactionHistory transactions={[]} trades={[]} />
      </div>
    </div>
  </>
);

export default Home;
