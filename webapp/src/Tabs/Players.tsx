import React, {useEffect, useState} from "react";
import {
    Box,
    Button,
    Dialog,
    DialogActions, DialogContent,
    DialogTitle,
    IconButton, Input,
    Paper,
    Stack,
    Tooltip,
    Typography
} from "@mui/material";
import {Loader} from "../components/Loader.tsx";
import {Player} from "../models/Player.ts";
import getPlayers from "../api/getPlayers.ts";
import {HighlightOffRounded} from "@mui/icons-material";
import banPlayer from "../api/banPlayer.ts";
import kickPlayer from "../api/kickPlayer.ts";

interface Props {
    setSuccess: (message: string | null) => void;
    setError: (message: string | null) => void;
}

export const Players: React.FC<Props> = ({ setError, setSuccess }) => {
    // Data
    const [players, setPlayers] = useState<Player[]>();
    const [count, setCount] = useState<number>(0);
    const [banningPlayer, setBanPlayer] = useState<Player>();

    const [days, setDays] = useState<number>(1);
    const [hours, setHours] = useState<number>(0);
    const [minutes, setMinutes] = useState<number>(0);

    useEffect(() => {
        getPlayers().then((players) => {
            setPlayers(players);
        }).catch((error) => {
            console.log(error);
        });

        setTimeout(() => {
            setCount(count + 1);
        }, 5000);
    }, [count]);

    return (<>
        {
            !players ? <Loader/> : (<>
                <Stack direction={"column"} spacing={2}>
                    <Typography variant={"h4"}>Players</Typography>
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
                                        <Stack direction={"row"} spacing={1}>
                                            <Button color={"error"} onClick={() => setBanPlayer(player)}>Ban</Button>
                                            <Tooltip title={"Kick"}>
                                                <IconButton color={"error"} onClick={() => {
                                                    kickPlayer(player).then((players) => {
                                                        setPlayers(players);
                                                        setSuccess(`Player ${player.name} was banned kicked.`);
                                                    }).catch((error) => {
                                                        setError("Failed to kick player. Maybe he's not online anymore.");
                                                        console.log(error);
                                                    });
                                                }}><HighlightOffRounded/></IconButton>
                                            </Tooltip>
                                        </Stack>
                                    </Stack>
                                </Paper>
                            );
                        })
                    }
                </Stack>
                {/* Dialog to ban a player with Days, Hours and Minutes*/}
                <Dialog open={!!banningPlayer} onClose={() => setBanPlayer(undefined)}>
                    <DialogTitle>
                        Ban {banningPlayer?.name}
                    </DialogTitle>
                    <DialogContent>
                        <Stack direction={"row"} spacing={1}>
                            <Stack direction={"column"}>
                                <Typography variant={"body2"}>Days</Typography>
                                <Input type={"number"} inputProps={{
                                    min: 0,
                                }} value={days} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                    setDays(Number(e.target.value))}/>
                            </Stack>
                            <Stack direction={"column"}>
                                <Typography variant={"body2"}>Hours</Typography>
                                <Input type={"number"} inputProps={{
                                    min: 0,
                                }} value={hours} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                    setHours(Number(e.target.value))}/>
                            </Stack>
                            <Stack direction={"column"}>
                                <Typography variant={"body2"}>Minutes</Typography>
                                <Input type={"number"} inputProps={{
                                    min: 0,
                                }} value={minutes} onChange={(e: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) =>
                                    setMinutes(Number(e.target.value))}/>
                            </Stack>
                        </Stack>
                    </DialogContent>
                    <DialogActions>
                        <Button variant={"contained"} onClick={() => {
                            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                            banPlayer(banningPlayer!, days, hours, minutes).then((players) => {
                                setPlayers(players);
                                setSuccess(`Player ${banningPlayer?.name} was banned successfully.`);
                                setBanPlayer(undefined);
                            }).catch((error) => {
                                setError("Failed to ban player. Maybe he's not online anymore.");
                                console.log(error);
                            });
                            setBanPlayer(undefined);
                        }}>Ban</Button>
                        <Button variant={"outlined"}>Cancel</Button>
                    </DialogActions>
                </Dialog>
            </>)
        }
    </>);
};