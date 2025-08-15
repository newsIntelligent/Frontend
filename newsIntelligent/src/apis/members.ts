import type { MemberSettingResponse } from "../types/members";
import { axiosInstance } from "../api/axios";

export const postSetDailyReport = async (time : string) : Promise<MemberSettingResponse> => {
<<<<<<< Updated upstream
    const response = await axiosInstance.post(`/members/setting/daily-report/time`, {time});
=======
    const response = await axiosInstance.post(`/members/setting/daily-report/time`, {time}, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const patchSetSubscribeNotification = async (enabled : boolean) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.patch(`/members/setting/subscribe-notification`, {enabled});
=======
    const response = await axiosInstance.patch(`/members/setting/subscribe-notification`, {enabled}, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const patchSetReadTopicNotification = async (enabled : boolean) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.patch(`/members/setting/read-topic-notification`, {enabled});
=======
    const response = await axiosInstance.patch(`/members/setting/read-topic-notification`, {enabled}, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const patchSetDailyReport = async (enabled : boolean) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.patch(`/members/setting/daily-report`, {enabled});
=======
    const response = await axiosInstance.patch(`/members/setting/daily-report`, {enabled}, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const getSetting = async () : Promise<MemberSettingResponse> => {
<<<<<<< Updated upstream
    const response = await axiosInstance.get(`/members/setting`);
=======
    const response = await axiosInstance.get(`/members/setting`, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const deleteSettingTime = async (timeId : number) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.delete(`/members/setting/time/${timeId}`);
    
=======
    const response = await axiosInstance.delete(`/members/setting/time/${timeId}`, {
    });

>>>>>>> Stashed changes
    return response.data;
}