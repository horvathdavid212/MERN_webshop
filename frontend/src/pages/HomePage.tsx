import { ApiError } from "../interfaces/ApiError";
import { getError } from "../utils";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import ProductItem from "../components/ProductItem";
import { Helmet } from "react-helmet-async";
import { useGetProductsQuery } from "../hooks/productHooks";
import Grid from "@mui/material/Grid";
import { useLocation } from "react-router-dom";

const HomePage = () => {
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const category = query.get("category") || undefined;

  const { data: products, isLoading, error } = useGetProductsQuery(category);

  return isLoading ? (
    <LoadingBox />
  ) : error ? (
    <MessageBox variant="error">
      {getError(error as unknown as ApiError)}
    </MessageBox>
  ) : (
    <>
      <Helmet>
        <title>Shop</title>
      </Helmet>
      <Grid container spacing={2}>
        {products!.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product._id}>
            <ProductItem product={product} />
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default HomePage;
