import axios from "axios";

export const newsApi = axios.create({
    baseURL: "http://13.209.21.196:8080/api/members",
    headers: {
        "Content-Type": "application/json",
    },
});