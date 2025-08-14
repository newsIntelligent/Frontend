import { axiosInstance } from "./axios";

export const getNotification = async ({ cursor, size = 10 }: { cursor?: string, size?: number }) => {
    try {
      // params 객체를 동적으로 생성
      const params: Record<string, any> = { size };
      if (cursor !== undefined) {
        params.cursor = cursor;
      }
  
      const { data } = await axiosInstance.get("/notification", { params });
      return data;
    } catch (error) {
      console.log("알람 목록 조회 실패", error);
      throw error;
    }
  };
export const checkNotification = async (notificationID:number) => {
    try{
        const {data} = await axiosInstance.patch(`/notification/${notificationID}/check`)
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