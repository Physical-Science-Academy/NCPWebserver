import React, {useState} from "react";
import DynamicTheme from "./DynamicTheme.tsx";
import {
    Alert,
    Box, Button,
    Container,
    CssBaseline, FormControl,
    IconButton,
    InputLabel,
    MenuItem, Select,
    SelectChangeEvent, Snackbar,
    Stack, styled, SwipeableDrawer
} from "@mui/material";
import icon from "./assets/ncp.png";
import {DarkMode, LightMode, Menu} from "@mui/icons-material";

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

    // Popups
    const [drawerState, setDrawerState] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    return (
        <DynamicTheme themeName={theme}>
            <CssBaseline />
            {/* Header */}
            <Container sx={{
                p: 1
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
                                        <StyledButton href={"/"} variant={"outlined"}>Modules</StyledButton>
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
            </Container>

            {/* Main */}
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
                            <StyledButton href={"/"} variant={"outlined"}>Modules</StyledButton>
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