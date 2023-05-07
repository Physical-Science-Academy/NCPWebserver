import {CircularProgress} from "@mui/material";

export function Loader() {
    return (
        <div
            style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center"
            }}
        >
            <CircularProgress/>
        </div>
    );
}