import React from "react";
import { useFormState } from "react-use-form-state";
import {
  makeStyles,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Grid,
  Button,
  CircularProgress,
  InputAdornment,
  Input
} from "@material-ui/core";
import AwesomeDebouncePromise from "awesome-debounce-promise";
import { ShareHolding } from "../store/types";
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

const SellShares = ({
  holdings,
  sellShares
}: {
  holdings: ShareHolding[];
  sellShares: typeof addTrade;
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
    formState.setField("share", newValue);
    formState.clearField("quantity");
  };

  const validateQuantity = (value, values) => {
    const intValue = parseInt(value);
    const { share } = values;
    if (share) {
      const holding = holdings.find(holding => holding.stock === share);
      if (intValue > holding.quantity) {
        return `You only hold ${holding.quantity} of this stock`;
      }
    }
    return isNaN(intValue) === false;
  };

  const handleSubmit = () => {
    const { share, quantity, price } = formState.values;
    sellShares(share, parseInt(quantity), parseFloat(price));
    formState.reset();
  };

  const formIsValid =
    formState.validity.share &&
    formState.validity.quantity &&
    formState.validity.price;

  return (
    <Grid container className={classes.padding}>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <InputLabel id="share">Share</InputLabel>
          <Select
            {...input.select({
              name: "share",
              onChange: handleShareChange
            })}
            value={formState.values.share}
          >
            {holdings.map(({ stock }) => (
              <MenuItem key={stock} value={stock}>
                {stock}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <TextField
            {...input.text({
              name: "quantity",
              validate: (value, values, event) =>
                validateQuantity(value, values)
            })}
            required
            error={formState.validity.quantity === false}
            helperText={formState.errors.quantity}
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
      </Grid>

      <Grid container justify="flex-end" className={classes.padding}>
        <Button
          variant="contained"
          color="primary"
          disabled={!formIsValid}
          onClick={handleSubmit}
        >
          Sell
        </Button>
      </Grid>
    </Grid>
  );
};

export { SellShares };
