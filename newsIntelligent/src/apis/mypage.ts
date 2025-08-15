import { axiosInstance } from "../api/axios";

export const getTopics = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/topics/search`, {
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getSubscriptions = async (cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/mypage/subscriptions`, {
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        params : {cursor, size},
    });

    return response.data;
}

export const getReadTopic = async (cursor: number, size: number = 10) => {
    const response = await axiosInstance.get(`/mypage/read-topics`, { 
<<<<<<< Updated upstream
=======

>>>>>>> Stashed changes
        params : {cursor, size},
    });
        
    return response.data;
};

export const getKeywordTopic = async (keyword : string, cursor : number, size : number = 10) => {
    const response = await axiosInstance.get(`/mypage/read-topic`, {
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
        params : {keyword, cursor, size},
    });

    return response.data;
}

export const getTopicRelated = async (topicId : number, lastId : number, size : number = 3) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.get(`/topic/${topicId}/related`, {
=======
    const response = await axiosInstance.get(`/topic/{topicId}/related`, {

>>>>>>> Stashed changes
        params : {topicId, lastId, size},
    })

    return response.data;
}
