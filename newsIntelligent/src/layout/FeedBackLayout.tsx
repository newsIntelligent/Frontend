import { Outlet } from "react-router-dom";
import FeedBack from "../components/FeedBack";

function HeaderLayout() {
    return (
        <>
            <Outlet />
            <FeedBack />
        </>
    )
}

export default HeaderLayout;