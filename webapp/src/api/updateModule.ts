import axios from "axios";
import { Module } from "../models/Module";
import baseUrl from "./baseUrl.ts";

export default async (module: Module): Promise<Module[]> => {
    const { data } = await axios.patch(`${baseUrl}/modules`, module, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem('token')}`,
            "Content-Type": "application/json",
        }
    });
    return data.map(Module.fromJson);
};
