import { Outlet } from "react-router-dom";
import Header from "../components/Header";
import FeedBack from "../components/FeedBack";
import ScrollButton from "../components/ScrollButton";

function HeaderLayout() {
    return (
        <>
            <Header />
            <div className="pt-[167px]">
                <Outlet />
                <ScrollButton />
                <FeedBack />
            </div>
        </>
    )
}

export default HeaderLayout;