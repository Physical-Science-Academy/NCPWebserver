import axios from "axios";
import {Player} from "../models/Player.ts";

export default async (): Promise<Player[]> => {
    const { data } = await axios.get("/players");
    return data.map(Player.fromJson);
};
