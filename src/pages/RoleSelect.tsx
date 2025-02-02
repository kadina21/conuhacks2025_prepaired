import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ROLES } from "@/constants";
import { ArrowRight } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RoleSelect = () => {
  const [selectedRole, setSelectedRole] = useState<string | null>();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mt-24 py-8 flex flex-col items-center gap-4 text-center px-4 animate-fadeIn">
        <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6">
          What role are you interviewing for?
        </h1>
        <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-2xl">
          This helps us tailor your experience and prepare questions more
          relevant to you.
        </p>
        <Select value={selectedRole} onValueChange={setSelectedRole}>
          <SelectTrigger className="w-72 h-14 text-lg px-4 py-2">
            <SelectValue placeholder="Select your job title" />
          </SelectTrigger>
          <SelectContent>
            {ROLES.map((role, i) => (
              <SelectItem key={i} value={role} className="text-md py-3">
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {selectedRole && (
          <Button
            onClick={() => navigate("/interview")}
            className="bg-primary hover:bg-primary/90 mt-12 px-8 py-6 text-lg rounded-full flex items-center gap-2 animate-fadeIn"
          >
            Start Practice Interview
            <ArrowRight className="w-5 h-5" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default RoleSelect;
