import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export const Hero = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 animate-fadeIn">
      <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
        Master Your Interview Skills with AI
      </h1>
      <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
        Practice with our AI interview coach, get instant feedback, and improve
        your chances of landing your dream job.
      </p>
      <Button
        onClick={() => navigate("/role")}
        className="bg-secondary hover:bg-secondary/90 text-white px-8 py-6 text-lg rounded-full flex items-center gap-2"
      >
        Start Practice Interview
        <ArrowRight className="w-5 h-5" />
      </Button>
    </div>
  );
};
