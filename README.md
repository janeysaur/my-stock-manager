# Description

A simple stock manager app to track a fake stock portfolio and cash balance.
Users can:

- Add or remove amounts from their cash balance, which is then used for buying shares
- Execute "buy" or "sell" orders for a quantity of stock
- See current cash and share holdings

This example uses:

- Next.js as the React app framework
- Redux, Reselect and Redux-Persist for managing, reading and persisting state
- Material-UI for style
- Yahoo Finance API (via RapidAPI) for fetching current share prices

Note: this example assumes a single currency, and only fetches share prices from the US market.

# How to use

Install it and run:

```bash
npm install
npm run dev
# or
yarn
yarn dev
```
