import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import campaignLogo from "@/assets/campaign-logo.png";

const ResetPassword = () => {
  const navigate = useNavigate();
  const { updatePassword, session } = useAuth();
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.includes("type=recovery") || session) setReady(true);
  }, [session]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const password = form.get("password") as string;
    const confirm = form.get("confirm") as string;

    if (password !== confirm) {
      toast.error("Passwords do not match.");
      return;
    }

    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);

    if (error) {
      toast.error(error.message);
    } else {
      toast.success("Password updated. You're signed in.");
      navigate("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-hero flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-md">
        <img src={campaignLogo} alt="Campaign" className="h-16 mx-auto mb-6" />
        <Card className="shadow-elevated">
          <CardHeader className="text-center">
            <CardTitle className="font-heading text-2xl">Set a New Password</CardTitle>
            <CardDescription>
              {ready
                ? "Choose a new password for your account"
                : "Open this page from the reset link sent to your email"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {ready ? (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="password">New Password</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input name="password" id="password" type="password" placeholder="Min 6 characters" className="pl-9" minLength={6} required />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm">Confirm Password</Label>
                  <div className="relative">
                    <Lock size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
                    <Input name="confirm" id="confirm" type="password" placeholder="Repeat password" className="pl-9" minLength={6} required />
                  </div>
                </div>
                <Button type="submit" className="w-full font-heading font-bold" disabled={loading}>
                  {loading ? "Updating..." : "Update Password"}
                </Button>
              </form>
            ) : (
              <Button variant="outline" className="w-full" onClick={() => navigate("/auth")}>
                Back to Sign In
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ResetPassword;
