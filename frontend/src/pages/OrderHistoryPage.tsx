import { Helmet } from "react-helmet-async";
import { useNavigate } from "react-router-dom";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useGetOrderHistoryQuery } from "../hooks/orderHooks";
import { ApiError } from "../interfaces/ApiError";
import { getError } from "../utils";
import Button from "@mui/material/Button";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

export default function OrderHistoryPage() {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetOrderHistoryQuery();

  return (
    <div style={{ padding: "20px" }}>
      <Helmet>
        <title>Előző vásárlásaim</title>
      </Helmet>

      <Typography variant="h4" component="h1" gutterBottom>
        Előző vásárlásaim
      </Typography>

      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant="error">{getError(error as ApiError)}</MessageBox>
      ) : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Azonosító</TableCell>
                <TableCell>Dátum</TableCell>
                <TableCell>Teljes összeg</TableCell>
                <TableCell>Fizetve</TableCell>
                <TableCell>Szállítva</TableCell>
                <TableCell></TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders!.map((order) => (
                <TableRow key={order._id}>
                  <TableCell>{order._id}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleString()}
                  </TableCell>
                  <TableCell>{order.totalPrice} ft</TableCell>
                  <TableCell>
                    {order.isPaid
                      ? new Date(order.paidAt).toLocaleString()
                      : "Nem"}
                  </TableCell>
                  <TableCell>{order.isDelivered ? "Igen" : "Nem"}</TableCell>
                  <TableCell>
                    <Button
                      variant="contained"
                      color="primary"
                      onClick={() => navigate(`/order/${order._id}`)}
                    >
                      Részletek
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </div>
  );
}
