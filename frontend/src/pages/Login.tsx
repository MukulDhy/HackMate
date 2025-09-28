import { motion } from 'framer-motion';
import { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GlassCard } from '@/components/ui/glass-card';
import { BackgroundScene } from '@/components/3d/background-scene';
import { Eye, EyeOff, Mail, Lock, Github, Chrome, Loader2 } from 'lucide-react';
import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from "../config/firebase";
import { API_URL } from "../config/API_URL";
import axios from "axios";
import { showError, showSuccess } from '@/components/ui/ToasterMsg';
import { googleAuth, loginUser } from '@/store/slices/authSlice';
import { useAppDispatch, useUser } from '@/hooks/authHook';

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

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });

  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleInputChange = useCallback((field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  }, []);

  const validateForm = () => {
    if (formData.email.trim() === "") {
      showError("Email Can't Be Blank", "Validation", 3000);
      return false;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      showError("Please enter a valid email address", "Validation", 3000);
      return false;
    }

    if (formData.password.length < 6) {
      showError("Password must be at least 6 characters", "Validation", 3000);
      return false;
    }

    return true;
  };

const {user} = useUser();
useEffect(() => {
  if(user){
    navigate("/");
  }
},[user,navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const result = await dispatch(loginUser(formData));
      
      if (loginUser.fulfilled.match(result)) {
        showSuccess("Login successful!", "Success", 3000);
        navigate("/dashboard");
      } else if (loginUser.rejected.match(result)) {
        const errorPayload = result.payload;
        showError(getErrorMessage(errorPayload), "Error", 6000);
      }
    } catch (error) {
      showError("An unexpected error occurred", "Error", 6000);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    try {
      const result = await loginWithGoogle();
      console.log("Google Login Result:", result);
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
      console.log("MUKKKKK1111");
      console.log({ email: result.user.email, displayName: result.user.displayName, photoURL: result.user.photoURL, email_verified: true })
      const resultGoogle = await dispatch(googleAuth({ email: result.user.email, displayName: result.user.displayName, photoURL: result.user.photoURL, email_verified: true }));
      // Store the token from your backend
      console.log("MUKKKKK2221");
      // if (resultGoogle.data.token) {
        //   localStorage.setItem('token', resultGoogle.data.token);
        //   showSuccess("Successfully logged in with Google", "Auth", 3000);
        //   navigate("/dashboard");
        // }
        console.log(resultGoogle);
        if (googleAuth.fulfilled.match(resultGoogle)) {
          showSuccess("Login successful!", "Success", 3000);
          console.log("MUKKKKK3333");
          navigate("/dashboard");
        } else if (googleAuth.rejected.match(resultGoogle)) {
        console.log("MUKKKKK35553");
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

  const handleGoogleSuccess = async (credentialResponse: any) => {
    setIsGoogleLoading(true);
    try {
      // Send the credential to your backend for verification
      const response = await axios.post(`${API_URL}/api/user/google-auth`, {
        credential: credentialResponse.credential
      }, {
        headers: { "Content-Type": "application/json" }
      });

      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        showSuccess("Successfully logged in with Google", "Auth", 3000);
        navigate("/dashboard");
      }
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      showError("Google authentication failed", "Error", 5000);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  const handleGoogleError = () => {
    showError("Google login failed", "Error", 5000);
  };

  return (
    <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID || "YOUR_GOOGLE_CLIENT_ID"}>
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
                Welcome Back
              </h1>
              <p className="text-muted-foreground">
                Sign in to continue your hackathon journey
              </p>
            </div>

            {/* Social Login */}
            <div className="space-y-3 mb-6">
              {/* <Button 
                variant="ghost" 
                className="w-full h-12 border border-glass-border hover:bg-primary/10"
                disabled={isLoading || isGoogleLoading}
              >
                <Github className="w-5 h-5 mr-3" />
                Continue with GitHub
              </Button> */}
              
              {/* <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={handleGoogleError}
                useOneTap
                theme="filled_black"
                shape="rectangular"
                size="large"
                text="continue_with"
                locale="en"
              /> */}
              
              {/* Alternative Google login button */}
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

            {/* Login Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className="pl-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                    placeholder="Enter your email"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={formData.password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className="pl-10 pr-10 h-12 bg-background/50 border-glass-border focus:border-primary focus:ring-primary/20"
                    placeholder="Enter your password"
                    required
                    disabled={isLoading || isGoogleLoading}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8"
                    disabled={isLoading || isGoogleLoading}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </Button>
                </div>
              </div>

              {/* Remember Me & Forgot Password */}
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input 
                    type="checkbox" 
                    className="rounded border-glass-border" 
                    disabled={isLoading || isGoogleLoading}
                  />
                  <span className="text-sm text-muted-foreground">Remember me</span>
                </label>
                <Link 
                  to="/forgot-password" 
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </Link>
              </div>

              {/* Submit Button */}
              <Button 
                type="submit" 
                className="w-full h-12 bg-gradient-primary hover:shadow-glow transition-all duration-300"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing In...
                  </>
                ) : (
                  'Sign In'
                )}
              </Button>
            </form>

            {/* Sign Up Link */}
            <div className="text-center mt-6">
              <span className="text-muted-foreground">Don't have an account? </span>
              <Link 
                to="/signup" 
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                Sign up
              </Link>
            </div>
          </GlassCard>
        </motion.div>
      </div>
    </GoogleOAuthProvider>
  );
}