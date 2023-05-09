import React, {useEffect, useState} from "react";
import {
    Box,
    Button, Chip,
    Paper,
    Stack, Tooltip,
    Typography
} from "@mui/material";
import {Loader} from "../components/Loader.tsx";
import {Player} from "../models/Player.ts";
import getBanned from "../api/getBanned.ts";
import unbanPlayer from "../api/unbanPlayer.ts";

interface Props {
    setSuccess: (message: string | null) => void;
    setError: (message: string | null) => void;
    setUnauthenticated: () => void;
}

export const BanList: React.FC<Props> = ({ setError, setSuccess, setUnauthenticated }) => {
    // Data
    const [players, setPlayers] = useState<Player[]>();
    const [count, setCount] = useState<number>(0);

    useEffect(() => {
        getBanned().then((players) => {
            setPlayers(players);
        }).catch((error) => {
            console.log(error);
            setUnauthenticated();
        });

        setTimeout(() => {
            setCount(count + 1);
        }, 5000);
    }, [count]);

    return (<>
        {
            !players ? <Loader/> : (<>
                <Stack direction={"column"} spacing={2}>
                    <Typography variant={"h4"}>Banlist</Typography>
                    {
                        players.map((player) => {
                            return (
                                <Paper sx={{p: 1}} key={player.uuid}>
                                    <Stack direction={"row"} justifyContent={"space-between"}
                                           alignItems={"center"}>
                                        <Stack direction={"row"} alignItems={"center"} spacing={1}>
                                            <Box component={"img"} width={30} height={30} src={`https://crafatar.com/avatars/${player.uuid}`}></Box>
                                            <Stack direction={"column"}>
                                                <Typography variant={"h6"}>{player.name}</Typography>
                                                <Typography variant={"body2"} display={{
                                                    xs: "none",
                                                    sm: "flex",
                                                }}>{player.uuid}</Typography>
                                            </Stack>
                                        </Stack>
                                        <Stack direction={"row"} spacing={1} alignItems={"center"}>
                                            <Tooltip title={"Banned due..."}>
                                                <Chip label={player.banDate?.toLocaleString()}/>
                                            </Tooltip>
                                            <Button color={"error"} onClick={() => {
                                                unbanPlayer(player).then(() => {
                                                    setSuccess("Player unbanned successfully!");
                                                }).catch((error) => {
                                                    setError("The player could not be unbanned. Maybe he's not banned anymore.")
                                                    console.log(error);
                                                });
                                            }}>Unban</Button>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            );
                        })
                    }
                </Stack>
            </>)
        }
    </>);
};