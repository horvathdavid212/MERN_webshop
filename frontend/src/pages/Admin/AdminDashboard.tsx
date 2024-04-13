import {
  AppBar,
  Box,
  Container,
  Stack,
  Tab,
  TabProps,
  Tabs,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  Link,
  Outlet,
  useLocation,
  useMatch,
  useResolvedPath,
} from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import ShoppingBasketIcon from "@mui/icons-material/ShoppingBasket";
import ReceiptIcon from "@mui/icons-material/Receipt";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import { Helmet } from "react-helmet-async";

const AdminDashboard = () => {
  const location = useLocation();
  const isOnAdminPage = location.pathname === "/admin";

  function LinkTab(props: any) {
    let resolved = useResolvedPath(props.to);
    let match = useMatch({ path: resolved.pathname, end: false });

    return (
      <Tab
        component={Link}
        {...props}
        to={props.to}
        sx={{
          color: "white",
          "&:hover": {
            opacity: 1,
            transition: "opacity 0.3s ease-in-out",
          },
        }}
        selected={match ? true : false}
      />
    );
  }

  return (
    <>
      <Helmet>
        <title>Admin Felület</title>
      </Helmet>
      <AppBar
        position="static"
        color="primary"
        sx={{
          borderRadius: 2,
          boxShadow: 10,
        }}
      >
        <Toolbar>
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, color: "white" }}
          >
            <Link
              to="/admin"
              style={{ textDecoration: "none", color: "inherit" }}
            >
              Admin Felület
            </Link>
          </Typography>
          <Tabs
            centered
            value={false}
            textColor="inherit"
            indicatorColor="secondary"
          >
            <LinkTab
              icon={<PeopleIcon />}
              label="Felhasználók"
              to="/admin/users"
            />
            <LinkTab
              icon={<ShoppingBasketIcon />}
              label="Termékek"
              to="/admin/products"
            />
            <LinkTab
              icon={<ReceiptIcon />}
              label="Rendelések"
              to="/admin/orders"
            />
            <LinkTab
              icon={<LocalOfferIcon />}
              label="Kuponok"
              to="/admin/coupons"
            />
          </Tabs>
        </Toolbar>
      </AppBar>

      {isOnAdminPage && (
        <Stack
          direction="column"
          spacing={2}
          sx={{
            mt: 2,
            justifyContent: "center",
            alignItems: "center",
            flexGrow: 1,
          }}
        >
          <Typography variant="h4" component="h1" sx={{ mt: 3, mb: 2 }}>
            Üdv az admin felületen!
          </Typography>

          <Typography variant="h5" sx={{ mb: 2 }}>
            Itt tudsz felhasználókat, termékeket, rendeléseket és kuponokat
            kezelni. Válassz a fenti menüpontok közül a navigációhoz.
          </Typography>
        </Stack>
      )}
      <Container component="main" sx={{ mt: 3, mb: 2, flexGrow: 1 }}>
        <Outlet />
      </Container>
    </>
  );
};

export default AdminDashboard;
