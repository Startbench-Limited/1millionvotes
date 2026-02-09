import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { CheckCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import SocialShareButtons from "@/components/SocialShareButtons";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

const states = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue", "Borno",
  "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT Abuja", "Gombe",
  "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi", "Kwara", "Lagos",
  "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo", "Plateau", "Rivers",
  "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const RegisterSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    toast.success("Your pledge has been registered successfully!", {
      description: "Thank you for standing with the movement.",
    });
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-hero relative overflow-hidden" id="register">
      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-secondary/5 rounded-full -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-secondary/5 rounded-full translate-x-1/3 translate-y-1/3" />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-2xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-center mb-10"
          >
            <p className="font-heading font-semibold text-sm uppercase tracking-widest text-secondary mb-3">
              Make Your Pledge
            </p>
            <h2 className="font-heading font-bold text-3xl sm:text-4xl text-primary-foreground mb-4">
              Register Your Pledge
            </h2>
            <p className="text-primary-foreground/70 max-w-lg mx-auto">
              Fill in your details to pledge your support. It takes less than a minute.
            </p>
          </motion.div>

          {!submitted ? (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.2, duration: 0.6 }}
              onSubmit={handleSubmit}
              className="bg-card rounded-2xl p-6 sm:p-8 shadow-elevated space-y-5"
            >
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="fullname" className="font-heading font-semibold text-sm">Full Name</Label>
                  <Input id="fullname" placeholder="Enter your full name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone" className="font-heading font-semibold text-sm">Phone Number</Label>
                  <Input id="phone" type="tel" placeholder="080XXXXXXXX" required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="state" className="font-heading font-semibold text-sm">State</Label>
                  <Select required>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {states.map((state) => (
                        <SelectItem key={state} value={state.toLowerCase()}>
                          {state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lga" className="font-heading font-semibold text-sm">Local Government</Label>
                  <Input id="lga" placeholder="Enter your LGA" required />
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <Label htmlFor="ward" className="font-heading font-semibold text-sm">Ward</Label>
                  <Input id="ward" placeholder="Enter your ward" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="pu" className="font-heading font-semibold text-sm">Polling Unit</Label>
                  <Input id="pu" placeholder="Enter PU code" required />
                </div>
              </div>

              <Button
                type="submit"
                size="lg"
                className="w-full font-heading font-bold text-lg shadow-primary hover:scale-[1.02] transition-transform"
              >
                Submit My Pledge
                <ArrowRight className="ml-2" size={20} />
              </Button>
            </motion.form>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="bg-card rounded-2xl p-10 shadow-elevated text-center"
            >
              <CheckCircle className="mx-auto text-primary mb-4" size={64} />
              <h3 className="font-heading font-bold text-2xl text-foreground mb-2">
                Pledge Registered!
              </h3>
              <p className="text-muted-foreground mb-6">
                Thank you for joining the 1 Million Pledge movement. Share with others!
              </p>
              <SocialShareButtons className="mb-6" />
              <Button
                variant="outline"
                onClick={() => setSubmitted(false)}
                className="font-heading font-semibold"
              >
                Register Another Pledge
              </Button>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
};

export default RegisterSection;
