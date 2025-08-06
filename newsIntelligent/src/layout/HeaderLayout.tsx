import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import FeedBack from "../components/FeedBack";

function HeaderLayout() {
    return (
        <>
            <Header />
            <div className="pt-[167px]">
                <Outlet />
                <FeedBack />
            </div>
        </>
    )
}

export default HeaderLayout;