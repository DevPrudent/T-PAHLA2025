import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { Loader2, ShieldCheck } from 'lucide-react';
import { motion } from 'framer-motion';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();

  useEffect(() => {
    // If auth is not loading and user is already logged in, redirect to dashboard
    if (!authLoading && session) {
      navigate('/admin');
    }
  }, [session, authLoading, navigate]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Logged in successfully!');
        navigate('/admin'); // onAuthStateChange in AuthContext will update session
      }
    } catch (error) {
      toast.error('An unexpected error occurred.');
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  // Don't render the form if auth is loading or if user is already logged in (to avoid flash of form)
  if (authLoading || (!authLoading && session)) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-muted/40">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-tpahla-darkgreen">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-4"
      >
        <Card className="border-tpahla-gold/30 bg-tpahla-neutral">
          <CardHeader className="text-center">
            <div className="mx-auto mb-4 w-20 h-20 rounded-full bg-tpahla-gold/20 flex items-center justify-center">
              <ShieldCheck className="h-10 w-10 text-tpahla-gold" />
            </div>
            <CardTitle className="text-2xl text-tpahla-gold">Admin Login</CardTitle>
            <CardDescription className="text-tpahla-text-secondary">
              Enter your credentials to access the admin panel
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-tpahla-text-primary">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-tpahla-text-primary">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  disabled={isSubmitting}
                  className="bg-tpahla-neutral-light border-tpahla-gold/20 text-tpahla-text-primary focus:border-tpahla-gold"
                />
              </div>
              <Button 
                type="submit" 
                className="w-full bg-tpahla-gold text-tpahla-darkgreen hover:bg-tpahla-gold/90" 
                disabled={isSubmitting}
              >
                {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
                {isSubmitting ? 'Logging in...' : 'Login'}
              </Button>
            </form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-tpahla-text-secondary">
              For admin access, please contact the system administrator
            </p>
          </CardFooter>
        </Card>
        
        <div className="mt-8 text-center">
          <Link to="/" className="text-tpahla-gold hover:text-tpahla-gold/80 text-sm">
            ← Return to Homepage
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLoginPage;