import { axiosInstance } from "./axios";

export const postFeedback = async (content:string) => {
    try {
        const {data} = await axiosInstance.post("/feedbacks", {
            content,
        });
        return data;
    } catch (error:any) {
        throw error;
    }
}