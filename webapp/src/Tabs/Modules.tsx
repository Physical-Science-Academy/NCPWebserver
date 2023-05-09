import React, {useEffect, useState} from "react";
import {Checkbox, Paper, Stack, Typography} from "@mui/material";
import updateModule from "../api/updateModule.ts";
import {Loader} from "../components/Loader.tsx";
import getModules from "../api/getModules.ts";
import {Module} from "../models/Module.ts";

interface Props {
    setSuccess: (message: string | null) => void;
    setError: (message: string | null) => void;
    setUnauthenticated: () => void;
}

export const Modules: React.FC<Props> = ({ setSuccess, setUnauthenticated }) => {
    // Data
    const [modules, setModules] = useState<Module[]>();

    useEffect(() => {
        getModules().then((modules) => {
            setModules(modules);
        }).catch((error) => {
            console.log(error);
            setUnauthenticated();
        });
    }, []);

    return (<>
        {
            !modules ? <Loader/> : (
                <Stack direction={"column"} spacing={2}>
                    <Typography variant={"h4"}>Modules</Typography>
                    {
                        modules.map((module) => {
                            return (
                                <Paper sx={{p: 1}} key={module.baseName}>
                                    <Stack direction={"row"} justifyContent={"space-between"}
                                           alignItems={"center"}>
                                        <Stack direction={"column"}>
                                            <Typography variant={"h6"}>{module.baseName}</Typography>
                                            <Typography variant={"body2"}>{module.typeName}</Typography>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1}>
                                            <Stack sx={{
                                                display: {
                                                    xs: "none",
                                                    sm: "flex",
                                                }
                                            }} direction={"column"}>
                                                <Typography variant={"h6"}>{module.version}</Typography>
                                                <Typography variant={"body2"}>From {module.author}</Typography>
                                            </Stack>
                                            <Checkbox checked={module.isEnabled} onChange={() => {
                                                module.isEnabled = !module.isEnabled;
                                                updateModule(module).then((modules) => {
                                                    setModules(modules);
                                                    setSuccess("Module updated successfully!");
                                                }).catch((error) => {
                                                    console.log(error);
                                                });
                                            }}></Checkbox>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            );
                        })
                    }
                </Stack>
            )
        }
    </>);
};