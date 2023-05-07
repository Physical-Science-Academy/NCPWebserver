import axios from "axios";
import {Player} from "../models/Player.ts";

export default async (): Promise<Player[]> => {
    const { data } = await axios.get("http://cc1.cimeyclust.com:6040/players");
    return data.map(Player.fromJson);
};
