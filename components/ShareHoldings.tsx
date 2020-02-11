import { ShareHolding } from "../store/types";
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody
} from "@material-ui/core";

const ShareHoldings = ({ holdings }: { holdings: ShareHolding[] }) => (
  <TableContainer>
    <Table>
      <TableHead>
        <TableRow>
          <TableCell variant="head">Stock</TableCell>
          <TableCell variant="head" align="right">
            Quantity
          </TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {holdings.map(({ quantity, stock }) => (
          <TableRow key={stock}>
            <TableCell>{stock}</TableCell>
            <TableCell align="right">{quantity}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  </TableContainer>
);

export { ShareHoldings };
