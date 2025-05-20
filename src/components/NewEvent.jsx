import { Button, Container } from "@mui/material";  
import { collection, addDoc } from "firebase/firestore";

import db from "../firebase";

export default function NewEvent() {
    const handleAddEvent = async () => {
       try {
            const docRef = await addDoc(collection(db, "events"), {
            data: "9-20-2025",
            "event-name": "Fire Drill",
            location: "42 Cypress Dr. Summerfield, FL 34491"
        });
        console.log("added doc: ", docRef.id);
        }
        catch (e) {
            console.error(e);
        } 
    }
        
    return (
        <>
            <Container>
                <Button variant="contained" onClick={handleAddEvent}>
                    Add Event
                </Button>
            </Container>
        </>
    );
}