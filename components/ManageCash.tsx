import React from "react";
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
  Grid,
  FormHelperText
} from "@material-ui/core";
import { CashTransaction } from "../store/types";
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
  const [amount, setAmount] = React.useState(0);
  const [amountString, setAmountString] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  const handleTabChange = (event, newIndex) => {
    setAction(tabs[newIndex]);
    setAmount(0);
    setAmountString("");
  };

  const handleAmountChange = event => {
    const newValue: string = event.target.value;
    const newAmount: number = parseFloat(newValue);
    setAmountString(newValue);
    setAmount(newAmount);
  };

  React.useEffect(() => {
    setAmountError("");
    setIsValid(true);

    if (action === TransactionType.WITHDRAW && amount > balance) {
      setAmountError("Insufficient funds");
      setIsValid(false);
    } else {
      setIsValid(amount > 0);
    }
  }, [amount, action]);

  const handleSubmit = (e: React.FormEvent<HTMLButtonElement>): void => {
    const transaction: CashTransaction = {
      date: new Date().toISOString(),
      amount: (action === TransactionType.DEPOSIT ? 1 : -1) * amount
    };

    addTransaction(transaction);
    setAmountString("");
    setAmount(0);
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
              value={amountString}
              type="number"
              onChange={handleAmountChange}
              error={amountError !== "" || amount < 0}
              startAdornment={
                <InputAdornment position="start">$</InputAdornment>
              }
            />
          </FormControl>
          <FormHelperText error>{amountError}</FormHelperText>
        </Grid>
        <Grid container justify="flex-end" className={classes.padding}>
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
