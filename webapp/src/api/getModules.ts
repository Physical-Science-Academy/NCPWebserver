import axios from "axios";
import { Module } from "../models/Module";

export default async (): Promise<Module[]> => {
    const { data } = await axios.get("/modules");
    return data.map(Module.fromJson);
};
