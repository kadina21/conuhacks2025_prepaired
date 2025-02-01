// import { useState } from "react";

// const Aiai = () => {

//     const [response, setResponse] = useState("no response yet")

//     async function postData(url = "http://localhost:11434/api/generate", data = {}) {
//         try {
//           const response = await fetch(url, {
//             method: "POST",
//             headers: {
//               "Content-Type": "application/json",
//             },
//             body: JSON.stringify({
//                 "model": "llama3",
//                 "prompt": "Why is the sky blue?"
//             }),
//           });
      
//           if (!response.ok) {
//             throw new Error(`HTTP error! Status: ${response.status}`);
//           }
      
//           return await response.json(); // Parse JSON response
//         } catch (error) {
//           console.error("Error:", error);
//         }
//       }
      
//       // Example usage:
//       postData("http://localhost:11434/api/generate", { key: "value" })
//         .then((data) => {
//             setResponse(data)
//             console.log("Success:", data)}
//         );

        

//     return (
//         <>
//         AJKSDNSV SDHJNDKNKHJGVHSBJKFHSBDFHJBDSJFHB
//         <p>{response} ASJHFNSDNSFADFSAF</p>
//         </>
//   );
// };

// export default Aiai

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
                    "model": "llama3", // Make sure this matches your installed model
                    "prompt": "Why is the sky blue?"
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
