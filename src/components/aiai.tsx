import { useState } from "react";

const Aiai = () => {

    const [response, setResponse] = useState("no response yet")

    async function postData(url = "http://localhost:11434/api/generate", data = {}) {
        try {
          const response = await fetch(url, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
                "model": "llama3.2",
                "prompt": "Why is the sky blue?"
            }),
          });
      
          if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
          }
      
          return await response.json(); // Parse JSON response
        } catch (error) {
          console.error("Error:", error);
        }
      }
      
      // Example usage:
      postData("http://localhost:11434/api/generate", { key: "value" })
        .then((data) => {
            setResponse(data)
            console.log("Success:", data)}
        );

        

    return (
        <>
        AJKSDNSV SDHJNDKNKHJGVHSBJKFHSBDFHJBDSJFHB
        <p>{response} ASJHFNSDNSFADFSAF</p>
        </>
  );
};

export default Aiai