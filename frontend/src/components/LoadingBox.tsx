import { Box } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";

const LoadingBox = () => {
  return (
    <Box
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <CircularProgress />
    </Box>
  );
};

export default LoadingBox;
