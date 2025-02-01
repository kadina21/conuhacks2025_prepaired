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
                    "model": "llama3:latest",
                    "prompt": "say hi in french", //hardcode
                    "stream": false
                }),
            });

            if (!res.ok) {
                throw new Error(`HTTP error! Status: ${res.status}`);
            }

            const data = await res.json();
            console.log("API Response:", data);

            // ✅ Extract the 'response' field from API data
            setResponse(data.response || "No valid response");
        } catch (error) {
            console.error("Error:", error);
            setResponse("Error fetching response");
        }
    }

    useEffect(() => {
        postData();
    }, []);

    return (
        <>
            {/* <h1>AI Response:</h1>
            <p>{response}</p> */}
        </>
    );
};

export default Aiai;
