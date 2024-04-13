import { useContext } from "react";
import { Link } from "react-router-dom";
import { Store } from "../Store";
import { CartItem } from "../interfaces/Cart";
import { convertProductToCartItem } from "../utils";
import { toast } from "react-toastify";
import Card from "@mui/material/Card";
import CardActionArea from "@mui/material/CardActionArea";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import Stack from "@mui/material/Stack";
import Rating from "./Rating";
import { Product } from "../interfaces/Product";

import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import {
  useAddToFavoritesMutation,
  useGetFavoriteProductsQuery,
  useRemoveFromFavoritesMutation,
} from "../hooks/favoritesHooks";

import { useQueryClient } from "@tanstack/react-query";

const ProductItem = ({ product }: { product: Product }) => {
  const { state, dispatch } = useContext(Store);
  const queryClient = useQueryClient();

  const { data: favoriteProducts } = useGetFavoriteProductsQuery();
  const addMutation = useAddToFavoritesMutation();
  const removeMutation = useRemoveFromFavoritesMutation();

  const addToCartHandler = async () => {
    const item = convertProductToCartItem(product);
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const quantity = existItem ? existItem.quantity + 1 : 1;

    if (product.countInStock < quantity) {
      toast.warn("A termék elfogyott.");
      return;
    }

    dispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, quantity },
    });

    toast.success("Termék hozzáadva a kosárhoz.");
  };

  const isFavorite = favoriteProducts?.some(
    (favProduct: Product) => favProduct._id === product._id
  );

  const toggleFavoriteHandler = () => {
    if (isFavorite) {
      removeMutation.mutate(product._id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
        },
        onError: () => {
          toast.error("Hiba történt a kedvencek frissítése közben.");
        },
      });
    } else {
      addMutation.mutate(product._id, {
        onSuccess: () => {
          queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
        },
        onError: () => {
          toast.error("Hiba történt a kedvencek frissítése közben.");
        },
      });
    }
  };

  return (
    <Card sx={{ maxWidth: 345, m: 1, boxShadow: 3 }}>
      <CardActionArea component={Link} to={`/product/${product.slug}`}>
        <CardMedia
          component="img"
          height="140"
          image={product.image}
          alt={product.name}
          sx={{ objectFit: "contain", padding: 2 }}
        />
        <CardContent>
          <Typography gutterBottom variant="h6" noWrap>
            {product.name}
          </Typography>
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
            }}
          >
            {product.description}
          </Typography>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Rating rating={product.rating} numReviews={product.reviewCount} />
          </Stack>
        </CardContent>
      </CardActionArea>
      <CardActions disableSpacing sx={{ justifyContent: "space-between" }}>
        <IconButton
          aria-label="add to wishlist"
          color="secondary"
          onClick={toggleFavoriteHandler}
        >
          {isFavorite ? <FavoriteIcon /> : <FavoriteBorderIcon />}
        </IconButton>
        <Typography variant="h6" color="black">
          {`${product.price.toLocaleString()} ft`}
        </Typography>
        <IconButton aria-label="add to cart" onClick={addToCartHandler}>
          <ShoppingCartIcon />
        </IconButton>
      </CardActions>
    </Card>
  );
};

export default ProductItem;
