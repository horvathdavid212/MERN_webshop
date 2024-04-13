import { useContext } from "react";
import { Helmet } from "react-helmet-async";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import { toast } from "react-toastify";
import { Store } from "../Store";
import MessageBox from "../components/MessageBox";
import { CartItem } from "../interfaces/Cart";
import {
  Box,
  Grid,
  Button,
  Typography,
  Card,
  CardContent,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import DeleteIcon from "@mui/icons-material/Delete";

export default function CartPage() {
  const navigate = useNavigate();
  const {
    state: {
      cart: { cartItems },
    },
    dispatch,
  } = useContext(Store);

  const updateCartHandler = async (item: CartItem, quantity: number) => {
    if (item.countInStock < quantity) {
      toast.warn("Nincs raktáron");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });
  };

  const checkoutHandler = () => {
    navigate("/signin?redirect=/shipping");
  };

  const removeItemHandler = (item: CartItem) => {
    dispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Helmet>
        <title>Kosár</title>
      </Helmet>
      <Typography variant="h4" gutterBottom>
        Kosár
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}>
          {cartItems.length === 0 ? (
            <MessageBox>
              Üres a kosár. <RouterLink to="/">Vissza</RouterLink>
            </MessageBox>
          ) : (
            <List>
              {cartItems.map((item: CartItem) => (
                <ListItem key={item._id} divider>
                  <Grid container alignItems="center" spacing={1}>
                    <Grid item xs={6}>
                      <Box
                        component="img"
                        src={item.image}
                        alt={item.name}
                        sx={{
                          width: "100%",
                          maxWidth: "5rem",
                          height: "auto",
                          mr: 2,
                        }}
                      />
                      <RouterLink
                        to={`/product/${item.slug}`}
                        style={{ textDecoration: "none", color: "inherit" }}
                      >
                        {item.name}
                      </RouterLink>
                    </Grid>
                    <Grid
                      item
                      style={{ display: "flex", alignItems: "center" }}
                    >
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity - 1)
                        }
                        disabled={item.quantity === 1}
                      >
                        <RemoveCircleOutlineIcon />
                      </Button>
                      <span>{item.quantity}</span>
                      <Button
                        onClick={() =>
                          updateCartHandler(item, item.quantity + 1)
                        }
                        disabled={item.quantity === item.countInStock}
                      >
                        <AddCircleOutlineIcon />
                      </Button>
                    </Grid>
                    <Grid item>{item.price} ft</Grid>
                    <Grid item>
                      <Button onClick={() => removeItemHandler(item)}>
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </ListItem>
              ))}
            </List>
          )}
        </Grid>
        <Grid item xs={12} md={4}>
          <Card>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                Összesen ({cartItems.reduce((a, c) => a + c.quantity, 0)}{" "}
                termék):
                <br />
                {cartItems
                  .reduce((a, c) => a + c.price * c.quantity, 0)
                  .toLocaleString("hu-HU")}{" "}
                ft
              </Typography>
              <Button
                variant="contained"
                color="primary"
                fullWidth
                onClick={checkoutHandler}
                disabled={cartItems.length === 0}
              >
                Tovább a fizetéshez
              </Button>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
