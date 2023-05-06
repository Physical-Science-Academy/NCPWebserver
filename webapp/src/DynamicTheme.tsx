import React from 'react';
import {ThemeProvider} from "@mui/material";
import {light} from "./themes/light";
import {dark} from "./themes/dark";

const getThemeByName = (theme: string) => {
    return themeMap[theme];
}

const themeMap: { [key: string]: any } = {
    light,
    dark
};

export const ThemeContext = React.createContext({});

interface DynamicThemeProps {
    children: React.ReactNode;
    themeName: string;
}

const DynamicTheme: React.FC<DynamicThemeProps> = ({ children, themeName }) => {
    // Retrieve the theme object by theme name
    const theme = getThemeByName(themeName);

    return (
        <ThemeProvider theme={theme}>{children}</ThemeProvider>
    );
};

export default DynamicTheme;