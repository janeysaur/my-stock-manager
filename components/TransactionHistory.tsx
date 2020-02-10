interface Transaction {
  date: string;
  amount: string;
  description?: string;
  tradeId: string;
}

interface Trade {
  id: string;
  stock: string;
  quantity: number;
  price: number;
  type: "BUY" | "SELL";
}

const TransactionLine = ({
  transaction,
  trade
}: {
  transaction: Transaction;
  trade?: Trade;
}) => (
  <tr>
    <td>{transaction.date}</td>
    <td>
      {trade
        ? `${trade.type} ${trade.quantity} x ${trade.stock} @ ${trade.price}`
        : transaction.description}
    </td>
    <td>{transaction.amount}</td>
  </tr>
);

const TransactionHistory = ({
  transactions,
  trades
}: {
  transactions: Transaction[];
  trades: Trade[];
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
      {transactions.map(transaction => (
        <TransactionLine
          key={transaction.date}
          transaction={transaction}
          trade={
            transaction.tradeId
              ? trades.find(trade => trade.id === transaction.tradeId)
              : undefined
          }
        />
      ))}
    </tbody>
  </table>
);

export { TransactionHistory };
