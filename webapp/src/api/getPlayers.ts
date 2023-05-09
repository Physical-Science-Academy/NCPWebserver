import axios from "axios";
import {Player} from "../models/Player.ts";
import baseUrl from "./baseUrl.ts";

export default async (): Promise<Player[]> => {
    const { data } = await axios.get(`${baseUrl}/players`, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
        }
    });
    return data.map(Player.fromJson);
};
