import { ShareHolding } from "../store/types";

const ShareHoldings = ({ holdings }: { holdings: ShareHolding[] }) => (
  <table>
    <thead>
      <tr>
        <th>Stock</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      {holdings.map(({ quantity, stock }) => (
        <tr key={stock}>
          <td>{stock}</td>
          <td>{quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export { ShareHoldings };
