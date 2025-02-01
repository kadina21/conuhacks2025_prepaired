import { useState, useEffect } from "react";

const Aiai = () => {
    const [response, setResponse] = useState("No response yet");

    async function postData() {
        try {
            const res = await fetch("http://localhost:11434/api/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    "model": "llama3:latest", // Make sure this matches your installed model
                    "prompt": "Why is the sky blue?",
                    "stream": false // Disable streaming for easier debugging
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            setResponse(data.response || "No valid response"); // Ensure safe state update
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error fetching response");
        }
    }

    useEffect(() => {
        postData(); // Call API when component mounts
    }, []);

    return (
        <>
            <h1>AI Response:</h1>
            <p>{response}</p>
        </>
    );
};

export default Aiai;
