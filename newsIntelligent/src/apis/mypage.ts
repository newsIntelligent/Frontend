import { axiosInstance } from "../api/axios";

export const getTopics = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/topics/search`, {
        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getSubscriptions = async (cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/mypage/subscriptions`, {
        params : {cursor, size},
    });

    return response.data;
}

export const getReadTopic = async (cursor: number, size: number = 10) => {
    const response = await axiosInstance.get(`/mypage/read-topics`, { 
        params : {cursor, size},
    });
        
    return response.data;
};

export const getKeywordTopic = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/mypage/read-topic`, {
        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getTopicRelated = async (topicId : number, lastId : number, size : number = 3) => {
    const response = await axiosInstance.get(`/topic/${topicId}/related`, {
        params : {topicId, lastId, size},
    })

    return response.data;
}
