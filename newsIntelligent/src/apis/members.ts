import type { MemberSettingResponse } from "../types/members";
import { axiosInstance } from "../api/axios";

export const postSetDailyReport = async (time : string) : Promise<MemberSettingResponse> => {
    const response = await axiosInstance.post(`/members/setting/daily-report/time`, {time});

    return response.data;
}

export const patchSetSubscribeNotification = async (enabled : boolean) => {
    const response = await axiosInstance.patch(`/members/setting/subscribe-notification`, {enabled});

    return response.data;
}

export const patchSetReadTopicNotification = async (enabled : boolean) => {
    const response = await axiosInstance.patch(`/members/setting/read-topic-notification`, {enabled});

    return response.data;
}

export const patchSetDailyReport = async (enabled : boolean) => {
    const response = await axiosInstance.patch(`/members/setting/daily-report`, {enabled});

    return response.data;
}

export const getSetting = async () : Promise<MemberSettingResponse> => {
    const response = await axiosInstance.get(`/members/setting`);

    return response.data;
}

export const deleteSettingTime = async (timeId : number) => {
    const response = await axiosInstance.delete(`/members/setting/time/${timeId}`);

    return response.data;
}