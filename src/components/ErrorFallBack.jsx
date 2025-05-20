import { Button } from "@mui/material"; 
import { useNavigate } from "react-router-dom";

export default function ErrorFallBack({ error }) {
    const navigate = useNavigate();

    return (
        <>
            <h1>Something went wrong...</h1>
            <Button variant="contained" color="primary" onClick={() => navigate("/")}>
                Back
            </Button>
        </>
    );
}