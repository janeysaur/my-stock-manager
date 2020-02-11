import React from "react";
import { Paper, Tabs, Tab, makeStyles } from "@material-ui/core";
import { BuyShares } from "./BuyShares";
import { SellShares } from "./SellShares";
import { ShareHolding } from "../store/types";
import { addTrade } from "../store/actions";

enum TradeType {
  BUY = "buy",
  SELL = "sell"
}

const tabs: TradeType[] = [TradeType.BUY, TradeType.SELL];

const ManageShares = ({
  holdings,
  buyShares,
  sellShares
}: {
  holdings: ShareHolding[];
  buyShares: typeof addTrade;
  sellShares: typeof addTrade;
}) => {
  const [action, setAction] = React.useState(TradeType.BUY);

  const handleTabChange = (event, newIndex) => {
    setAction(tabs[newIndex]);
  };

  return (
    <Paper>
      <Tabs value={tabs.indexOf(action)} onChange={handleTabChange} centered>
        <Tab label="Buy" />
        <Tab label="Sell" />
      </Tabs>
      {action === TradeType.BUY && <BuyShares buyShares={buyShares} />}
      {action === TradeType.SELL && (
        <SellShares holdings={holdings} sellShares={sellShares} />
      )}
    </Paper>
  );
};

export { ManageShares };
