import { axiosInstance } from "./axios"

export const getSubscriptions = async (cursor : number | null, size : number = 10) => {
    const response = await axiosInstance.get(`/api/mypage/subscriptions`, {
        params : {cursor, size},
    });

    return response.data;
}

export const getReadTopic = async (cursor : number | null, size : number = 10) => {
    const response = await axiosInstance.get(`/api/mypage/read-topics`, {
        params : {cursor, size},
    });

    return response.data;
}

export const getKeywordTopic = async (keyword : string, cursor : number | null, size : number = 10) => {
    const response = await axiosInstance.get(`/api/mypage/read-topic`, {
        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getNotifications = async (cursor : number | null, size : number = 10) => {
    const response = await axiosInstance.get(`//api/notification`, {
        params : {cursor, size},
    });

    return response.data;
}