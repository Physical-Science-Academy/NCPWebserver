import axios from "axios";
import {Player} from "../models/Player.ts";

export default async (player: Player): Promise<Player[]> => {
    const { data } = await axios.post("/players/kick", player);
    return data.map(Player.fromJson);
};
