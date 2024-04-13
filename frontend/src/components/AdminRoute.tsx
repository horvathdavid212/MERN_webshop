import { useContext } from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Store } from "../Store";

export default function AdminRoute() {
  const {
    state: { userInfo },
  } = useContext(Store);

  if (userInfo && userInfo.isAdmin) {
    return <Outlet />;
  } else {
    return <Navigate to="/" />;
  }
}
