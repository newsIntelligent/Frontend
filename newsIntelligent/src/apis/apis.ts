<<<<<<< HEAD
//import axios from 'axios';
import type { MemberInfoResponse, NicknameAvailabilityResponse } from '../types/members';
import { axiosInstance } from '../api/axios';

//const baseURL = import.meta.env.VITE_API_URL;
=======
import type { MemberInfoResponse, NicknameAvailabilityResponse } from '../types/members';
import { axiosInstance } from '../api/axios';

>>>>>>> a2557da299a1d6641bee547dba2ea3c44b15969f
const token = import.meta.env.VITE_API_TOKEN;

export const getMemberInfo = async () : Promise<MemberInfoResponse> => {
    const response = await axiosInstance.get(`/api/members/info`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const patchNickname = async (nickname : string) => {
    const response = await axiosInstance.patch(`/api/members/nickname`, {nickname}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const getNicknameAvailability = async (nickname : string) : Promise<NicknameAvailabilityResponse> => {
    const response = await axiosInstance.get(`/api/members/nickname-availability`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {nickname},
    });

    return response.data;
}

export const postEmailCode = async (newEmail : string) => {
    const response = await axiosInstance.patch(`/api/members/notification-email/change`, {newEmail}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const postEmailCodeCheck = async (newEmail : string, code : string) => {
    const response = await axiosInstance.patch(`/api/members/notification-email/verify`, {newEmail, code}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const signout = async () => {
    const response = await axiosInstance.post(`/api/members/logout`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const deleteId = async () => {
    const response = await axiosInstance.delete(`/api/members/withdraw`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}
<<<<<<< HEAD

export const sendDailyReport = async (memberId : string) : Promise<void> => {
    await axiosInstance.post(`/api/members/${memberId}/daily-report/send`);
}
=======
>>>>>>> a2557da299a1d6641bee547dba2ea3c44b15969f
