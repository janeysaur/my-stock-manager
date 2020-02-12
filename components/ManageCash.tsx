import React from "react";
import { useFormState } from "react-use-form-state";
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
  const handleTabChange = (event, newIndex) => {
    setAction(tabs[newIndex]);
  };

  return (
    <Paper>
      <Tabs value={tabs.indexOf(action)} onChange={handleTabChange} centered>
        <Tab label="Deposit" />
        <Tab label="Withdraw" />
      </Tabs>
      {action === TransactionType.DEPOSIT && (
        <DepositCash addTransaction={addTransaction} />
      )}
      {action === TransactionType.WITHDRAW && (
        <WithdrawCash balance={balance} addTransaction={addTransaction} />
      )}
    </Paper>
  );
};

const DepositCash = ({
  addTransaction
}: {
  addTransaction: typeof addCashTransaction;
}) => {
  const classes = useStyles();
  const [formState, input] = useFormState();

  const validateAmount = value => {
    const floatValue = parseFloat(value);
    return isNaN(floatValue) === false;
  };

  const handleSubmit = e => {
    const transaction: CashTransaction = {
      date: new Date().toISOString(),
      amount: parseFloat(formState.values.amount)
    };

    addTransaction(transaction);
    formState.reset();
  };

  return (
    <Grid container spacing={1} className={classes.padding}>
      <Grid item xs={12}>
        <FormControl className={classes.margin} required>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <Input
            {...input.number({
              name: "amount",
              validate: (value, values, event) => validateAmount(value)
            })}
            error={formState.validity.amount === false}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <FormHelperText error>{formState.errors.amount || ""}</FormHelperText>
      </Grid>
      <Grid container justify="flex-end" className={classes.padding}>
        <Button
          variant="contained"
          color="primary"
          disabled={formState.validity.amount === false}
          onClick={handleSubmit}
        >
          Deposit
        </Button>
      </Grid>
    </Grid>
  );
};

const WithdrawCash = ({
  balance,
  addTransaction
}: {
  balance: number;
  addTransaction: typeof addCashTransaction;
}) => {
  const classes = useStyles();
  const [formState, input] = useFormState();

  const validateAmount = value => {
    const floatValue = parseFloat(value);
    if (floatValue > balance) {
      return "Insufficient funds";
    }
    return isNaN(floatValue) === false;
  };

  const handleSubmit = e => {
    const transaction: CashTransaction = {
      date: new Date().toISOString(),
      amount: -1 * parseFloat(formState.values.amount)
    };

    addTransaction(transaction);
    formState.reset();
  };

  return (
    <Grid container spacing={1} className={classes.padding}>
      <Grid item xs={12}>
        <FormControl className={classes.margin} required>
          <InputLabel htmlFor="amount">Amount</InputLabel>
          <Input
            {...input.number({
              name: "amount",
              validate: (value, values, event) => validateAmount(value)
            })}
            error={formState.validity.amount === false}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
          />
        </FormControl>
        <FormHelperText error>{formState.errors.amount || ""}</FormHelperText>
      </Grid>
      <Grid container justify="flex-end" className={classes.padding}>
        <Button
          variant="contained"
          color="primary"
          disabled={formState.validity.amount === false}
          onClick={handleSubmit}
        >
          Withdraw
        </Button>
      </Grid>
    </Grid>
  );
};

export { ManageCash };
