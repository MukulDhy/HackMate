import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { api } from '@/service/api';
import axios from 'axios';
import { API_URL } from '@/config/API_URL';

interface ForgotPasswordData {
  email: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}

const ForgotPasswordPage: React.FC = () => {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [formData, setFormData] = useState<ForgotPasswordData>({
    email: '',
    otp: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [countdown, setCountdown] = useState(0);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Countdown timer for OTP resend
  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear errors when user starts typing
    if (error) setError('');
  };

  const validateEmail = (email: string): boolean => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const generateOTP = (): string => {
    return Math.floor(100000 + Math.random() * 900000).toString();
  };

  const handleSendOTP = async () => {
    if (!validateEmail(formData.email)) {
      setError('Please enter a valid email address');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate API call
    //   await new Promise(resolve => setTimeout(resolve, 1500));
    await axios.post(`${API_URL}/api/user/forgot-password`, { email: formData.email });
      // Generate and "send" OTP (in real app, this would go to your backend)
      setOtpSent(true);
      setCountdown(120); // 60 seconds countdown
      setSuccess('OTP has been sent to your email address');
      
      // Auto-advance to step 2 after a delay
      setTimeout(() => {
        setStep(2);
        setSuccess('');
      }, 2000);

    } catch (err) {
      setError('Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (formData.otp.length !== 6) {
      setError('Please enter a valid 6-digit OTP');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate OTP verification
    //    await axios.post(`${API_URL}/auth/forgot-password`, { email: formData.email });
        await axios.post(`${API_URL}/api/user/verify-otp`, { email: formData.email, otp: formData.otp });
      
      // In a real app, you'd verify the OTP with your backend
      setSuccess('OTP verified successfully!');
      
      // Auto-advance to step 3
      setTimeout(() => {
        setStep(3);
        setSuccess('');
      }, 1500);

    } catch (err) {
      setError('Invalid OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (formData.newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Simulate password reset API call
    //   await new Promise(resolve => setTimeout(resolve, 2000));
      await axios.post(`${API_URL}/api/user/reset-password`, { 
        email: formData.email, 
        otp: formData.otp, 
        newPassword: formData.newPassword 
      });
      setSuccess('Password reset successfully! Redirecting to login...');
      
      // Redirect to login after success
      setTimeout(() => {
        // In a real app, you'd redirect to login page
        window.location.href = '/login';
      }, 2000);

    } catch (err) {
      setError('Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (countdown > 0) return;

    setLoading(true);
    setError('');

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newOtp = generateOTP();
      console.log('New OTP:', newOtp); // For testing
      
      setCountdown(60);
      setSuccess('New OTP has been sent to your email');
      setTimeout(() => setSuccess(''), 3000);

    } catch (err) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Password visibility toggle icons with cyberpunk style
  const PasswordVisibilityToggle: React.FC<{ 
    isVisible: boolean; 
    onToggle: () => void;
    disabled?: boolean;
  }> = ({ isVisible, onToggle, disabled = false }) => (
    <button
      type="button"
      onClick={onToggle}
      disabled={disabled}
      className="absolute right-4 top-[52px] transform -translate-y-1/2 text-muted-foreground hover:text-primary transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isVisible ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
        </svg>
      )}
    </button>
  );

  const StepIndicator: React.FC<{ currentStep: number }> = ({ currentStep }) => (
    <div className="flex justify-center mb-8">
      <div className="flex items-center space-x-4">
        {[1, 2, 3].map((stepNum) => (
          <React.Fragment key={stepNum}>
            <div className="flex flex-col items-center">
              <div className={`
                w-12 h-12 rounded-full border-2 flex items-center justify-center
                transition-all duration-300 font-orbitron font-bold
                ${currentStep === stepNum 
                  ? 'bg-primary text-primary-foreground border-primary neon-glow' 
                  : currentStep > stepNum 
                    ? 'bg-success text-success-foreground border-success' 
                    : 'bg-muted text-muted-foreground border-border'
                }
              `}>
                {currentStep > stepNum ? '✓' : stepNum}
              </div>
              <span className="text-sm mt-2 text-muted-foreground">
                {stepNum === 1 ? 'Enter Email' : stepNum === 2 ? 'Verify OTP' : 'New Password'}
              </span>
            </div>
            {stepNum < 3 && (
              <div className={`
                w-16 h-1 transition-all duration-300
                ${currentStep > stepNum ? 'bg-success' : 'bg-border'}
              `} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background animated-bg flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md"
      >
        {/* Header */}
        <div className="text-center mb-8">
          <motion.h1 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-3xl font-orbitron font-bold mb-2 bg-gradient-primary bg-clip-text text-transparent"
          >
            HACKMATE
          </motion.h1>
          <p className="text-muted-foreground">Reset your password securely</p>
        </div>

        {/* Progress Indicator */}
        <StepIndicator currentStep={step} />

        {/* Card */}
        <div className="glass-card p-8 rounded-2xl shadow-strong">
          <AnimatePresence mode="wait">
            {/* Step 1: Enter Email */}
            {step === 1 && (
              <motion.div
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="email" className="block text-sm font-medium mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="enter your email"
                    disabled={loading}
                  />
                </div>

                <button
                  onClick={handleSendOTP}
                  disabled={loading || !formData.email}
                  className="w-full py-3 bg-gradient-primary text-primary-foreground font-orbitron font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-hover"
                >
                  {loading ? (
                    <div className="flex items-center justify-center">
                      <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                      Sending OTP...
                    </div>
                  ) : (
                    'Send Verification Code'
                  )}
                </button>
              </motion.div>
            )}

            {/* Step 2: Verify OTP */}
            {step === 2 && (
              <motion.div
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div>
                  <label htmlFor="otp" className="block text-sm font-medium mb-2">
                    Enter 6-digit OTP
                  </label>
                  <input
                    type="text"
                    id="otp"
                    name="otp"
                    value={formData.otp}
                    onChange={handleInputChange}
                    maxLength={6}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent text-center text-2xl font-mono tracking-widest"
                    placeholder="••••••"
                    disabled={loading}
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-muted-foreground">
                      Sent to: {formData.email}
                    </span>
                    <button
                      type="button"
                      onClick={handleResendOTP}
                      disabled={countdown > 0 || loading}
                      className="text-sm text-primary hover:text-primary/80 disabled:text-muted-foreground disabled:cursor-not-allowed"
                    >
                      {countdown > 0 ? `Resend in ${countdown}s` : 'Resend OTP'}
                    </button>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 py-3 bg-muted text-muted-foreground font-orbitron font-bold rounded-lg transition-all hover:bg-muted/80"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleVerifyOTP}
                    disabled={loading || formData.otp.length !== 6}
                    className="flex-1 py-3 bg-gradient-primary text-primary-foreground font-orbitron font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-hover"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Verifying...
                      </div>
                    ) : (
                      'Verify OTP'
                    )}
                  </button>
                </div>
              </motion.div>
            )}

            {/* Step 3: Reset Password */}
            {step === 3 && (
              <motion.div
                key="step3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="relative">
                  <label htmlFor="newPassword" className="block text-sm font-medium mb-2">
                    New Password
                  </label>
                  <input
                    type={showNewPassword ? "text" : "password"}
                    id="newPassword"
                    name="newPassword"
                    value={formData.newPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Enter new password"
                    disabled={loading}
                  />
                  <PasswordVisibilityToggle
                    isVisible={showNewPassword}
                    onToggle={() => setShowNewPassword(!showNewPassword)}
                    disabled={loading}
                  />
                </div>

                <div className="relative">
                  <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
                    Confirm New Password
                  </label>
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    id="confirmPassword"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 pr-12 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Confirm new password"
                    disabled={loading}
                  />
                  <PasswordVisibilityToggle
                    isVisible={showConfirmPassword}
                    onToggle={() => setShowConfirmPassword(!showConfirmPassword)}
                    disabled={loading}
                  />
                </div>

                {/* Password strength indicator */}
                {formData.newPassword && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Password strength:</span>
                      <span className={`
                        font-medium
                        ${formData.newPassword.length >= 8 ? 'text-success' : 'text-warning'}
                      `}>
                        {formData.newPassword.length >= 8 ? 'Strong' : 'Weak'}
                      </span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div 
                        className={`
                          h-2 rounded-full transition-all duration-300
                          ${formData.newPassword.length >= 12 ? 'bg-success' : 
                            formData.newPassword.length >= 8 ? 'bg-warning' : 'bg-destructive'
                          }
                        `}
                        style={{ width: `${Math.min((formData.newPassword.length / 12) * 100, 100)}%` }}
                      />
                    </div>
                  </div>
                )}

                <div className="flex space-x-4">
                  <button
                    onClick={() => setStep(2)}
                    className="flex-1 py-3 bg-muted text-muted-foreground font-orbitron font-bold rounded-lg transition-all hover:bg-muted/80"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleResetPassword}
                    disabled={loading || !formData.newPassword || !formData.confirmPassword}
                    className="flex-1 py-3 bg-gradient-primary text-primary-foreground font-orbitron font-bold rounded-lg transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed neon-glow-hover"
                  >
                    {loading ? (
                      <div className="flex items-center justify-center">
                        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mr-2" />
                        Resetting...
                      </div>
                    ) : (
                      'Reset Password'
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Status Messages */}
          <AnimatePresence>
            {error && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-destructive/20 border border-destructive rounded-lg text-destructive text-sm"
              >
                ⚠️ {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="mt-4 p-3 bg-success/20 border border-success rounded-lg text-success text-sm"
              >
                ✅ {success}
              </motion.div>
            )}
          </AnimatePresence>

        </div>

        {/* Back to Login */}
        <div className="text-center mt-6">
          <button
            onClick={() => window.location.href = '/login'}
            className="text-primary hover:text-primary/80 transition-colors text-sm"
          >
            ← Back to Login
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPasswordPage;