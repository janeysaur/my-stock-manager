import React from "react";
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

  const [share, setShare] = React.useState("");
  const [quantity, setQuantity] = React.useState(0);
  const [price, setPrice] = React.useState(0);
  const [errorMessage, setErrorMessage] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  const fetchCurrentSharePrice = async symbol => {
    const currentPrice = await fetchCurrentSharePriceDebounced(symbol);
    if (currentPrice) {
      setPrice(currentPrice);
    } else {
      setPrice(0);
    }
  };

  const resetForm = () => {
    setShare("");
    setQuantity(0);
    setPrice(0);
  };

  const handleShareChange = event => {
    const newValue = event.target.value;
    setShare(newValue);
    fetchCurrentSharePrice(newValue);
    setQuantity(0);
    setPrice(0);
  };

  const handleQuantityChange = event => {
    const newValue = parseInt(event.target.value);
    setQuantity(newValue);
    if (quantity < 0) {
      setIsValid(false);
    }
  };

  React.useEffect(() => {
    setIsValid(true);
    setErrorMessage("");

    if (price <= 0) {
      setIsValid(false);
    } else if (quantity <= 0) {
      setIsValid(false);
    } else if (price * quantity > balance) {
      setIsValid(false);
      setErrorMessage("Insufficient funds");
    }
  }, [share, price, quantity, balance]);

  const handleSubmit = () => {
    if (isValid) {
      buyShares(share, quantity, price);
      resetForm();
    }
  };

  return (
    <Grid container className={classes.padding}>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <TextField
            id="share"
            type="text"
            label="Share"
            required
            value={share}
            onChange={handleShareChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <TextField
            id="quantity"
            type="number"
            label="Quantity"
            required
            value={quantity !== 0 ? quantity.toString() : ""}
            onChange={handleQuantityChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.margin} required>
          <InputLabel htmlFor="price">Current market price</InputLabel>
          <Input
            id="price"
            value={
              price > 0
                ? new Intl.NumberFormat("en-AU", {
                    style: "decimal",
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                  }).format(price)
                : ""
            }
            onChange={() => {}}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            endAdornment={
              <InputAdornment position="end">
                {share && price === 0 && <CircularProgress />}
              </InputAdornment>
            }
          />
        </FormControl>
        <FormHelperText error>{errorMessage}</FormHelperText>
      </Grid>

      <Grid container justify="flex-end" className={classes.padding}>
        <Button
          variant="contained"
          color="primary"
          disabled={!isValid}
          onClick={handleSubmit}
        >
          Buy
        </Button>
      </Grid>
    </Grid>
  );
};

export { BuyShares };
