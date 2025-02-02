import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="relative min-h-[80vh] flex flex-col items-center justify-center text-center px-4">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-secondary/5 -z-10" />
      
      {/* Content with animations */}
      <div className="max-w-4xl mx-auto space-y-8 animate-fade-in">
        <h1 className="text-5xl md:text-7xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
          Master Your Interview Skills with AI
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
          Practice with our AI interview coach, get instant feedback, and improve your chances of landing your dream job.
        </p>
        <div className="flex justify-center pt-4">
          <Button
            onClick={() => navigate("/interview")}
            className="group bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Start Practice Interview
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
      
      {/* Decorative elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-secondary/5 rounded-full blur-3xl -z-10" />
    </div>
  );
};