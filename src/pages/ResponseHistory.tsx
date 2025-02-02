import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { useToast } from "@/components/ui/use-toast";

const ResponseHistory = () => {
  const [responses, setResponses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const fetchResponses = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/responses");
        if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
        const data = await res.json();
        setResponses(data);
      } catch (error) {
        console.error("Error fetching responses:", error);
        toast({
          title: "Error",
          description: "Failed to fetch responses.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchResponses();
  }, [toast]);

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
              <CardTitle className="text-2xl text-center">Response History</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {responses.length === 0 ? (
                <p className="text-center text-gray-700">No responses found.</p>
              ) : (
                responses.map((response, index) => (
                  <div key={index} className="bg-gray-100 p-6 rounded-lg">
                    <p className="text-lg font-medium mb-2">Question:</p>
                    <p className="text-gray-700">{response.question}</p>
                    <p className="text-lg font-medium mt-4 mb-2">Answer:</p>
                    <p className="text-gray-700">{response.answer}</p>
                    <p className="text-sm text-gray-500 mt-4">Timestamp: {new Date(response.timestamp).toLocaleString()}</p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default ResponseHistory;