import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { useLocation, Link } from "react-router-dom";
import { Home, Search, ArrowLeft } from 'lucide-react';
import { useEffect } from "react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
      <BackgroundScene className="absolute inset-0 w-full h-full" />
      
      <div className="relative max-w-4xl mx-auto p-6 flex items-center justify-center min-h-[calc(100vh-6rem)]">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <GlassCard variant="glow" className="p-12 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="mb-8"
            >
              <div className="text-8xl font-orbitron font-bold text-primary mb-4">
                404
              </div>
              <div className="w-20 h-1 bg-gradient-primary mx-auto mb-6" />
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="space-y-6"
            >
              <h1 className="font-orbitron font-bold text-3xl md:text-4xl text-foreground mb-4">
                Page Not Found
              </h1>
              
              <p className="text-xl text-muted-foreground mb-8 max-w-md mx-auto">
                Looks like you've ventured into uncharted digital territory. 
                The page you're looking for doesn't exist in our cyber realm.
              </p>
              
              <div className="text-sm text-muted-foreground mb-8 p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
                <strong>Requested URL:</strong> <code className="font-mono">{location.pathname}</code>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button variant="hero" size="lg" asChild className="group">
                  <Link to="/">
                    <Home className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                    Return Home
                  </Link>
                </Button>
                
                <Button variant="glass" size="lg" asChild>
                  <Link to="/lobbies">
                    <Search className="w-5 h-5 mr-2" />
                    Browse Lobbies
                  </Link>
                </Button>
                
                <Button variant="ghost" size="lg" onClick={() => window.history.back()}>
                  <ArrowLeft className="w-5 h-5 mr-2" />
                  Go Back
                </Button>
              </div>
            </motion.div>
          </GlassCard>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;
