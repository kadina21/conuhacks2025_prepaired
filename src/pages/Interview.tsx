import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Mic, MicOff, Send } from "lucide-react";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [userResponse, setUserResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [aiQuestion, setAiQuestion] = useState("Generating a question...");
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

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
      console.error("Error:", error);
      setAiQuestion("Error fetching question.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch AI feedback for user's response
  const handleSubmit = async () => {
    if (!userResponse.trim()) {
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
          prompt: `Evaluate this interview response: ${userResponse}`,
          stream: false,
        }),
      });

      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAiResponse(data.response || "No feedback generated.");
      setUserResponse(""); // Clear input after submitting
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

            <Textarea
              placeholder="Type your response here..."
              value={userResponse}
              onChange={(e) => setUserResponse(e.target.value)}
              className="min-h-[120px]"
            />

            <div className="flex justify-center gap-4">
              <Button
                onClick={toggleRecording}
                className={`${
                  isRecording
                    ? "bg-red-500 hover:bg-red-600"
                    : "bg-secondary hover:bg-secondary/90"
                } px-8 py-6 text-lg rounded-full flex items-center gap-2`}
              >
                {isRecording ? (
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
                disabled={isLoading || !userResponse.trim()}
                className="bg-primary hover:bg-primary/90 px-8 py-6 text-lg rounded-full flex items-center gap-2"
              >
                <Send className="w-5 h-5" />
                Submit Response
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;
