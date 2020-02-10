interface Holding {
  stock: string;
  quantity: number;
}

const ShareHoldings = ({ holdings }: { holdings: Holding[] }) => (
  <table>
    <thead>
      <tr>
        <th>Stock</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      {holdings.map(({ stock, quantity }) => (
        <tr key={stock}>
          <td>{stock}</td>
          <td>{quantity}</td>
        </tr>
      ))}
    </tbody>
  </table>
);

export { ShareHoldings };
