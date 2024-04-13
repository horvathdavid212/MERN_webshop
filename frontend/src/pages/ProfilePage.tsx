import { useContext, useState } from "react";
import { Helmet } from "react-helmet-async";
import { toast } from "react-toastify";
import { Store } from "../Store";
import LoadingBox from "../components/LoadingBox";
import { useUpdateProfileMutation } from "../hooks/userHooks";
import { ApiError } from "../interfaces/ApiError";
import { getError } from "../utils";
import {
  Box,
  Typography,
  TextField,
  CircularProgress,
  Button,
} from "@mui/material";

export default function ProfilePage() {
  const { state, dispatch } = useContext(Store);
  const { userInfo } = state;
  const [name, setName] = useState(userInfo!.name);
  const [email, setEmail] = useState(userInfo!.email);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutateAsync: updateProfile, isPending } = useUpdateProfileMutation();

  const submitHandler = async (e: React.SyntheticEvent) => {
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error("Jelszavak nem egyeznek!");
        return;
      }
      const data = await updateProfile({
        name,
        email,
        password,
      });

      dispatch({ type: "USER_SIGNIN", payload: data });
      localStorage.setItem("userInfo", JSON.stringify(data));
      toast.success("Felhasználói fiók sikeresen frissítve!");
    } catch (err) {
      toast.error(getError(err as ApiError));
    }
  };

  return (
    <Box sx={{ maxWidth: 500, mx: "auto" }}>
      <Helmet>
        <title>Felhasználói fiók</title>
      </Helmet>
      <Typography variant="h4" sx={{ my: 3 }}>
        Felhasználói fiók
      </Typography>
      <Box component="form" onSubmit={submitHandler} noValidate sx={{ mt: 1 }}>
        <TextField
          margin="normal"
          required
          fullWidth
          id="name"
          label="Név"
          name="name"
          autoComplete="name"
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <TextField
          margin="normal"
          required
          fullWidth
          id="email"
          label="Email"
          name="email"
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          name="password"
          label="Jelszó"
          type="password"
          id="password"
          autoComplete="current-password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <TextField
          margin="normal"
          fullWidth
          name="confirmPassword"
          label="Jelszó megerősítése"
          type="password"
          id="confirm-password"
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        <Box sx={{ position: "relative", mt: 3, mb: 2 }}>
          <Button
            type="submit"
            variant="contained"
            disabled={isPending}
            sx={{
              bgcolor: "blue",
              "&:hover": {
                bgcolor: "darkblue",
              },
              color: "white",
            }}
          >
            Mentés
          </Button>

          {isPending && (
            <CircularProgress
              size={24}
              sx={{
                position: "absolute",
                top: "50%",
                left: "50%",
                marginTop: "-12px",
                marginLeft: "-12px",
              }}
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
