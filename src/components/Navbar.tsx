import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { LogOut, User } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

export const Navbar = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check current session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      navigate("/");
    } catch (error: any) {
      toast({
        variant: "destructive",
        title: "Error signing out",
        description: error.message,
      });
    }
  };

  return (
    <nav className="border-b py-4">
      <div className="container flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold text-primary cursor-pointer" onClick={() => navigate("/")}>
            PrepAIred
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>
                Dashboard
              </Button>
              <Button onClick={() => navigate("/interview")} className="bg-secondary hover:bg-secondary/90">
                Practice Now
              </Button>
              <Button variant="ghost" onClick={handleSignOut}>
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </Button>
            </>
          ) : (
            <Button onClick={() => navigate("/auth")} className="bg-primary hover:bg-primary/90">
              <User className="h-4 w-4 mr-2" />
              Sign In
            </Button>
          )}
          <Button variant="ghost" onClick={() => navigate("/history")}>
            History
          </Button>
        </div>
      </div>
    </nav>
  );
};