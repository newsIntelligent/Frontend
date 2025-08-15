import type { MemberInfoResponse, NicknameAvailabilityResponse } from '../types/members';
import { axiosInstance } from '../api/axios';

export const getMemberInfo = async () : Promise<MemberInfoResponse> => {
<<<<<<< Updated upstream
    const response = await axiosInstance.get(`/members/info`);
=======
    const response = await axiosInstance.get(`/members/info`, {

    });
>>>>>>> Stashed changes

    return response.data;
}

export const patchNickname = async (nickname : string) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.patch(`/members/nickname`, {nickname});
=======
    const response = await axiosInstance.patch(`/members/nickname`, {nickname}, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const getNicknameAvailability = async (nickname : string) : Promise<NicknameAvailabilityResponse> => {
    const response = await axiosInstance.get(`/members/nickname-availability`, {
<<<<<<< Updated upstream
=======


>>>>>>> Stashed changes
        params : {nickname},
    });

    return response.data;
}

export const postEmailCode = async (newEmail : string) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.patch(`/members/notification-email/change`, {newEmail});
=======
    const response = await axiosInstance.patch( `/members/notification-email/change`, {newEmail}, {

    });
>>>>>>> Stashed changes

    return response.data;
}

export const postEmailCodeCheck = async (newEmail : string, code : string) => {
<<<<<<< Updated upstream
    const response = await axiosInstance.patch(`/members/notification-email/verify`, {newEmail, code});
=======
    const response = await axiosInstance.patch(`/members/notification-email/verify`, {newEmail, code}, {

    });
>>>>>>> Stashed changes

    return response.data;
}

export const signout = async () => {
<<<<<<< Updated upstream
    const response = await axiosInstance.post(`/members/logout`, null);
=======
    const response = await axiosInstance.post(`/members/logout`, null, {
    });
>>>>>>> Stashed changes

    return response.data;
}

export const deleteId = async () => {
<<<<<<< Updated upstream
    const response = await axiosInstance.delete(`/members/withdraw`);
=======
    const response = await axiosInstance.delete(`/members/withdraw`, {

    });
>>>>>>> Stashed changes

    return response.data;
}
