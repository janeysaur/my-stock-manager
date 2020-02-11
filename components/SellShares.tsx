import React from "react";
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
import { ShareHolding } from "../store/types";
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

const SellShares = ({
  holdings,
  sellShares
}: {
  holdings: ShareHolding[];
  sellShares: typeof addTrade;
}) => {
  const classes = useStyles();

  const [share, setShare] = React.useState("");
  const [quantity, setQuantity] = React.useState("");
  const [quantityError, setQuantityError] = React.useState("");
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

    setQuantityError("");
    if (share && newValue) {
      const holding = holdings.find(holding => holding.stock === share);
      if (parseInt(newValue) > holding.quantity) {
        setQuantityError(`You only hold ${holding.quantity} of this stock`);
        setIsValid(false);
      }
    }
  };

  const handleSubmit = () => {
    if (share && quantity && price) {
      sellShares(share, parseInt(quantity), parseFloat(price));
    }
  };

  return (
    <Grid container className={classes.padding}>
      <Grid item xs={12} className={classes.padding}>
        <FormControl className={classes.formControl}>
          <InputLabel id="share">Share</InputLabel>
          <Select id="share" value={share} onChange={handleShareChange}>
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
            id="quantity"
            type="number"
            label="Quantity"
            required
            value={quantity}
            error={!!quantityError}
            helperText={quantityError}
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
          Sell
        </Button>
      </Grid>
    </Grid>
  );
};

export { SellShares };
