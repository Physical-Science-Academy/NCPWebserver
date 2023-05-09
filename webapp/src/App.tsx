import React, {useState} from "react";
import DynamicTheme from "./DynamicTheme.tsx";
import {
    Alert, Backdrop,
    Box, Button, CircularProgress,
    Container,
    CssBaseline, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl,
    IconButton,
    InputLabel,
    MenuItem, Paper, Select,
    SelectChangeEvent, Snackbar,
    Stack, styled, SwipeableDrawer, TextField
} from "@mui/material";
import icon from "./assets/ncp.png";
import {DarkMode, LightMode, Menu} from "@mui/icons-material";
import {Modules} from "./Tabs/Modules.tsx";
import {Players} from "./Tabs/Players.tsx";
import {BanList} from "./Tabs/BanList.tsx";
import login from "./api/login.ts";

const StyledButton = styled(Button)({
    maxHeight: "50px",
    textTransform: 'none'
});

const StyledStack = styled(Stack)({
    justifyContent: "center"
});


export const App: React.FC = () => {
    // Theme
    const [theme, setTheme] = useState("light");

    // Tabs
    const [active, setActive] = useState<string>("modules");

    // Popups
    const [drawerState, setDrawerState] = useState<boolean>(false);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [unauthenticated, setUnauthenticated] = useState<boolean>(false);

    // Login Form
    const [username, setUsername] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [loginFailed, setLoginFailed] = useState<boolean>(false);

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
                                    <StyledStack direction={"column"}>
                                        <StyledButton onClick={() => setActive("players")}
                                                      variant={active == "players" ? "contained" : "outlined"}>Players</StyledButton>
                                    </StyledStack>
                                    <StyledStack direction={"column"}>
                                        <StyledButton onClick={() => setActive("banlist")}
                                                      variant={active == "banlist" ? "contained" : "outlined"}>Banlist</StyledButton>
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
                    <Modules setError={setError} setSuccess={setSuccess} setUnauthenticated={() => setUnauthenticated(true)}/>
                )}
                {active === "players" && (
                    <Players setError={setError} setSuccess={setSuccess} setUnauthenticated={() => setUnauthenticated(true)}/>
                )}
                {active === "banlist" && (
                    <BanList setError={setError} setSuccess={setSuccess} setUnauthenticated={() => setUnauthenticated(true)}/>
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
                        <StyledStack direction={"column"}>
                            <StyledButton onClick={() => setActive("players")}
                                          variant={active == "players" ? "contained" : "outlined"}>Players</StyledButton>
                        </StyledStack>
                        <StyledStack direction={"column"}>
                            <StyledButton onClick={() => setActive("banlist")}
                                          variant={active == "banlist" ? "contained" : "outlined"}>Banlist</StyledButton>
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
            <Dialog open={unauthenticated}>
                <DialogTitle>Login</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        Please login to continue
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        id="username"
                        label="Username"
                        type="text"
                        fullWidth
                        value={username}
                        onChange={(event) => {
                            setUsername(event.target.value);
                        }}
                    />
                    <TextField
                        margin="dense"
                        id="password"
                        label="Password"
                        type="password"
                        fullWidth
                        value={password}
                        onChange={(event) => {
                            setPassword(event.target.value);
                        }}
                    />
                    <Alert severity="error" sx={{width: '100%', mt: 2}} hidden={!loginFailed}>
                        Login failed. Please check your credentials and try again.
                    </Alert>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => {
                        setLoading(true);
                        setLoginFailed(false);
                        login(username, password).then(() => {
                            setLoading(false);
                        }).catch((error) => {
                            setLoading(false);
                            setLoginFailed(true);
                            console.log(error);
                        });
                    }}>Login</Button>
                </DialogActions>
            </Dialog>
            <Backdrop
                sx={{ color: '#fff', zIndex: 100 }}
                open={loading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </DynamicTheme>
    );
}