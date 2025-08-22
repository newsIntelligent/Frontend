import { Outlet } from "react-router-dom";
import LoginAlertModal from "../components/LoginAlertModal";
import { isTokenExpired } from "../apis/auth";

function getAccessTokenFromStorage() {
  const token = localStorage.getItem("accessToken");
  if (token) return token;
}

  export default function ProtectedRoute() {
    const accessToken = getAccessTokenFromStorage();
    const expired = isTokenExpired();

    if (!accessToken || expired) {
        return <LoginAlertModal open={true} onClose={()=>false}/>;
    }

    return <Outlet />;
  }