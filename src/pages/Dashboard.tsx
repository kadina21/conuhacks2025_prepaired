import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Navbar } from "@/components/Navbar";
import { BarChart3, Clock, ThumbsUp } from "lucide-react";
import { getAdvice, LEETCODE_QUESTIONS } from "@/constants";
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

  const questions = getRandomQuestions(LEETCODE_QUESTIONS);

  function getRandomQuestions(
    questions: string[],
    numQuestions: number = 3
  ): string[] {
    const shuffled = [...questions];

    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]; // Swap elements
    }

    return shuffled.slice(0, numQuestions);
  }

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
        <p className="mb-4">{advice}</p>
        <h3 className="mb-4">
          For some technical prep, try out these questions today:
        </h3>
        <ul className="flex flex-col gap-2">
          {questions.map((q) => (
            <a className="underline" href="https://leetcode.com/problemset/">
              {q}
            </a>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Dashboard;
