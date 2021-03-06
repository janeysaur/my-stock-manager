import React from "react";
import { NextPage } from "next";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import {
  CssBaseline,
  Container,
  Toolbar,
  Typography,
  Paper,
  Grid,
  makeStyles,
  CircularProgress
} from "@material-ui/core";
import {
  selectCashBalance,
  selectTransactionHistory,
  selectCurrentShareHoldings
} from "../store/selectors";
import { Transaction, ShareHolding } from "../store/types";
import {
  addCashTransaction,
  addTrade,
  fetchCurrentHoldingsValue
} from "../store/actions";
import { ManageCash } from "../components/ManageCash";
import { ManageShares } from "../components/ManageShares";
import { ShareHoldings } from "../components/ShareHoldings";
import { TransactionHistory } from "../components/TransactionHistory";

const useStyles = makeStyles(theme => ({
  toolbar: {},
  toolbarTitle: {
    flex: 1
  },
  paper: {
    padding: theme.spacing(2),
    color: theme.palette.text.secondary,
    height: "100%"
  },
  sectionHeading: {
    fontWeight: "bold",
    paddingBottom: ".5em"
  },
  center: {
    textAlign: "center"
  },
  noResults: {
    textAlign: "center",
    padding: theme.spacing(2)
  },
  balance: {
    textAlign: "center",
    fontSize: "2em",
    fontWeight: "bold",
    paddingBottom: "1em"
  }
}));

type Props = {
  balance: number;
  transactions: Transaction[];
  holdings: ShareHolding[];
  addCashTransaction: typeof addCashTransaction;
  addTrade: typeof addTrade;
};

const Home: NextPage<Props> = ({
  balance,
  transactions,
  holdings,
  addCashTransaction,
  addTrade
}) => {
  const classes = useStyles();

  const [portfolioValue, setPortfolioValue] = React.useState();
  const [loadingPortfolioValue, setLoadingPortfolioValue] = React.useState(
    true
  );
  React.useEffect(() => {
    setLoadingPortfolioValue(true);
    fetchCurrentHoldingsValue(holdings).then(totalValue => {
      setPortfolioValue(totalValue);
      setLoadingPortfolioValue(false);
    });
  }, [holdings]);

  return (
    <>
      <CssBaseline />
      <Container>
        <Toolbar className={classes.toolbar}>
          <Typography
            component="h1"
            variant="h5"
            color="inherit"
            align="center"
            noWrap
            className={classes.toolbarTitle}
          >
            My stock manager
          </Typography>
        </Toolbar>
        <Grid container spacing={3}>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography
                component="h4"
                align="center"
                className={classes.sectionHeading}
              >
                Cash account balance
              </Typography>
              <Typography className={classes.balance}>
                {new Intl.NumberFormat("en-AU", {
                  style: "currency",
                  currency: "AUD"
                }).format(balance)}
              </Typography>
              <Grid item xs={12}>
                <ManageCash
                  balance={balance}
                  addTransaction={addCashTransaction}
                />
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography
                component="h4"
                align="center"
                className={classes.sectionHeading}
              >
                Let's trade!
              </Typography>
              <ManageShares
                balance={balance}
                holdings={holdings}
                buyShares={addTrade}
                sellShares={(symbol, quantity, price) =>
                  addTrade(symbol, -1 * quantity, price)
                }
              />
            </Paper>
          </Grid>
          <Grid item xs={4}>
            <Paper className={classes.paper}>
              <Typography
                component="h4"
                align="center"
                className={classes.sectionHeading}
              >
                Share holdings
              </Typography>
              {holdings.length > 0 ? (
                <div className={classes.center}>
                  {portfolioValue === undefined || loadingPortfolioValue ? (
                    <CircularProgress />
                  ) : (
                    <Typography className={classes.balance}>
                      {new Intl.NumberFormat("en-AU", {
                        style: "currency",
                        currency: "AUD"
                      }).format(portfolioValue)}
                    </Typography>
                  )}
                  <ShareHoldings holdings={holdings} />
                </div>
              ) : (
                <div className={classes.noResults}>
                  You don't have any holdings yet.
                </div>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12}>
            <Paper className={classes.paper}>
              <Typography
                component="h4"
                align="center"
                className={classes.sectionHeading}
              >
                Transaction history
              </Typography>
              <TransactionHistory transactions={transactions} />
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

const mapStateToProps = state => ({
  balance: selectCashBalance(state),
  transactions: selectTransactionHistory(state),
  holdings: selectCurrentShareHoldings(state)
});

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      addCashTransaction,
      addTrade
    },
    dispatch
  );
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);
