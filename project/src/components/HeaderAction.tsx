import { useState } from "react";
import Notification from "./Notification";
import BellIcon from "../icon/BellIcon";
import ProfileIcon from "../icon/ProfileIcon";

function HeaderAction() {
    const [openNotification, setOpenNotification] = useState(false); //알림창 열기
    const [newNotification, setNewNotification] = useState(false); //알림 상태 구분
    
    return(
        <div className="flex items-center justify-between w-[92px] h-[40px]">
                  <div className="relative">
                    <BellIcon 
                        className={`w-[32px] cursor-pointer ${newNotification? 'color-[#0B8E8E]':''}`} 
                        onClick={()=>{setOpenNotification(!openNotification)}}/>
                      {openNotification && <Notification /> }
                  </div>
                  <ProfileIcon className="w-[32px] cursor-pointer"/>
              </div>
    )
}

export default HeaderAction;