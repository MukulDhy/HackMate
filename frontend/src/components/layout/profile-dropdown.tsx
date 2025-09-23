import { motion } from 'framer-motion';
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, 
  Settings, 
  LogOut, 
  Crown,
  ChevronDown 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useUser } from '@/hooks/authHook';
import { logoutUser } from '@/store/slices/authSlice';
import { showSuccess } from '../ui/ToasterMsg';


export function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  
  const {user,dispatch} = useUser();
  
  const logout = () => {
    console.log("Mukul");
    dispatch(logoutUser());
    showSuccess("Logout Successfully","Auth",4000);
  }
  const navigate = useNavigate();

  if (!user) return null;

  const handleLogout = () => {
    setIsOpen(false);
    logout();
    navigate('/');
  };

  return (
    <div className="relative">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-2 rounded-lg hover:bg-primary/10 transition-all duration-300"
      >
        <img 
          src={user.profilePicture} 
          alt="Profile" 
          className="w-8 h-8 rounded-full ring-2 ring-primary/30"
        />
        <div className="hidden md:block text-left">
          <div className="font-medium text-foreground text-sm">{user.name}</div>
          <div className="text-xs text-muted-foreground">{user.role}</div>
        </div>
        <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </Button>

      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute top-full right-0 mt-2 w-64 z-50"
        >
          <GlassCard className="p-4 shadow-strong text-white">
            {/* User Info Header */}
            <div className="flex items-center gap-3 p-3 mb-3 rounded-lg bg-primary/5 border border-primary/20">
              <img 
                src={user.profilePicture} 
                alt="Profile" 
                className="w-12 h-12 rounded-full ring-2 ring-primary/30"
              />
              <div className="flex-1">
                <div className="font-orbitron font-bold text-foreground">{user.name}</div>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Crown className="w-3 h-3 text-warning" />
                  {user.role}
                </div>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="space-y-1">
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex text-white items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-black hover:bg-white transition-all duration-200 font-bold"
              >
                <User className="w-4 h-4 " />
                <span>View Profile</span>
              </Link>
              
              <Link
                to="/settings"
                onClick={() => setIsOpen(false)}
                className="flex text-white items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:text-black hover:bg-white transition-all duration-200 font-bold"
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
              
              <div className="border-t border-glass-border my-2"></div>
              
              <button
                onClick={handleLogout}
                className="w-full  flex items-center gap-3 px-3 py-2 rounded-lg text-destructive hover:bg-destructive/10 transition-all duration-200"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </nav>
          </GlassCard>
        </motion.div>
      )}
    </div>
  );
}