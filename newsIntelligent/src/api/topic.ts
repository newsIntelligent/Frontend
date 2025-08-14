import { axiosInstance } from "./axios"

export const topicSubscribe = async (topicId: number) => {
    try {
        const {data} = await axiosInstance.post(`/topics/${topicId}/subscribe`);
        console.log("토픽 구독 성공", data);
        return data;
    } catch (error) {
        console.error("토픽 구독 실패", error);
        throw error;
    }
}

export const topicUnsubscribe = async (topicId: number) => {
    try {
        const {data} = await axiosInstance.delete(`/topics/${topicId}/unsubscribe`);
        console.log("토픽 구독 취소 성공", data);
        return data;
    } catch (error) {
        console.error("토픽 구독 취소 실패", error);
        throw error;
    }
}

export const topicRead = async (topicId: number) => {
    try {
        const {data} = await axiosInstance.patch(`/topics/${topicId}/read`);
        console.log("토픽 읽음 처리 성공", data);
        return data;
    } catch (error) {
        console.error("토픽 읽음 처리 실패", error);
        throw error;
    }
}

export const topicHome = async (cursor: number, size = 10) => {
    try {
        const {data} = await axiosInstance.get('/topics/home', {
            params: {
                cursor,
                size
            }
        })
        console.log("홈 토픽 조회 성공", data);
        return data;
    } catch (error) {
        console.error("홈 토픽 조회 실패", error);
        throw error;
    }
}