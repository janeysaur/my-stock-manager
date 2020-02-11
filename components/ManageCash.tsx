import React from "react";
import { CashTransaction } from "../store/types";
import {
  Paper,
  Tabs,
  Tab,
  FormControl,
  InputLabel,
  Input,
  InputAdornment,
  makeStyles,
  Button,
  Grid
} from "@material-ui/core";
import { addCashTransaction } from "../store/actions";

const useStyles = makeStyles(theme => ({
  margin: {
    margin: theme.spacing(1)
  },
  padding: {
    padding: theme.spacing(1)
  }
}));

enum TransactionType {
  DEPOSIT = "deposit",
  WITHDRAW = "withdraw"
}

const tabs: TransactionType[] = [
  TransactionType.DEPOSIT,
  TransactionType.WITHDRAW
];

const ManageCash = ({
  balance,
  addTransaction
}: {
  balance: number;
  addTransaction: typeof addCashTransaction;
}) => {
  const [action, setAction] = React.useState(TransactionType.DEPOSIT);
  const [amountError, setAmountError] = React.useState("");
  const [amount, setAmount] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  const handleTabChange = (event, newIndex) => {
    setAction(tabs[newIndex]);
    setAmount("");
  };

  const handleAmountChange = event => {
    const newValue = event.target.value;
    setAmount(newValue);

    if (action === TransactionType.WITHDRAW && parseFloat(newValue) > balance) {
      setAmountError("Amount is greater than your current balance");
      setIsValid(false);
    } else {
      setAmountError("");
      setIsValid(newValue !== "");
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
    const transaction: CashTransaction = {
      date: new Date().toISOString(),
      amount: parseFloat(amount) * (action === TransactionType.DEPOSIT ? 1 : -1)
    };

    addTransaction(transaction);
    setAmount("");
  };

  const classes = useStyles();

  return (
    <Paper>
      <Tabs value={tabs.indexOf(action)} onChange={handleTabChange} centered>
        <Tab label="Deposit" />
        <Tab label="Withdraw" />
      </Tabs>
      <Grid container spacing={1} className={classes.padding}>
        <Grid item xs={12}>
          <FormControl className={classes.margin} required>
            <InputLabel htmlFor="amount">Amount</InputLabel>
            <Input
              id="amount"
              value={amount}
              type="number"
              onChange={handleAmountChange}
              error={amountError !== ""}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
        </Grid>
        <Grid container xs={12} justify="flex-end" className={classes.padding}>
          <Button
            variant="contained"
            color="primary"
            disabled={!isValid}
            onClick={handleSubmit}
          >
            {action}
          </Button>
        </Grid>
      </Grid>
    </Paper>
  );
};

export { ManageCash };
