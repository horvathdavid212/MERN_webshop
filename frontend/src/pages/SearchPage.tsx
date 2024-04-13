import React from "react";
import { useLocation } from "react-router-dom";
import { useGetProductsQuery } from "../hooks/productHooks";
import ProductItem from "../components/ProductItem";
import MessageBox from "../components/MessageBox";
import LoadingBox from "../components/LoadingBox";
import { Grid, Typography } from "@mui/material";

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

const SearchPage = () => {
  const query = useQuery();
  const category = query.get("category");
  const searchKeyword = query.get("searchKeyword");
  const {
    data: products,
    isLoading,
    error,
  } = useGetProductsQuery(category || undefined, searchKeyword || undefined);

  return (
    <>
      {isLoading ? (
        <LoadingBox />
      ) : error ? (
        <MessageBox variant={"error"}>Hiba a termékek lekérésekor</MessageBox>
      ) : (
        <div>
          {category && (
            <Typography variant="h5" component="h2" gutterBottom>
              {category} kategória
            </Typography>
          )}
          <Grid container spacing={2}>
            {products &&
              products.map((product) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={product.slug}>
                  <ProductItem product={product} />
                </Grid>
              ))}
          </Grid>
        </div>
      )}
    </>
  );
};

export default SearchPage;
