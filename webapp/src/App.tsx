import React, {useEffect, useState} from "react";
import DynamicTheme from "./DynamicTheme.tsx";
import {
    Alert,
    Box, Button, Checkbox, CircularProgress,
    Container,
    CssBaseline, FormControl,
    IconButton,
    InputLabel,
    MenuItem, Paper, Select,
    SelectChangeEvent, Snackbar,
    Stack, styled, SwipeableDrawer, Typography
} from "@mui/material";
import icon from "./assets/ncp.png";
import {DarkMode, LightMode, Menu} from "@mui/icons-material";
import getModules from "./api/getModules.ts";
import {Module} from "./models/Module.ts";
import updateModule from "./api/updateModule.ts";

const StyledButton = styled(Button)({
    maxHeight: "50px",
    textTransform: 'none'
});

const StyledStack = styled(Stack)({
    justifyContent: "center"
});

const Loader = (
    <div
        style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center"
        }}
    >
        <CircularProgress/>
    </div>
)


export const App: React.FC = () => {
    // Theme
    const [theme, setTheme] = useState("light");

    // Tabs
    const [active, setActive] = useState<string>("modules");

    // Popups
    const [drawerState, setDrawerState] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    // Data
    const [modules, setModules] = useState<Module[]>();

    useEffect(() => {
        getModules().then((modules) => {
            setModules(modules);
            console.log(modules);
        }).catch((error) => {
            console.log(error);
        });
    }, []);

    return (
        <DynamicTheme themeName={theme}>
            <CssBaseline/>
            {/* Header */}
            <Paper sx={{
                p: 1,
                borderBottom: "1px solid #e0e0e0",
                borderBottomRightRadius: "10px",
                borderBottomLeftRadius: "10px",
            }}>
                <Stack direction={"row"}>
                    <Box flex={1}>
                        <Stack direction={"row"} spacing={3}>
                            <Box component={"img"} alt={"logo"} src={icon} sx={{
                                maxHeight: {
                                    xs: 50
                                }
                            }}/>
                            <Box display={{
                                xs: "none",
                                sm: "flex"
                            }}>
                                <Stack direction={"row"} spacing={2}>
                                    <StyledStack direction={"column"}>
                                        <StyledButton onClick={() => setActive("modules")}
                                                      variant={active == "modules" ? "contained" : "outlined"}>Modules</StyledButton>
                                    </StyledStack>
                                </Stack>
                            </Box>
                            <IconButton size="large" onClick={() => setDrawerState(true)} sx={{
                                display: {
                                    sm: "none"
                                }
                            }}><Menu/></IconButton>
                        </Stack>
                    </Box>
                    <Stack direction={"row"} spacing={2}>
                        <StyledStack sx={{
                            display: {
                                xs: "none",
                                sm: "flex"
                            }
                        }}>
                            <FormControl fullWidth>
                                <InputLabel id="theme-input">Theme</InputLabel>
                                <Select
                                    sx={{
                                        height: "40px"
                                    }}
                                    labelId="theme-selector-label"
                                    id="theme-selector"
                                    value={theme}
                                    label="Theme"
                                    onChange={(event: SelectChangeEvent) => {
                                        setTheme(event.target.value);
                                    }}
                                >
                                    <MenuItem value={"dark"} sx={{alignItems: "center"}}><DarkMode/> Dark</MenuItem>
                                    <MenuItem value={"light"} sx={{alignItems: "center"}}><LightMode/> Light</MenuItem>
                                </Select>
                            </FormControl>
                        </StyledStack>
                    </Stack>
                </Stack>
            </Paper>

            {/* Body */}
            <Container sx={{
                p: 1,
                mt: 2
            }}>
                {active === "modules" && (
                    !modules ? Loader : (
                        <Stack direction={"column"} spacing={2}>
                            <Typography variant={"h4"}>Modules</Typography>
                            {
                                modules.map((module) => {
                                    return (
                                        <Paper sx={{p: 1}} key={module.baseName}>
                                            <Stack direction={"row"} justifyContent={"space-between"} alignItems={"center"}>
                                                <Stack direction={"column"}>
                                                    <Typography variant={"h6"}>{module.baseName}</Typography>
                                                    <Typography variant={"body2"}>{module.typeName}</Typography>
                                                </Stack>
                                                <Stack direction={"row"} spacing={1}>
                                                    <Stack direction={"column"}>
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
                )}
            </Container>

            {/* Footer */}

            {/* Additional */}
            <SwipeableDrawer
                anchor={"left"}
                open={drawerState}
                onClose={() => setDrawerState(false)}
                onOpen={() => setDrawerState(true)}
            >
                <Box m={5}>
                    <Stack direction={"column"} spacing={2}>
                        <StyledStack direction={"column"}>
                            <StyledButton onClick={() => setActive("modules")}
                                          variant={active == "modules" ? "contained" : "outlined"}>Modules</StyledButton>
                        </StyledStack>
                        <StyledStack>
                            <FormControl fullWidth>
                                <InputLabel id="theme-input">Theme</InputLabel>
                                <Select
                                    sx={{
                                        height: "40px"
                                    }}
                                    labelId="theme-selector-label"
                                    id="theme-selector"
                                    value={theme}
                                    label="Theme"
                                    onChange={(event: SelectChangeEvent) => {
                                        setTheme(event.target.value);
                                    }}
                                >
                                    <MenuItem value={"dark"}><DarkMode/> Dark</MenuItem>
                                    <MenuItem value={"light"}><LightMode/> Light</MenuItem>
                                </Select>
                            </FormControl>
                        </StyledStack>
                    </Stack>
                </Box>
            </SwipeableDrawer>
            <Snackbar open={error != null} onClose={() => setError(null)} autoHideDuration={80000}
                      anchorOrigin={{horizontal: "center", vertical: "bottom"}} sx={{width: '80%'}}>
                <Alert onClose={() => setError(null)} severity="error" sx={{width: '100%'}}>
                    {error}
                </Alert>
            </Snackbar>
            <Snackbar open={success != null} onClose={() => setSuccess(null)} autoHideDuration={80000}
                      anchorOrigin={{horizontal: "center", vertical: "bottom"}} sx={{width: '80%'}}>
                <Alert onClose={() => setSuccess(null)} severity="success" sx={{width: '100%'}}>
                    {success}
                </Alert>
            </Snackbar>
        </DynamicTheme>
    );
}