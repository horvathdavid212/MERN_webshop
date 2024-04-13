import { useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import { useNavigate } from "react-router-dom";
import { IconButton, InputBase, Paper } from "@mui/material";

export default function SearchBox() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const submitHandler = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    navigate(searchTerm ? `/search/?searchKeyword=${searchTerm}` : "/search");
  };

  return (
    <Paper
      component="form"
      onSubmit={submitHandler}
      sx={{
        display: "flex",
        alignItems: "center",
        width: "auto",
        padding: "2px 4px",
        margin: "auto",
        maxWidth: 800,
        minWidth: 300,
        borderRadius: "20px",
        boxShadow: "0px 3px 15px rgba(0,0,0,0.2)",
      }}
      elevation={1}
    >
      <InputBase
        sx={{ ml: 2, flex: 1 }}
        placeholder="Termékek keresése..."
        inputProps={{ "aria-label": "search products" }}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <IconButton type="submit" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
