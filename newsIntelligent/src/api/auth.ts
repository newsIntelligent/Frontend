import { axiosInstance } from "./axios";

export const getMainArticle = async ( params? : { lastId?:number, size?:number}) => {
    const {data} = await axiosInstance.get('/home',{
        params: {
            size: params?.size ?? 5,
            ...(params?.lastId && { lastId: params.lastId}),
        },
    })
    return data;
}

export const postFeedback = async ( content: string ) => {
    try {
        const {data} = await axiosInstance.post("/feedbacks", {
            content,
        });
        console.log("feedback 전송", data)
        return data;
    } catch (error:any) {
        console.log("feedback error발생", error.response || error);
        throw error;
    }
}

export const getNotification = async ({cursor, size=10}: {cursor?:string, size?: number}) => {
    try{
        const { data } = await axiosInstance.get("/notification", {
            params:{
                cursor,
                size
            }
        })
        return data;
    } catch (error) {
        console.log("알람 목록 조회 실패", error)
        throw error;
    }
}
export const checkNotification = async (notificationID:number) => {
    try{
        const {data} = await axiosInstance.patch(`/${notificationID}/check`)
        return data;
    } catch (error) {
        console.log("알람 읽음 처리 오류", error)
        throw error;
    }
}

export const checkAllNotification = async () => {
    try{
        const {data} = await axiosInstance.patch("/notification/check")
        return data;
    } catch (error) {
        console.log("모든 알람 읽음 처리 오류", error)
        throw error;
    }
}