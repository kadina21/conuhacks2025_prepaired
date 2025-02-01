import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

export const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="border-b py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            InterviewAI
          </span>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate("/dashboard")}>
            Dashboard
          </Button>
          <Button onClick={() => navigate("/interview")} className="bg-secondary hover:bg-secondary/90">
            Practice Now
          </Button>
        </div>
      </div>
    </nav>
  );
};