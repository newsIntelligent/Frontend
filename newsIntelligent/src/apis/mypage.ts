import axios from "axios";

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

export const getTopics = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axios.get(`${baseURL}/api/topics/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getSubscriptions = async (cursor : number, size : number = 10) => {
    const response = await axios.get(`${baseURL}/api/mypage/subscriptions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {cursor, size},
    });

    return response.data;
}

export const getReadTopic = async (cursor: number, size: number = 10) => {
    const response = await axios.get(`${baseURL}/api/mypage/read-topics`, { 
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {cursor, size},
    });
        
    return response.data;
};

export const getKeywordTopic = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axios.get(`${baseURL}/api/mypage/read-topic`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {keyword, cursor, size},
    });

    return response.data;
}