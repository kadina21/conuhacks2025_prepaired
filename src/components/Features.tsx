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
    <div className="py-24 relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-gray-50 to-white dark:from-gray-900 dark:to-gray-800 -z-10" />
      
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-16 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Why Choose Our AI Interview Coach?
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <Card 
              key={feature.title}
              className="group relative bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm border-none shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 opacity-0 group-hover:opacity-100 transition-opacity" />
              
              <CardHeader className="relative">
                <div className="w-12 h-12 rounded-lg bg-primary/10 dark:bg-primary/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <CardTitle className="text-xl font-semibold">{feature.title}</CardTitle>
              </CardHeader>
              
              <CardContent>
                <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};