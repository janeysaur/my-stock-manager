import { Transaction } from "../store/types";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  makeStyles
} from "@material-ui/core";

const useStyles = makeStyles(theme => ({
  dateColumn: {
    width: "25%",
    minWidth: "180px"
  }
}));

const TransactionHistory = ({
  transactions
}: {
  transactions: Transaction[];
}) => {
  const classes = useStyles();

  return (
    <TableContainer>
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell className={classes.dateColumn}>Date</TableCell>
            <TableCell>Description</TableCell>
            <TableCell align="right">Amount</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {transactions.map(({ date, description, amount, trade }) => (
            <TableRow key={date}>
              <TableCell className={classes.dateColumn}>
                {" "}
                {new Intl.DateTimeFormat("en-AU", {
                  year: "numeric",
                  month: "numeric",
                  day: "numeric",
                  hour: "numeric",
                  minute: "numeric",
                  second: "numeric",
                  hour12: false
                }).format(new Date(date))}
              </TableCell>
              <TableCell>
                {trade ? (
                  <>
                    {trade.quantity > 0 ? "BUY" : "SELL"}
                    {": "}
                    {Math.abs(trade.quantity)}
                    {" x "}
                    {trade.share}
                    {" @ "}
                    {new Intl.NumberFormat("en-AU", {
                      style: "currency",
                      currency: "AUD"
                    }).format(trade.price)}
                  </>
                ) : (
                  description || (amount > 0 ? "Deposit" : "Withdrawal")
                )}
              </TableCell>
              <TableCell align="right">
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD"
                }).format(amount)}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export { TransactionHistory };
