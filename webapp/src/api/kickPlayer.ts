import axios from "axios";
import {Player} from "../models/Player.ts";
import baseUrl from "./baseUrl.ts";

export default async (player: Player): Promise<Player[]> => {
    const { data } = await axios.post(`${baseUrl}/players/kick`, player, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
        }
    });
    return data.map(Player.fromJson);
};
