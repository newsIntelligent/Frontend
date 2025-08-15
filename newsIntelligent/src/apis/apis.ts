import type { MemberInfoResponse, NicknameAvailabilityResponse } from '../types/members';
import { axiosInstance } from '../api/axios';

export const getMemberInfo = async () : Promise<MemberInfoResponse> => {
    const response = await axiosInstance.get(`/members/info`);

    return response.data;
}

export const patchNickname = async (nickname : string) => {
    const response = await axiosInstance.patch(`/members/nickname`, {nickname});

    return response.data;
}

export const getNicknameAvailability = async (nickname : string) : Promise<NicknameAvailabilityResponse> => {
    const response = await axiosInstance.get(`/members/nickname-availability`, {
        params : {nickname},
    });

    return response.data;
}

export const postEmailCode = async (newEmail: string) => {
    if (!newEmail || !newEmail.includes('@')) {
        throw new Error('Invalid email format');
    }
    
    try {
        const response = await axiosInstance.patch('/members/notification-email/change', { newEmail });
        return response.data;
    } catch (error) {
        console.error('Failed to send email code:', error);
        throw error;
    }
}

export const postEmailCodeCheck = async (newEmail : string, code : string) => {
    const response = await axiosInstance.patch(`/members/notification-email/verify`, {newEmail, code});

    return response.data;
}

export const signout = async () => {
    const response = await axiosInstance.post(`/members/logout`, null);

    return response.data;
}

export const deleteId = async () => {
    const response = await axiosInstance.delete(`/members/withdraw`);

    return response.data;
}
