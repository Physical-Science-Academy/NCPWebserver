import axios from "axios";
import {Player} from "../models/Player.ts";

export default async (player: Player, days: number, hours?: number, minutes?: number): Promise<Player[]> => {
    const { data } = await axios.post("/players/ban", {
        ...player,
        days: days,
        hours: hours,
        minutes: minutes
    });
    return data.map(Player.fromJson);
};
