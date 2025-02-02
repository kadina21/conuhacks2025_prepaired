import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useStopwatch } from "react-timer-hook";

const Interview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("Generating a question...");
  const [aiFeedback, setAiFeedback] = useState("");
  const [clarityScore, setClarityScore] = useState(null);
  const [qualityScore, setQualityScore] = useState(null);
  
  const { toast } = useToast();
  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();
  const { seconds, minutes, start, pause } = useStopwatch();

  // Fetch AI-generated question
  const fetchAiQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3:latest",
          prompt: "Generate a behavioral interview question without saying 'Here is...'",
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAiQuestion(data.response || "Failed to generate a question.");
    } catch (error) {
      console.error("Error:", error);
      setAiQuestion("Error fetching question.");
    } finally {
      setIsLoading(false);
    }
  };

  // Start/Stop Speech Recognition
  const handleClick = () => {
    if (!listening) {
      SpeechRecognition.startListening();
      start();
    } else {
      SpeechRecognition.stopListening();
      pause();
    }
  };

  // Save user response to MongoDB
  const saveResponse = async (question, answer) => {
    try {
      const res = await fetch("http://localhost:5000/api/save-response", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, answer }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      console.log("Response saved successfully!");
    } catch (error) {
      console.error("Error saving response:", error);
      toast({ title: "Error", description: "Failed to save response.", variant: "destructive" });
    }
  };

  // Fetch AI feedback for the user's response
  const handleSubmit = async () => {
    if (!transcript.trim()) {
      toast({ title: "Error", description: "Please provide a response.", variant: "destructive" });
      return;
    }

    setIsLoading(true);
    try {
      await saveResponse(aiQuestion, transcript);

      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3:latest",
          prompt: `You're currently roleplaying as an interviewer. Evaluate the answer like you were directly talking to the interviewee. When giving your answer, no need to acknowledge the fact that you will do what I asked. Please give the answer directly and make it succinct. if the user's response is too short, don't try to evaluate their response. simply say that there was not enough context and they should provide more detail.
          
          At the end, include:
          Clarity Score: X/10
          Quality Score: Y/10
          
          ${transcript}`,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const responseText = data.response;

      // Extract scores using regex
      const clarityMatch = responseText.match(/Clarity Score:\s*(\d+)\/10/);
      const qualityMatch = responseText.match(/Quality Score:\s*(\d+)\/10/);

      setClarityScore(clarityMatch ? parseInt(clarityMatch[1]) : null);
      setQualityScore(qualityMatch ? parseInt(qualityMatch[1]) : null);

      // Extract AI feedback (excluding scores)
      setAiFeedback(responseText.replace(/Clarity Score:.*|Quality Score:.*/g, "").trim());
    } catch (error) {
      console.error("Error:", error);
      toast({ title: "Error", description: "Failed to get AI response.", variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch question on first render
  useEffect(() => {
    fetchAiQuestion();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">Mock Interview Session</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg font-medium mb-2">Current Question:</p>
              <p className="text-gray-700">{aiQuestion}</p>
            </div>

            <p>Your response: {transcript}</p>
            <p>
              <span>{minutes}</span>:<span>{seconds}</span>
            </p>

            <div className="flex justify-center gap-4">
              <Button
                onClick={handleClick}
                className={`${
                  listening ? "bg-red-500 hover:bg-red-600" : "bg-secondary hover:bg-secondary/90"
                } px-8 py-6 text-lg rounded-full flex items-center gap-2`}
              >
                {listening ? (
                  <>
                    <MicOff className="w-5 h-5" />
                    Stop Recording
                  </>
                ) : (
                  <>
                    <Mic className="w-5 h-5" />
                    Start Recording
                  </>
                )}
              </Button>

              <Button
                onClick={handleSubmit}
                disabled={isLoading || transcript.length === 0}
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-full flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Response
              </Button>
            </div>

            {aiFeedback && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-lg font-medium mb-2">AI Feedback:</p>
                <p className="text-gray-700">{aiFeedback}</p>
              </div>
            )}

            {(clarityScore !== null || qualityScore !== null) && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-lg font-medium mb-2">Evaluation Scores Out of 10:</p>
                <p className="text-gray-700"><strong>Clarity Score :</strong> {clarityScore ?? "N/A"}</p>
                <p className="text-gray-700"><strong>Quality Score:</strong> {qualityScore ?? "N/A"}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
