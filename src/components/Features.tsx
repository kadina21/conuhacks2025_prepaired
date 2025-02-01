import { BookOpen, MessageSquare, BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
  {
    title: "Personalized Preparation",
    description: "Get tailored interview questions based on your industry and experience level.",
    icon: BookOpen,
  },
  {
    title: "Real-time Feedback",
    description: "Receive instant AI-powered feedback on your responses and communication style.",
    icon: MessageSquare,
  },
  {
    title: "Performance Analytics",
    description: "Track your progress with detailed analytics and improvement suggestions.",
    icon: BarChart3,
  },
];

export const Features = () => {
  return (
    <div className="py-24 bg-gray-50">
      <div className="container">
        <h2 className="text-3xl font-bold text-center mb-12 text-primary">
          Why Choose Our AI Interview Coach?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature) => (
            <Card key={feature.title} className="border-none shadow-lg">
              <CardHeader>
                <feature.icon className="w-12 h-12 text-secondary mb-4" />
                <CardTitle className="text-xl">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{feature.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};