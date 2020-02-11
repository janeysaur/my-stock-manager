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
  Input
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

const BuyShares = ({ buyShares }: { buyShares: typeof addTrade }) => {
  const classes = useStyles();

  const [share, setShare] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [price, setPrice] = React.useState("");
  const [isValid, setIsValid] = React.useState(false);

  const fetchCurrentSharePrice = async symbol => {
    const currentPrice = await fetchCurrentSharePriceDebounced(symbol);
    setPrice(
      currentPrice
        ? new Intl.NumberFormat("en-AU", {
            style: "decimal",
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
          }).format(currentPrice)
        : ""
    );
  };

  const handleShareChange = event => {
    const newValue = event.target.value;
    setShare(newValue);
    setQuantity("");
    setPrice("");
    fetchCurrentSharePrice(newValue);
  };

  const handleQuantityChange = event => {
    const newValue = event.target.value;
    setQuantity(newValue);
  };

  const handleSubmit = () => {
    if (share && quantity && price) {
      buyShares(share, parseInt(quantity), parseFloat(price));
    }
  };

  return (
    <Grid container className={classes.padding}>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <InputLabel id="share">Share</InputLabel>
          <TextField
            id="share"
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
            value={quantity}
            onChange={handleQuantityChange}
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.margin} required>
          <InputLabel htmlFor="price">Current market price</InputLabel>
          <Input
            id="price"
            value={price}
            onChange={() => {}}
            startAdornment={<InputAdornment position="start">$</InputAdornment>}
            endAdornment={
              <InputAdornment position="end">
                {share && price === "" && <CircularProgress />}
              </InputAdornment>
            }
          />
        </FormControl>
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
