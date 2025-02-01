import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { Mic, MicOff } from "lucide-react";

const Interview = () => {
  const [isRecording, setIsRecording] = useState(false);

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

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
              <p className="text-gray-700">
                Tell me about a challenging project you worked on and how you overcame obstacles.
              </p>
            </div>
            <div className="flex justify-center">
              <Button
                onClick={toggleRecording}
                className={`${
                  isRecording ? "bg-red-500 hover:bg-red-600" : "bg-secondary hover:bg-secondary/90"
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Interview;