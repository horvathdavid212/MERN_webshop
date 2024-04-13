import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Store } from "../Store";

export default function ProtectedRoute() {
  const {
    state: { userInfo },
  } = useContext(Store);

  if (userInfo) {
    return <Outlet />;
  } else {
    return <Navigate to="/signin" />;
  }
}
