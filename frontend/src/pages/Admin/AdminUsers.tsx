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
import { UserInfo } from "../../interfaces/UserInfo";
import {
  useAddNewUser,
  useDeleteUser,
  useGetAllUsers,
  useUpdateUser,
} from "../../hooks/adminHooks";

const AdminUsers = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserInfo | null>(null);

  const { data: users, refetch } = useGetAllUsers();
  const addNewUserMutation = useAddNewUser();
  const updateUserMutation = useUpdateUser();
  const deleteUserMutation = useDeleteUser();

  const handleClose = () => {
    setOpen(false);
    setCurrentUser(null);
  };

  const handleOpenForEdit = (user: UserInfo) => {
    setCurrentUser(user);
    setOpen(true);
  };

  const handleOpenForAdd = () => {
    setOpen(true);
  };

  const handleDelete = (userId: string) => {
    deleteUserMutation.mutate(userId, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const userData = {
      name: formData.get("name")?.toString() || "",
      email: formData.get("email")?.toString() || "",
      isAdmin: formData.get("isAdmin") === "true",
      ...(formData.get("password") && {
        password: formData.get("password")?.toString(),
      }),
    };

    if (currentUser) {
      updateUserMutation.mutate(
        { id: currentUser._id, updatedUser: userData },
        {
          onSuccess: () => {
            refetch();
            handleClose();
          },
        }
      );
    } else {
      addNewUserMutation.mutate(userData, {
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
        Felhasználók Kezelése
      </Typography>
      <Button
        startIcon={<AddIcon />}
        variant="contained"
        onClick={handleOpenForAdd}
      >
        Új felhasználó hozzáadása
      </Button>
      <TableContainer component={Paper} sx={{ mt: 3 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Név</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Admin</TableCell>
              <TableCell>Műveletek</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users?.map((user: UserInfo) => (
              <TableRow key={user._id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.isAdmin ? "Igen" : "Nem"}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleOpenForEdit(user)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user._id)}>
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>
          {currentUser
            ? "Felhasználó szerkesztése"
            : "Új felhasználó hozzáadása"}
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
              defaultValue={currentUser?.name}
            />
            <TextField
              margin="dense"
              name="email"
              label="Email"
              type="email"
              fullWidth
              variant="outlined"
              defaultValue={currentUser?.email}
            />
            <TextField
              margin="dense"
              name="password"
              label="Jelszó"
              type="password"
              fullWidth
              variant="outlined"
              helperText="Csak akkor tölts ki, ha meg szeretnéd változtatni a felhasználó jelszavát. Vagy újat akarsz neki létrehozni."
            />

            <TextField
              margin="dense"
              name="isAdmin"
              label="Admin"
              select
              SelectProps={{ native: true }}
              fullWidth
              variant="outlined"
              defaultValue={currentUser?.isAdmin ? "true" : "false"}
            >
              <option value="false">Nem</option>
              <option value="true">Igen</option>
            </TextField>
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

export default AdminUsers;
