import Alert, { AlertColor } from "@mui/material/Alert";
import React from "react";

interface MessageBoxProps {
  variant?: AlertColor;
  children: React.ReactNode;
}

const MessageBox = ({ variant = "info", children }: MessageBoxProps) => (
  <Alert severity={variant}>{children}</Alert>
);

export default MessageBox;
