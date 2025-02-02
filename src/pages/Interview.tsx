import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { ArrowRight, Mic, MicOff, Send } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import { useStopwatch } from "react-timer-hook";
import { useLocation } from "react-router-dom";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { getFeedback, getQuestion } from "@/constants";

const Interview = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [aiQuestion, setAiQuestion] = useState("Generating a question...");
  const [aiFeedback, setAiFeedback] = useState("");
  const [clarityScore, setClarityScore] = useState(null);
  const [qualityScore, setQualityScore] = useState(null);
  const { toast } = useToast();

  const location = useLocation();
  const { selectedRole } = location.state || {};

  // Fetch AI-generated question
  const fetchAiQuestion = async () => {
    try {
      const res = await getQuestion(selectedRole);
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

  // Fetch question on first render
  useEffect(() => {
    fetchAiQuestion();
  }, []);

  const { transcript, listening, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  if (!browserSupportsSpeechRecognition) {
    toast({
      title: "Error",
      description: "This browser doesn't support speech recognition.",
      variant: "destructive",
    });
    // TODO: render a textarea input instead
  }

  useEffect(() => {
    if (listening) {
      SpeechRecognition.startListening();
      start();
    } else if (!listening) {
      SpeechRecognition.stopListening();
      pause();
    }
  }, [listening]);

  const { seconds, minutes, start, pause, reset } = useStopwatch();

  // Start/Stop Speech Recognition
  const handleClick = () => {
    if (!listening) {
      SpeechRecognition.startListening();
      reset();
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
      toast({
        title: "Error",
        description: "Failed to save response.",
        variant: "destructive",
      });
    }
  };

  // Fetch AI feedback for the user's response
  const handleSubmit = async () => {
    if (!transcript.trim()) {
      toast({
        title: "Error",
        description: "Please provide a response.",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const res = await getFeedback({ userResponse: transcript });
      await saveResponse(aiQuestion, transcript);

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      const responseText = data.response;

      // Extract scores using regex
      const clarityMatch = responseText.match(/Clarity Score:\s*(\d+)\/10/);
      const qualityMatch = responseText.match(/Quality Score:\s*(\d+)\/10/);

      setClarityScore(clarityMatch ? parseInt(clarityMatch[1]) : null);
      setQualityScore(qualityMatch ? parseInt(qualityMatch[1]) : null);

      // Extract AI feedback (excluding scores)
      setAiFeedback(
        responseText.replace(/Clarity Score:.*|Quality Score:.*/g, "").trim()
      );
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        {isLoading ? (
          <div className="h-[70vh] flex justify-center items-center">
            <LoadingSpinner />
          </div>
        ) : (
          <Card className="max-w-3xl mx-auto animate-fadeIn">
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
              <p className="text-lg font-medium">Your Response:</p>
              {seconds != 0 && (
                <>
                  <p className="m-0">{transcript}</p>
                  <div>
                    <span>{String(minutes).padStart(2, "0")}</span>:
                    <span>{String(seconds).padStart(2, "0")}</span>
                  </div>
                </>
              )}
              {!aiFeedback && (
                <div className="flex justify-center gap-4">
                  <Button
                    onClick={handleClick}
                    className={`${
                      listening
                        ? "bg-red-500 hover:bg-red-600"
                        : "bg-secondary hover:bg-secondary/90"
                    } px-8 py-6 text-lg rounded-full flex items-center gap-2`}
                    disabled={listening}
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
              )}
              {aiFeedback && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-lg font-medium mb-2">AI Feedback:</p>
                  <p className="text-gray-700">{aiFeedback}</p>
                </div>
              )}
              {(clarityScore !== null || qualityScore !== null) && (
                <div className="bg-blue-50 p-6 rounded-lg">
                  <p className="text-lg font-medium mb-2">
                    Evaluation Scores Out of 10:
                  </p>
                  <p className="text-gray-700">
                    <strong>Clarity Score :</strong> {clarityScore ?? "N/A"}
                  </p>
                  <p className="text-gray-700">
                    <strong>Quality Score:</strong> {qualityScore ?? "N/A"}
                  </p>
                </div>
              )}
              {aiFeedback && (
                <div className="flex justify-end">
                  <Button
                    onClick={() => window.location.reload()}
                    className="bg-primary hover:bg-primary/90 mt-12 px-8 py-6 text-lg rounded-full flex items-center gap-2 animate-fadeIn"
                  >
                    Next Question
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Interview;
