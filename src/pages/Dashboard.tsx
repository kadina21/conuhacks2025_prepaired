import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { BarChart3, Clock, ThumbsUp } from "lucide-react";
import { getAdvice } from "@/constants";
import { useEffect, useState } from "react";

const Dashboard = () => {
  const [advice, setAdvice] = useState("Fetching your AI coach's advice...");
  const INTERVIEW_DAYS_AWAY = 5;

  const fetchAdvice = async () => {
    try {
      const res = await getAdvice();
      if (!res.ok) throw new Error(`HTTP error! Status: ${res.status}`);
      const data = await res.json();
      setAdvice(data.response || "Failed to fetch advice.");
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchAdvice();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container py-8">
        <h1 className="text-3xl font-bold mb-8">Your Interview Performance</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Interviews
              </CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">3</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Average Duration
              </CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">15 min</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Overall Score
              </CardTitle>
              <ThumbsUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">85%</div>
            </CardContent>
          </Card>
        </div>
        <h1 className="text-3xl font-bold mb-8">Advice from your Coach</h1>
        <h2 className="text-xl font-bold mb-4">
          Your interview is coming up in {INTERVIEW_DAYS_AWAY} days!
        </h2>
        <p>{advice}</p>
      </div>
    </div>
  );
};

export default Dashboard;
