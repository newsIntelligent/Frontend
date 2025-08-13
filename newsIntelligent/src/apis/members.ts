import axios from "axios";
import type { MemberSettingResponse } from "../types/members";

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

export const postSetDailyReport = async (time : string) : Promise<MemberSettingResponse> => {
    const response = await axios.post(`${baseURL}/api/members/setting/daily-report/time`, {time}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const patchSetSubscribeNotification = async (enabled : boolean) => {
    const response = await axios.patch(`${baseURL}/api/members/setting/subscribe-notification`, {enabled}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const patchSetReadTopicNotification = async (enabled : boolean) => {
    const response = await axios.patch(`${baseURL}/api/members/setting/read-topic-notification`, {enabled}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const patchSetDailyReport = async (enabled : boolean) => {
    const response = await axios.patch(`${baseURL}/api/members/setting/daily-report`, {enabled}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const getSetting = async () : Promise<MemberSettingResponse> => {
    const response = await axios.get(`${baseURL}/api/members/setting`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const deleteSettingTime = async (timeId : number) => {
    const response = await axios.delete(`${baseURL}/api/members/setting/time/${timeId}`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}