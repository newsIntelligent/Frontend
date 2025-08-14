<<<<<<< HEAD
//import axios from "axios";
import { axiosInstance } from "../api/axios";

//const baseURL = import.meta.env.VITE_API_URL;
=======
import { axiosInstance } from "../api/axios";

>>>>>>> a2557da299a1d6641bee547dba2ea3c44b15969f
const token = import.meta.env.VITE_API_TOKEN;

export const getTopics = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/api/topics/search`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getSubscriptions = async (cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/api/mypage/subscriptions`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {cursor, size},
    });

    return response.data;
}

export const getReadTopic = async (cursor: number, size: number = 10) => {
    const response = await axiosInstance.get(`/api/mypage/read-topics`, { 
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {cursor, size},
    });
        
    return response.data;
};

export const getKeywordTopic = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/api/mypage/read-topic`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getTopicRelated = async (topicId : number, lastId : number, size : number = 3) => {
    const response = await axiosInstance.get(`/api/topic/{topicId}/related`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {topicId, lastId, size},
    })

    return response.data;
}