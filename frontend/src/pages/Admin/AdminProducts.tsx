import React, { useState } from "react";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  useGetAllProducts,
  useAddNewProduct,
  useUpdateProduct,
  useDeleteProduct,
} from "../../hooks/adminHooks";
import { Product } from "../../interfaces/Product";

const AdminProducts = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null);

  const { data: products, refetch } = useGetAllProducts();
  const addNewProductMutation = useAddNewProduct();
  const updateProductMutation = useUpdateProduct();
  const deleteProductMutation = useDeleteProduct();

  const handleClose = () => {
    setOpen(false);
    setCurrentProduct(null); // Reset current product on close
  };

  const handleOpenForEdit = (product: Product) => {
    setCurrentProduct(product);
    setOpen(true);
  };

  const handleOpenForAdd = () => {
    setOpen(true);
  };

  const handleDelete = (productId: string) => {
    deleteProductMutation.mutate(productId, {
      onSuccess: () => {
        refetch(); // Refetch products after deletion
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const productData = {
      name: formData.get("name")?.toString() || "",
      slug: formData.get("slug")?.toString() || "",
      image: formData.get("image")?.toString() || "",
      category: formData.get("category")?.toString() || "",
      brand: formData.get("brand")?.toString() || "",
      price: Number(formData.get("price")),
      description: formData.get("description")?.toString() || "",
      countInStock: Number(formData.get("countInStock")),
    };

    if (currentProduct) {
      updateProductMutation.mutate(
        { id: currentProduct._id, updatedProduct: productData },
        {
          onSuccess: () => {
            refetch();
            handleClose();
          },
        }
      );
    } else {
      addNewProductMutation.mutate(productData, {
        onSuccess: () => {
          refetch();
          handleClose();
        },
      });
    }
  };

  return (
    <>
      <Typography variant="h4" sx={{ mb: 2 }}>
        Termékek Kezelése
      </Typography>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleOpenForAdd}
      >
        Új termék hozzáadása
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Név</TableCell>
              <TableCell>Kategória</TableCell>
              <TableCell>Ár</TableCell>
              <TableCell>Raktáron</TableCell>
              <TableCell>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products?.map((product: Product) => (
              <TableRow key={product._id}>
                <TableCell>{product.name}</TableCell>
                <TableCell>{product.category}</TableCell>
                <TableCell>{product.price}</TableCell>
                <TableCell>{product.countInStock}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForEdit(product)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(product._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Product Dialog */}
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentProduct ? "Termék szerkesztése" : "Új termék hozzáadása"}
        </DialogTitle>
        <form onSubmit={handleSubmit}>
          <DialogContent>
            <TextField
              margin="dense"
              name="name"
              label="Név"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.name}
            />
            <TextField
              margin="dense"
              name="slug"
              label="Slug"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.slug}
            />
            <TextField
              margin="dense"
              name="image"
              label="Kép URL"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.image}
            />
            <TextField
              margin="dense"
              name="category"
              label="Kategória"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.category}
            />
            <TextField
              margin="dense"
              name="brand"
              label="Márka"
              type="text"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.brand}
            />
            <TextField
              margin="dense"
              name="price"
              label="Ár"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.price}
            />
            <TextField
              margin="dense"
              name="description"
              label="Leírás"
              type="text"
              fullWidth
              variant="outlined"
              multiline
              rows={4}
              defaultValue={currentProduct?.description}
            />
            <TextField
              margin="dense"
              name="countInStock"
              label="Raktáron"
              type="number"
              fullWidth
              variant="outlined"
              defaultValue={currentProduct?.countInStock}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Mégse</Button>
            <Button type="submit">Mentés</Button>
          </DialogActions>
        </form>
      </Dialog>
    </>
  );
};

export default AdminProducts;
