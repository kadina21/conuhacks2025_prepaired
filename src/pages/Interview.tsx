import { useEffect, useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";
import { useStopwatch } from "react-timer-hook";
import Webcam from "react-webcam";

const Interview = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("Generating a question...");
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();
  const [recording, setRecording] = useState(false);
  const webcamRef = useRef<Webcam>(null);

  // Fetch AI-generated question
  const fetchAiQuestion = async () => {
    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3:latest",
          prompt: "Give me a challenging interview question.",
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAiQuestion(data.response || "Failed to generate a question.");
    } catch (error) {
      console.error("Error fetching AI question:", error);
      setAiQuestion("Error fetching question.");
    } finally {
      setIsLoading(false);
    }
  };

  const { transcript, listening, browserSupportsSpeechRecognition } = useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
  }

  const { seconds, minutes, start, pause } = useStopwatch();

  const handleClick = () => {
    if (!listening) {
      SpeechRecognition.startListening();
      start();
      setRecording(true);
    } else {
      SpeechRecognition.stopListening();
      pause();
      setRecording(false);
    }
  };

  useEffect(() => {
    fetchAiQuestion();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle className="text-2xl text-center">
              Mock Interview Session
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="bg-gray-100 p-6 rounded-lg">
              <p className="text-lg font-medium mb-2">Current Question:</p>
              <p className="text-gray-700">{aiQuestion}</p>
            </div>
            {aiResponse && (
              <div className="bg-blue-50 p-6 rounded-lg">
                <p className="text-lg font-medium mb-2">AI Feedback:</p>
                <p className="text-gray-700">{aiResponse}</p>
              </div>
            )}
            <p>Your response: {transcript}</p>
            <br />
            <span>{minutes}</span>:<span>{seconds}</span>
            <div className="flex justify-center gap-4">
              <Button
                onClick={handleClick}
                className={`${
                  listening
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-secondary hover:bg-secondary/90"
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
                onClick={fetchAiQuestion}
                disabled={isLoading || transcript.length === 0}
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-full flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Response
              </Button>
            </div>
            {recording && (
              <Webcam
                audio={true}
                ref={webcamRef}
                className="w-full h-auto"
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;