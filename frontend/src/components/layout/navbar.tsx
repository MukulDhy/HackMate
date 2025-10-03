import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { ProfileDropdown } from './profile-dropdown';
import { HackMateLogoProfessional } from '@/components/ui/hackmate-logo-professional';
import { Menu, X, Bell } from 'lucide-react';
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useUser } from '@/hooks/authHook';

const navItems = [
  { name: 'Dashboard', path: '/dashboard' },
  { name: 'Lobbies', path: '/lobbies' },
  { name: 'Teams', path: '/teams' },
  { name: 'Donation', path: '/donation' },
];

const publicNavItems = [
  // { name: 'Home', path: '/' }, // Removed Home button
];

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const {isAuthenticated,user}  = useUser();
  //const isAuthenticated = true;



  const currentNavItems = isAuthenticated ? navItems : publicNavItems;

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className="fixed top-0 left-0 right-0 z-50 backdrop-blur-sm border-border/50"
    >
      <div className="mx-auto max-w-7xl flex items-center justify-between p-4">
        {/* Logo */}
        <Link to={user && user.id ? "/dashboard" : "/"} className="flex items-center gap-3 group">
          <HackMateLogoProfessional 
            size="md" 
            className="group-hover:scale-105 transition-transform duration-200"
          />
          <span className="font-semibold text-xl text-foreground group-hover:text-primary transition-colors">
            HackMate
          </span>
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center gap-8">
          {currentNavItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-4 py-2 rounded-lg transition-all duration-300 ${
                location.pathname === item.path
                  ? 'text-primary bg-primary/10 shadow-glow'
                  : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
              }`}
            >
              {item.name}
              {location.pathname === item.path && (
                <motion.div
                  layoutId="navbar-indicator"
                  className="absolute bottom-0 left-0 right-0 h-0.5 rounded-full"
                />
              )}
            </Link>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="hidden md:flex items-center gap-4">
          {isAuthenticated ? (
            <>
              {/* Notification Bell */}
              <Button variant="ghost" size="icon" className="relative">
                <Bell className="h-5 w-5" />
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse">
                  <div className="absolute inset-0 bg-destructive rounded-full animate-ping"></div>
                </div>
              </Button>
              
              <ProfileDropdown />
            </>
          ) : (
            <>
              <Link to="/login">
                <Button variant="ghost" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/signup">
                <Button variant="hero" size="sm">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden mt-4"
        >
          <div className="mx-auto max-w-7xl bg-background/95 backdrop-blur-md border-border/50 rounded-lg p-6 space-y-4">
            {currentNavItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`block px-4 py-3 rounded-lg transition-all duration-300 ${
                  location.pathname === item.path
                    ? 'text-primary bg-primary/10'
                    : 'text-muted-foreground hover:text-primary hover:bg-primary/5'
                }`}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col gap-3 pt-4 border-t border-glass-border">
              {isAuthenticated ? (
                <>
                  <Button variant="ghost" size="icon" className="relative mx-auto">
                    <Bell className="h-5 w-5" />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full animate-pulse"></div>
                  </Button>
                  <div className="mt-2">
                    <ProfileDropdown />
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/signup">
                    <Button variant="hero" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}