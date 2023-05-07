import axios from "axios";
import {Player} from "../models/Player.ts";

export default async (player: Player, days: number, hours?: number, minutes?: number): Promise<Player[]> => {
    const { data } = await axios.post("http://cc1.cimeyclust.com:6040/players/ban", {
        ...player,
        days: days,
        hours: hours,
        minutes: minutes
    });
    return data.map(Player.fromJson);
};
