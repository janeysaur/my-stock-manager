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

  const [share, setShare] = React.useState("");
  const [quantity, setQuantity] = React.useState(0);
  const [quantityError, setQuantityError] = React.useState("");
  const [price, setPrice] = React.useState(0);

  const [isValid, setIsValid] = React.useState(false);

  const fetchCurrentSharePrice = async symbol => {
    const currentPrice = await fetchCurrentSharePriceDebounced(symbol);
    setPrice(currentPrice);
  };

  const handleShareChange = event => {
    const newValue = event.target.value;
    setShare(newValue);
    setQuantity(0);
    setPrice(0);
    fetchCurrentSharePrice(newValue);
  };

  const handleQuantityChange = event => {
    const newValue = parseInt(event.target.value);
    setQuantity(newValue);
  };

  React.useEffect(() => {
    setIsValid(true);
    setQuantityError("");

    if (share === "") {
      setIsValid(false);
    } else if (quantity <= 0) {
      setIsValid(false);
    } else {
      const holding = holdings.find(holding => holding.stock === share);
      if (quantity > holding.quantity) {
        setQuantityError(`You only hold ${holding.quantity} of this stock`);
        setIsValid(false);
      }
    }
  }, [quantity]);

  const handleSubmit = () => {
    if (isValid) {
      sellShares(share, quantity, price);
      setShare("");
      setQuantity(0);
      setPrice(0);
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
            value={quantity !== 0 ? quantity.toString() : ""}
            error={share && price && (quantityError !== "" || quantity <= 0)}
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
