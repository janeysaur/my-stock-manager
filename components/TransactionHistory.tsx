import { CashTransaction, ShareTransaction } from "../store/types";

const TransactionHistory = ({
  transactions
}: {
  transactions: CashTransaction[];
}) => (
  <table>
    <thead>
      <tr>
        <th>Date</th>
        <th>Description</th>
        <th>Amount</th>
      </tr>
    </thead>
    <tbody>
      {transactions.map(({ date, description, amount }) => (
        <tr key={date}>
          <td>{date}</td>
          <td>{description}</td>
          <td>${amount}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export { TransactionHistory };
