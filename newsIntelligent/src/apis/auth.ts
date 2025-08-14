import axios from "axios";
import { axiosInstance } from "../api/axios";

// 인증 코드 전송
export const sendLoginCode = async (email: string, isLogin: boolean): Promise<void> =>{
    const endpoint = isLogin ? "/api/members/login/email" : "/api/members/signup/email";
    const response = await axiosInstance.post(endpoint, {email});
    return response.data;
};

// 로그인 인증 코드 검증
export const verifyLoginCode = async (email: string, code: string): Promise<boolean> => {
    const response = await axiosInstance.post("/api/members/login/verify", {
        email,
        code,
    });
    
    return response.data.Success;
};

// 회원가입 인증 코드 검증
export const verifySignupCode = async (email : string, code : string) => {
    const response = await axiosInstance.post("/api/members/signup/verify", {
        email,
        code,
    });
    return response.data.success;
}

// 코드 재요청
export const resendMagicLink = async (email: string, isLogin: boolean) => {
    const endpoint = isLogin ? "/api/members/login/magic" : "api/members/signup/magic";
    const response = await axiosInstance.post(endpoint, {email});
    return response.data;
};

// 이메일 변경 코드 전송
export const sendEmailChangeCode = (email: string) => {
    axios.post("/api/members/notification-email/change", {email});
}

// 이메일 변경 코드 검증
export const verifyEmailChangeCode = (email: string, code: string) => {
    axios.post("/api/members/notification-email/verify", {email, code})
    .then(res => res.data?.isSuccess === true);
}

//이메일 변경 코드 재전송
export const resendEmailChangeCode = (email: string) =>
    axios.post("/api/members/norification-email/magic", {email});