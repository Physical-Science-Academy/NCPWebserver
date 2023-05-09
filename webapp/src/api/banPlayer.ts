import axios from "axios";
import {Player} from "../models/Player.ts";
import baseUrl from "./baseUrl.ts";

export default async (player: Player, days: number, hours?: number, minutes?: number): Promise<Player[]> => {
    const passing = {
        ...player,
        days: days,
        hours: hours,
        minutes: minutes
    }
    const { data } = await axios.post(`${baseUrl}/players/ban`, passing, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
        }
    });
    return data.map(Player.fromJson);
};
