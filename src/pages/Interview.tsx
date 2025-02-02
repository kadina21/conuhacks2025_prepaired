import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useStopwatch } from "react-timer-hook";
import { useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";

const Interview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aiQuestion, setAiQuestion] = useState("Generating a question...");
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();

  const location = useLocation();
  const { selectedRole } = location.state || {};

  // Fetch AI-generated question
  const fetchAiQuestion = async () => {
    await new Promise((resolve) => setTimeout(resolve, 2000)); // temporary timeout since i can't connect to API
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3:latest",
          prompt:
            "Generate a behavioral interview question without saying here is... ",
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

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    return <span>Browser doesn't support speech recognition.</span>;
    // TODO: render a textarea input instead
  }

  const { seconds, minutes, start, pause } = useStopwatch();

  const handleClick = () => {
    if (!listening) {
      SpeechRecognition.startListening();
      start();
    } else {
      SpeechRecognition.stopListening();
      pause();
    }
  };

  // Fetch AI feedback for user's response
  const handleSubmit = async () => {
    if (transcript.length === 0) {
      toast({
        title: "Error",
        description: "Please provide a response.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await fetch("http://localhost:11434/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "llama3:latest",
          prompt: `You're currently roleplaying as an interviewer. Evaluate the answer like you were directly talking to the interviewee. When giving your answer, no need to acknowledge the fact that you will do what I asked. Please give the answer directly and make it succinct. if the user's response is too short, don't try to evaluate their response. simply say that there was not enough context and they should provide more detail. give a clarity and quality score of the answer.
           ${transcript}`,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAiResponse(data.response || "No feedback generated.");
    } catch (error) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: "Failed to get AI response.",
        variant: "destructive",
      });
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
        {isLoading ? (
          <div className="h-[70vh] flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Card className="max-w-3xl mx-auto">
            <CardHeader>
              <CardTitle className="text-2xl text-center">
                Mock Interview Session: {selectedRole}
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
                  onClick={handleSubmit}
                  disabled={isLoading || transcript.length == 0}
                  className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-full flex items-center gap-2"
                >
                  <Send className="w-5 h-5" />
                  Submit Response
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interview;
