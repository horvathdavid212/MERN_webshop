import { useContext, useState } from "react";
import { Link, Outlet } from "react-router-dom";
import { Store } from "./Store";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import Container from "@mui/material/Container";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import { useGetCategoriesQuery } from "./hooks/productHooks";
import LoadingBox from "./components/LoadingBox";
import MessageBox from "./components/MessageBox";
import { ApiError } from "./interfaces/ApiError";
import { getError } from "./utils";
import SearchBox from "./components/SearchBox";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import FavoriteIcon from "@mui/icons-material/Favorite";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const App = () => {
  const {
    state: { cart, userInfo },
    dispatch,
  } = useContext(Store);

  const [sidebarIsOpen, setSidebarIsOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event: any) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const signoutHandler = () => {
    dispatch({ type: "USER_SIGNOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("cartItems");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/signin";
  };

  const { data: categories, isLoading, error } = useGetCategoriesQuery();

  const drawer = (
    <Box onClick={() => setSidebarIsOpen(false)} sx={{ textAlign: "center" }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Webshop
      </Typography>
      <List>
        {isLoading ? (
          <LoadingBox />
        ) : error ? (
          <MessageBox variant="error">{getError(error as ApiError)}</MessageBox>
        ) : (
          categories?.map((category) => (
            <ListItem
              button
              key={category}
              component={Link}
              to={`/search?category=${category}`}
            >
              <ListItemText primary={category} />
            </ListItem>
          ))
        )}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
      <ToastContainer position="bottom-center" limit={1} />
      <AppBar position="static">
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            aria-label="menu"
            sx={{ mr: 2 }}
            onClick={() => setSidebarIsOpen(true)}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            color={"white"}
            variant="h6"
            component={Link}
            to="/"
            sx={{
              textDecoration: "none",
              fontWeight: "bold",
              letterSpacing: "0.1rem",
              "&:hover": {
                color: "lightgray",
              },
            }}
          >
            Webshop
          </Typography>
          <SearchBox />
          <Box sx={{ display: "flex", alignItems: "center" }}>
            {userInfo && userInfo.isAdmin && (
              <Button color="warning" component={Link} to="/admin">
                <AdminPanelSettingsIcon />
                ADMIN
              </Button>
            )}

            <Button color="inherit" component={Link} to="/cart">
              <ShoppingCartIcon />
              {cart.cartItems.length > 0 && (
                <Badge
                  badgeContent={cart.cartItems.reduce(
                    (a, c) => a + c.quantity,
                    0
                  )}
                  color="error"
                ></Badge>
              )}
            </Button>

            <Button
              id="favoritesButton"
              color="inherit"
              component={Link}
              to="/favorites"
            >
              <FavoriteIcon />
            </Button>

            {userInfo ? (
              <div>
                <Button id="userButton" color="inherit" onClick={handleMenu}>
                  {userInfo.name}
                </Button>
                <Menu
                  id="menu-appbar"
                  anchorEl={anchorEl}
                  anchorOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  keepMounted
                  transformOrigin={{
                    vertical: "top",
                    horizontal: "right",
                  }}
                  open={open}
                  onClose={handleClose}
                >
                  <MenuItem
                    id="orderHistoryButton"
                    component={Link}
                    to="/orderhistory"
                    onClick={handleClose}
                  >
                    Előző vásárlásaim
                  </MenuItem>
                  <MenuItem
                    component={Link}
                    to="/profile"
                    onClick={handleClose}
                  >
                    Felhasználói fiók
                  </MenuItem>
                  <MenuItem onClick={signoutHandler}>Kijelentkezés</MenuItem>
                </Menu>
              </div>
            ) : (
              <Button
                id="loginButton"
                color="inherit"
                component={Link}
                to="/signin"
              >
                Belépés
              </Button>
            )}
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        open={sidebarIsOpen}
        onClose={() => setSidebarIsOpen(false)}
      >
        {drawer}
      </Drawer>
      <Container component="main" sx={{ mt: 3, mb: 2, flexGrow: 1 }}>
        <Outlet />
      </Container>
      <Box
        component="footer"
        sx={{ p: 3, mt: "auto", backgroundColor: "background.paper" }}
      >
        <Typography variant="body2" color="text.secondary" align="center">
          Horváth Dávid - 2024
        </Typography>
      </Box>
    </Box>
  );
};

export default App;
