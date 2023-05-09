import axios from "axios";
import {Player} from "../models/Player.ts";
import baseUrl from "./baseUrl.ts";

export default async (player: Player): Promise<Player[]> => {
    const { data } = await axios.post(`${baseUrl}/banned`, player, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
        }
    });
    return data.map(Player.fromJson);
};
