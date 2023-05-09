import baseUrl from "./baseUrl.ts";
import axios from "axios";

export default async (username: string, password: string): Promise<void> => {
    const passing = {
        'username': username,
        'password': password
    };
    const { data } = await axios.post(`${baseUrl}/login`, passing, {
        headers: {
            'content-length': passing.toString().length
        }
    });
    localStorage.setItem('token', data.token);
};