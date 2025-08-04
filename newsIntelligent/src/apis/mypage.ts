import axios from "axios";
import { axiosInstance } from "./axios"

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

export const getSubscriptions = async (cursor : number | null, size : number = 10) => {
    const response = await axios.get(`${baseURL}/api/mypage/subscriptions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {cursor, size},
    });

    return response.data;
}

export const getReadTopic = async (cursor: number | null, size: number = 10) => {
    const params: Record<string, any> = { size };
    if (cursor !== null && cursor !== 0) {
        params.cursor = cursor;
        }
    
        const response = await axiosInstance.get(`/api/mypage/read-topics`, { params });
        return response.data;
};

export const getKeywordTopic = async (keyword : string, cursor : number | null, size : number = 10) => {
    const response = await axios.get(`${baseURL}/api/mypage/read-topic`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getNotifications = async (cursor : number | null, size : number = 10) => {
    const response = await axios.get(`${baseURL}/api/notification`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {cursor, size},
    });

    return response.data;
}