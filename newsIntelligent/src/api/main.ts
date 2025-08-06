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

