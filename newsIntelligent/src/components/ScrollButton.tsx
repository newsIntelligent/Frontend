import upSide from "../assets/upSide.svg";

function ScrollButton() {
    const MoveToTop = () =>{
        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    }

    return (
        <>  
            <div 
                className="fixed bottom-[155px] right-[141px] z-50 flex items-center justify-center cursor-pointer
                    w-[40px] h-[40px] rounded-[40px] border border-[#919191] bg-white padding-[10px]"
                onClick={MoveToTop}>
                <img src={upSide} alt="Scroll to Top" className="w-[18px] h-[12px]"/>
            </div>
        </>
    )
}
export default ScrollButton;