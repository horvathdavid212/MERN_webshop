import {
  useGetFavoriteProductsQuery,
  useRemoveFromFavoritesMutation,
} from "../hooks/favoritesHooks";
import {
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardMedia,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import { Link } from "react-router-dom";
import { Product } from "../interfaces/Product";
import LoadingBox from "../components/LoadingBox";
import MessageBox from "../components/MessageBox";
import { useQueryClient } from "@tanstack/react-query";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";

const FavoritesPage = () => {
  const queryClient = useQueryClient();

  const {
    data: favoriteProducts,
    isLoading,
    isError,
  } = useGetFavoriteProductsQuery();
  const { mutate: removeFromFavorites } = useRemoveFromFavoritesMutation();

  const handleRemoveFromFavorites = (productId: string) => {
    removeFromFavorites(productId, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ["favoriteProducts"] });
      },
    });
  };

  if (isLoading) return <LoadingBox />;
  if (isError)
    return <MessageBox variant="error">{isError.toString()}</MessageBox>;

  return (
    <Box style={{ padding: "1rem" }}>
      <Typography variant="h4" gutterBottom>
        Kívánságlista
      </Typography>
      <Grid container spacing={4}>
        {favoriteProducts.map((product: Product) => (
          <Grid item key={product._id} xs={12} sm={6} md={4} lg={3}>
            <Card sx={{ maxWidth: 345, width: "100%" }}>
              <CardActionArea component={Link} to={`/product/${product.slug}`}>
                <CardMedia
                  component="img"
                  height="140"
                  image={product.image}
                  alt={product.name}
                  sx={{ objectFit: "contain", padding: 2 }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" component="div">
                    {product.name}
                  </Typography>
                  Raktáron: {product.countInStock} db
                </CardContent>
              </CardActionArea>
              <CardActions disableSpacing>
                <IconButton
                  aria-label="remove from favorites"
                  onClick={() => handleRemoveFromFavorites(product._id)}
                >
                  <DeleteIcon />
                </IconButton>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default FavoritesPage;
