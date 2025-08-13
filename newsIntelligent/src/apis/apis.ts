import axios from 'axios';
import type { MemberInfoResponse, MemberInfo, NicknameAvailabilityResponse } from '../types/members';

const baseURL = import.meta.env.VITE_API_URL;
const token = import.meta.env.VITE_API_TOKEN;

export const getMemberInfo = async () : Promise<MemberInfoResponse> => {
    const response = await axios.get(`${baseURL}/api/members/info`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const patchNickname = async (nickname : string) => {
    const response = await axios.patch(`${baseURL}/api/members/nickname`, {nickname}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const getNicknameAvailability = async (nickname : string) : Promise<NicknameAvailabilityResponse> => {
    const response = await axios.get(`${baseURL}/api/members/nickname-availability`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },

        params : {nickname},
    });

    return response.data;
}

export const postEmailCode = async (newEmail : string) => {
    const response = await axios.patch(`${baseURL}/api/members/notification-email/change`, {newEmail}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const postEmailCodeCheck = async (newEmail : string, code : string) => {
    const response = await axios.patch(`${baseURL}/api/members/notification-email/verify`, {newEmail, code}, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const signout = async () => {
    const response = await axios.post(`${baseURL}/api/members/logout`, null, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const deleteId = async () => {
    const response = await axios.delete(`${baseURL}/api/members/withdraw`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    return response.data;
}

export const sendDailyReport = async (memberId : string) : Promise<void> => {
    await axios.post(`/api/members/${memberId}/daily-report/send`);
}