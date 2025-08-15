import { Outlet } from "react-router-dom";
import LoginAlertModal from "../components/LoginAlertModal";

function getAccessTokenFromStorage() {
  const token = localStorage.getItem("accessToken");
  if (token) return token;
}

  export default function ProtectedRoute() {
    const accessToken = getAccessTokenFromStorage();

    if (!accessToken) {
        return <LoginAlertModal/>;
    }

    return <Outlet />;
  }