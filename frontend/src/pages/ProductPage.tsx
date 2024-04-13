import React, { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  Box,
  Grid,
  Typography,
  Button,
  Tab,
  Tabs,
  Badge,
  CircularProgress,
  Alert,
  CardMedia,
  Card,
  CardContent,
} from "@mui/material";
import TabPanel from "@mui/lab/TabPanel";
import TabContext from "@mui/lab/TabContext";
import TabList from "@mui/lab/TabList";

import {
  useGetProductDetailsBySlugQuery,
  useRateProduct,
} from "../hooks/productHooks";
import { useGetProductRatingsQuery } from "../hooks/productHooks";

import { Store } from "../Store";
import { ApiError } from "../interfaces/ApiError";
import { getError, convertProductToCartItem } from "../utils";
import Rating from "../components/Rating";
import { IRating } from "../interfaces/Product";
import { BsStarFill } from "react-icons/bs";

const ProductPage = () => {
  const params = useParams();
  const { slug } = params;
  const navigate = useNavigate();

  const [selectedRating, setSelectedRating] = useState(0);
  const rateProduct = useRateProduct();

  const {
    data: product,
    isLoading,
    error,
  } = useGetProductDetailsBySlugQuery(slug!);

  console.log(product?._id);

  const { state, dispatch } = useContext(Store);
  const { cart } = state;
  const [value, setValue] = React.useState("1");

  console.log(state.userInfo?._id);

  const {
    data: ratings,
    isLoading: isLoadingRatings,
    error: ratingsError,
  } = useGetProductRatingsQuery(product?._id || "");

  // console.log(ratings);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  const addToCartHandler = async () => {
    const existItem = cart.cartItems.find((x) => x._id === product!._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;
    if (product!.countInStock < quantity) {
      toast.warn("Termék kifogyott.");
      return;
    }
    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...convertProductToCartItem(product!), quantity },
    });
    toast.success("Termék hozzáadva a kosárhoz.");
    navigate("/cart");
  };

  if (isLoading) return <CircularProgress />;
  if (error)
    return (
      <Alert severity="error">{getError(error as unknown as ApiError)}</Alert>
    );
  if (!product) return <Alert severity="error">Termék nem található</Alert>;

  console.log(ratings);

  const submitRating = () => {
    if (selectedRating > 0 && state.userInfo?._id) {
      rateProduct.mutate(
        {
          productId: product._id,
          userId: state.userInfo._id,
          rating: selectedRating,
        },
        {
          onSuccess: () => {
            toast.success("Értékelés sikeresen elküldve");
          },
          onError: (error) => {
            toast.error(`Hiba az értékelés elküldésekor: ${error.message}`);
          },
        }
      );
    } else {
      toast.error("Kérjük, válasszon egy értékelést a beküldés előtt.");
    }
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      <Helmet>
        <title>{product.name}</title>
      </Helmet>
      <Grid container spacing={2}>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardMedia
              component="img"
              image={product.image}
              alt={product.name}
              onError={(e: any) => {
                e.currentTarget.src = "path_to_placeholder_image";
              }}
              sx={{
                height: "auto",
                maxWidth: "100%",
                maxHeight: 400,
                objectFit: "contain",
                margin: "auto",
              }}
            />
          </Card>
        </Grid>
        <Grid item xs={12} md={6}>
          <Card elevation={0}>
            <CardContent>
              <Typography gutterBottom variant="h5" component="div">
                {product.name}
              </Typography>
              <Rating
                rating={product.rating}
                numReviews={product.reviewCount}
              />
              <Typography variant="h6">Ár: {product.price} ft</Typography>
              <Typography variant="body2" color="text.secondary">
                Készlet:{" "}
                {product.countInStock > 0 ? "Raktáron" : "Nincs raktáron"}
              </Typography>
              {product.countInStock > 0 && (
                <Button variant="contained" onClick={addToCartHandler}>
                  Kosárba
                </Button>
              )}
              <TabContext value={value}>
                <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                  <TabList onChange={handleChange} aria-label="product tabs">
                    <Tab label="Leírás" value="1" />
                    <Tab label="Értékelések" value="2" />
                    <Tab label="Termék értékelése" value="3" />
                  </TabList>
                </Box>
                <TabPanel value="1">{product.description}</TabPanel>
                <TabPanel value="2">
                  {isLoadingRatings ? (
                    <CircularProgress />
                  ) : ratingsError ? (
                    <Alert severity="error">
                      Hiba történt az értékelések betöltésekor
                    </Alert>
                  ) : (
                    <Box>
                      {ratings?.length ? (
                        ratings.map((rating: IRating, index: number) => (
                          <Box key={index} sx={{ mb: 1 }}>
                            <Rating
                              rating={rating.rating}
                              username={rating.user.name}
                            />
                          </Box>
                        ))
                      ) : (
                        <Typography>Nincsenek értékelések</Typography>
                      )}
                    </Box>
                  )}
                </TabPanel>
                <TabPanel value="3">
                  <Typography variant="h6" sx={{ mb: 2 }}>
                    Értékeld a terméket
                  </Typography>
                  <Box>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <BsStarFill
                        key={star}
                        style={{
                          cursor: "pointer",
                          color: selectedRating >= star ? "gold" : "grey",
                        }}
                        onClick={() => setSelectedRating(star)}
                      />
                    ))}
                  </Box>
                  <Button
                    onClick={submitRating}
                    disabled={selectedRating === 0 || !state.userInfo}
                  >
                    Értékelés küldése
                  </Button>
                </TabPanel>
              </TabContext>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default ProductPage;
