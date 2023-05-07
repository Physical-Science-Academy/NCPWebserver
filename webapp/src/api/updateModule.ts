import axios from "axios";
import { Module } from "../models/Module";

export default async (module: Module): Promise<Module[]> => {
    const { data } = await axios.patch("http://cc1.cimeyclust.com:6040/modules", module);
    return data.map(Module.fromJson);
};
