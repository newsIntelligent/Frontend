import { Outlet } from "react-router-dom";
import LoginAlertModal from "../components/LoginAlertModal";

function getAccessTokenFromStorage() {
    try {
      const saved = localStorage.getItem("auth");
      return saved ? JSON.parse(saved).accessToken : null;
    } catch { return null; }
  }

  export default function ProtectedRoute() {
    const accessToken = getAccessTokenFromStorage();

    if (!accessToken) {
        return <LoginAlertModal/>;
    }

    return <Outlet />;
  }