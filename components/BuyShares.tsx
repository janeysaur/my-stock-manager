import React from "react";
import { useFormState } from "react-use-form-state";
import {
  makeStyles,
  FormControl,
  InputLabel,
  TextField,
  Grid,
  Button,
  CircularProgress,
  InputAdornment,
  Input,
  FormHelperText
} from "@material-ui/core";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { fetchCurrentSharePrice, addTrade } from "../store/actions";

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 250
  },
  margin: {
    margin: theme.spacing(1)
  },
  padding: {
    padding: theme.spacing(1)
  }
}));

const fetchCurrentSharePriceDebounced = AwesomeDebouncePromise(
  fetchCurrentSharePrice,
  500
);

const BuyShares = ({
  balance,
  buyShares
}: {
  balance: number;
  buyShares: typeof addTrade;
}) => {
  const classes = useStyles();

  const [formState, input] = useFormState();

  const [fetchingSharePrice, setFetchingSharePrice] = React.useState();
  const fetchCurrentSharePrice = async symbol => {
    setFetchingSharePrice(true);
    formState.clearField("price");
    const currentPrice = await fetchCurrentSharePriceDebounced(symbol);
    if (currentPrice) {
      formState.setField("price", currentPrice);
    }
    setFetchingSharePrice(false);
  };

  const handleShareChange = event => {
    const newValue = event.target.value;
    fetchCurrentSharePrice(newValue);
  };

  const validateQuantity = value => {
    const intValue = parseInt(value);
    return isNaN(intValue) === false;
  };

  const handleSubmit = () => {
    const { share, quantity, price } = formState.values;
    buyShares(share, parseInt(quantity), parseFloat(price));
    formState.reset();
  };

  let hasSufficientFunds = true;
  if (formState.values.quantity && formState.values.price) {
    const floatPrice = parseFloat(formState.values.price);
    const intQuantity = parseInt(formState.values.quantity);
    hasSufficientFunds = floatPrice * intQuantity < balance;
  }

  const formIsValid =
    hasSufficientFunds &&
    formState.validity.share &&
    formState.validity.quantity &&
    formState.validity.price;

  return (
    <Grid container className={classes.padding}>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <TextField
            {...input.text({
              name: "share",
              onChange: handleShareChange
            })}
            label="Share"
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <TextField
            {...input.number({
              name: "quantity",
              validate: (value, values, event) => validateQuantity(value)
            })}
            label="Quantity"
            required
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.margin} required>
          <InputLabel htmlFor="price">Current market price</InputLabel>
          <Input
            {...input.text({
              name: "price"
            })}
            disabled
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            endAdornment={
              <InputAdornment position="end">
                {fetchingSharePrice && <CircularProgress />}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormHelperText error>
          {!hasSufficientFunds ? "Insufficient funds" : ""}
        </FormHelperText>
      </Grid>

      <Grid container justify="flex-end" className={classes.padding}>
        <Button
          variant="contained"
          color="primary"
          disabled={!formIsValid}
          onClick={handleSubmit}
        >
          Buy
        </Button>
      </Grid>
    </Grid>
  );
};

export { BuyShares };
