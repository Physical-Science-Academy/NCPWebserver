import axios from "axios";
import { Module } from "../models/Module";

export default async (): Promise<Module[]> => {
    const { data } = await axios.get("http://cc1.cimeyclust.com:6040/modules");
    return data.map(Module.fromJson);
};
