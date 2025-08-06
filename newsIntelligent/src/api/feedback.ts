import { axiosInstance } from "./axios";

export const postFeedback = async (  ) => {
    try {
        const {data} = await axiosInstance.post("/feedbacks", {
            content: "test",
        });
        console.log("feedback 전송", data)
        return data;
    } catch (error:any) {
        console.log("feedback error발생", error.response || error);
        throw error;
    }
}