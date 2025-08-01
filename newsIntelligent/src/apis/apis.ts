import axios from 'axios';
import type { MemberInfoResponse, MemberInfo } from '../types/members';
import type { NewsItemsResponse } from '../types/subscriptions';
import { axiosInstance } from './axios';
import { dummyData } from '../mocks/dummyData';

export const getMemberInfo = async (memberId : string) : Promise<MemberInfoResponse> => {
    const response = await axiosInstance.get(`/api/members/info/${memberId}`);

    return response.data;
}

export const updateMemberMail = async (memberId : string) : Promise<MemberInfo> => {
    const response = await axios.patch(`/api/members/info/${memberId}`);

    return response.data;
}

export const signout = async () => {
    const response = await axiosInstance.post(`/api/members/logout`);

    return response.data;
}

export const deleteId = async () => {
    const response = await axiosInstance.delete(`/api/members/withdraw`);

    return response.data;
}

/*
export const getSubscriptionNews = async (cursor : number | null, size : number = 10) : Promise<NewsItemsResponse> => {
    const response = await axios.get<NewsItemsResponse>(`/api/mypage/subscriptions`, {
        params : {cursor, size},
    })

    return response.data;
}
*/

export const getReadNews = async (
    cursor: number | null,
    size: number = 2
): Promise<NewsItemsResponse> => {
    const start = cursor ?? 0;
    const slice = dummyData.slice(start, start + size);

    return new Promise(resolve => {
        setTimeout(() => {
            resolve({
            isSuccess: true,
            code: "200",
            status: "OK",
            message: "더미 뉴스 성공",
            result: slice,
            nextCursor: start + slice.length,
            hasNext: start + slice.length < dummyData.length
            });
        }, 500);
    });
};

export const sendDailyReport = async (memberId : string) : Promise<void> => {
    await axios.post(`/api/members/${memberId}/daily-report/send`);
}