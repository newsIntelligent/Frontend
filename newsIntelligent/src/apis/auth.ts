import { axiosInstance } from "../api/axios";

// 로그인 인증 코드 전송
export const sendLoginCode = async (email: string): Promise<void> =>{
    await axiosInstance.post("/login/email", {email});
};

// 로그인 인증 코드 검증
export const verifyLoginCode = async (
    email: string,
    code: string
): Promise<boolean> => {
    const response = await axiosInstance.post("/login/verify", {
        email,
        code,
    });
    
    return response.data.isSuccess;
};