import React from "react";
import { Paper, Tabs, Tab } from "@material-ui/core";
import { ShareHolding } from "../store/types";
import { addTrade } from "../store/actions";
import { BuyShares } from "./BuyShares";
import { SellShares } from "./SellShares";

enum TradeType {
  BUY = "buy",
  SELL = "sell"
}

const tabs: TradeType[] = [TradeType.BUY, TradeType.SELL];

const ManageShares = ({
  balance,
  holdings,
  buyShares,
  sellShares
}: {
  balance: number;
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
      {action === TradeType.BUY && (
        <BuyShares balance={balance} buyShares={buyShares} />
      )}
      {action === TradeType.SELL && (
        <SellShares holdings={holdings} sellShares={sellShares} />
      )}
    </Paper>
  );
};

export { ManageShares };
