import axios from "axios";
import {Player} from "../models/Player.ts";

export default async (player: Player): Promise<Player[]> => {
    const { data } = await axios.post("http://cc1.cimeyclust.com:6040/players/kick", player);
    return data.map(Player.fromJson);
};
