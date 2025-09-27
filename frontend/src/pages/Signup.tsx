import { motion } from 'framer-motion';
import { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Eye, EyeOff, Mail, Lock, User, Github, Chrome, Loader2 } from 'lucide-react';
import { showError, showSuccess, showWarning } from '@/components/ui/ToasterMsg';
import { googleAuth, registerUser } from '@/store/slices/authSlice';
import { useAppDispatch } from '@/hooks/authHook';
import { loginWithGoogle } from '@/config/firebase';

function getErrorMessage(errorPayload) {
  if (!errorPayload) {
    return "Login failed";
  }

  // Agar message property exist karti hai
  if (typeof errorPayload === "object" && errorPayload.message) {
    return errorPayload.message;
  }

  // Agar pura string hai
  if (typeof errorPayload === "string") {
    return errorPayload;
  }

  // Agar array hai
  if (Array.isArray(errorPayload)) {
    return errorPayload.join(", ");
  }

  // Agar object hai to JSON stringify
  if (typeof errorPayload === "object") {
    return JSON.stringify(errorPayload);
  }

  // Fallback
  return String(errorPayload) || "Login failed";
}
export default function Signup() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreedToTerms: false
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();
 const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const handleInputChange = useCallback((field: string, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const handleGoogleLogin = async () => {
      setIsGoogleLoading(true);
      try {
        const result = await loginWithGoogle();
        console.log("User Info:", result.user); 
  
        // Send user data to your backend
        // const response = await axios.post(`${API_URL}/api/user/google`, {
        //   uid: result.user.uid,
        //   email: result.user.email,
        //   displayName: result.user.displayName,
        //   photoURL: result.user.photoURL,
        //   email_verified:true
        // }, {
        //   headers: { "Content-Type": "application/json" }
        // });
        const resultGoogle = await dispatch(googleAuth({ email: result.user.email, displayName: result.user.displayName, photoURL: result.user.photoURL, email_verified: true }));
        // Store the token from your backend
        // if (resultGoogle.data.token) {
        //   localStorage.setItem('token', resultGoogle.data.token);
        //   showSuccess("Successfully logged in with Google", "Auth", 3000);
        //   navigate("/dashboard");
        // }
        if (googleAuth.fulfilled.match(resultGoogle)) {
          showSuccess("SignUp successful!", "Success", 3000);
          navigate("/dashboard");
        } else if (googleAuth.rejected.match(resultGoogle)) {
          const errorPayload = resultGoogle.payload;
          showError(getErrorMessage(errorPayload), "Error", 6000);
        }
      } catch (error: any) {
        console.error("Google Login Error:", error);
        if (error.code === 'auth/popup-blocked') {
          showError("Please allow pop-ups for Google login", "Google Login Failed", 5000);
        } else if (error.code === 'auth/popup-closed-by-user') {
          showError("Google login was cancelled", "Login Cancelled", 4000);
        } else {
          showError("Google login failed. Please try again.", "Login Error", 5000);
        }
      } finally {
        setIsGoogleLoading(false);
      }
    };
  const validateForm = () => {
    if (formData.name.trim() === "") {
      showWarning("Name Can't Be Blank", "Validation", 3000);
      return false;
    }

    if (formData.email.trim() === "") {
      showWarning("Email Can't Be Blank", "Validation", 3000);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showWarning("Please enter a valid email address", "Validation", 3000);
      return false;
    }

    if (formData.password.length < 6) {
      showWarning("Password must be at least 6 characters", "Validation", 3000);
      return false;
    }

    if (formData.password !== formData.confirmPassword) {
      showWarning("Passwords must match", "Validation", 3000);
      setShowPassword(true);
      setShowConfirmPassword(true);
      return false;
    }

    if (!formData.agreedToTerms) {
      showWarning("You must agree to the terms and conditions", "Validation", 3000);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    const { confirmPassword, agreedToTerms, ...data } = formData;

    try {
      const result = await dispatch(registerUser(data));
      
      if (registerUser.fulfilled.match(result)) {
        showSuccess("Registration successful!", "Success", 3000);
        navigate("/dashboard");
      } else if (registerUser.rejected.match(result)) {
        const errorPayload = result.payload;
        
        if (errorPayload?.errorCode === 1) {
          const errors = errorPayload?.errors || [];
          if (errors.length > 0) {
            errors.forEach((error: any) => {
              showWarning(error.message || 'Registration failed', 'Error', 5000);
            });
          } else {
            showWarning(result.payload?.message || 'Registration failed', 'Error', 5000);
          }
        } else {
          showWarning(errorPayload?.message || "Registration failed", "Error", 6000);
        }
      }
    } catch (error) {
      showWarning("An unexpected error occurred", "Error", 6000);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen animated-bg relative overflow-hidden flex items-center justify-center p-4">
      <BackgroundScene className="absolute inset-0 w-full h-full" />

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="relative w-full max-w-md"
      >
        <GlassCard className="p-8 shadow-strong">
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow"
            >
              <span className="font-orbitron font-bold text-2xl text-white">HM</span>
            </motion.div>
            
            <h1 className="font-orbitron font-bold text-3xl text-foreground mb-2">
              Join Hack Mate
            </h1>
            <p className="text-muted-foreground">
              Create your account and start building the future
            </p>
          </div>

          {/* Social Signup */}
          <div className="space-y-3 mb-6">
            {/* <Button 
              type="button" 
              variant="ghost" 
              className="w-full h-12 border border-glass-border hover:bg-primary/10"
              disabled={isLoading}
            >
              <Github className="w-5 h-5 mr-3" />
              Continue with GitHub
            </Button> */}
           <Button 
                variant="ghost" 
                className="w-full h-12 border border-glass-border hover:bg-primary/10" 
                onClick={handleGoogleLogin}
                disabled={isLoading || isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <Loader2 className="w-5 h-5 mr-3 animate-spin" />
                ) : (
                  <Chrome className="w-5 h-5 mr-3" />
                )}
                {isGoogleLoading ? "Connecting..." : "Continue with Google"}
              </Button>
          </div>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px bg-glass-border"></div>
            <span className="text-sm text-muted-foreground">OR</span>
            <div className="flex-1 h-px bg-glass-border"></div>
          </div>

          {/* Signup Form */}
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-foreground font-medium">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="name"
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Enter your full name"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground font-medium">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="pl-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Enter your email"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Password Field */}
            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground font-medium">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Create a password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Confirm Password Field */}
            <div className="space-y-2">
              <Label htmlFor="confirmPassword" className="text-foreground font-medium">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  className="pl-10 pr-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                  placeholder="Confirm your password"
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input 
                type="checkbox" 
                id="terms" 
                className="mt-1 rounded border-glass-border" 
                checked={formData.agreedToTerms}
                onChange={(e) => handleInputChange('agreedToTerms', e.target.checked)}
                disabled={isLoading}
              />
              <label htmlFor="terms" className="text-sm text-muted-foreground cursor-pointer">
                I agree to the{' '}
                <Link to="/terms" className="text-primary hover:text-primary/80">Terms of Service</Link>
                {' '}and{' '}
                <Link to="/privacy" className="text-primary hover:text-primary/80">Privacy Policy</Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </Button>
          </form>

          {/* Sign In Link */}
          <div className="text-center mt-6">
            <span className="text-muted-foreground">Already have an account? </span>
            <Link to="/login" className="text-primary hover:text-primary/80 font-medium transition-colors">
              Sign in
            </Link>
          </div>
        </GlassCard>
      </motion.div>
    </div>
  );
}