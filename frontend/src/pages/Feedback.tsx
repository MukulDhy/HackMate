import React, { useState } from 'react';
import { Star, Send, ThumbsUp, MessageCircle, AlertCircle, CheckCircle } from 'lucide-react';

interface FeedbackFormData {
  name: string;
  email: string;
  hackathonExperience: number;
  organizationRating: number;
  venueRating: number;
  foodRating: number;
  overallRating: number;
  category: 'general' | 'technical' | 'logistical' | 'suggestion' | 'complaint';
  message: string;
  wouldRecommend: boolean | null;
  allowContact: boolean;
}

const FeedbackForm: React.FC = () => {
  const [formData, setFormData] = useState<FeedbackFormData>({
    name: '',
    email: '',
    hackathonExperience: 0,
    organizationRating: 0,
    venueRating: 0,
    foodRating: 0,
    overallRating: 0,
    category: 'general',
    message: '',
    wouldRecommend: null,
    allowContact: false,
  });

  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errors, setErrors] = useState<Partial<FeedbackFormData>>({});

  const categories = [
    { value: 'general', label: 'General Feedback', icon: MessageCircle },
    { value: 'technical', label: 'Technical Issues', icon: AlertCircle },
    { value: 'logistical', label: 'Logistics', icon: ThumbsUp },
    { value: 'suggestion', label: 'Suggestions', icon: CheckCircle },
    { value: 'complaint', label: 'Complaints', icon: AlertCircle },
  ];

  const validateStep = (step: number): boolean => {
    const newErrors: Partial<FeedbackFormData> = {};

    if (step === 1) {
      if (!formData.name.trim()) newErrors.name = 'Name is required';
      if (!formData.email.trim()) {
        newErrors.email = 'Email is required';
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = 'Email is invalid';
      }
    }

    if (step === 2) {
      if (formData.overallRating === 0) newErrors.overallRating = 'Overall rating is required';
      if (formData.hackathonExperience === 0) newErrors.hackathonExperience = 'Experience rating is required';
    }

    if (step === 3) {
      if (!formData.message.trim()) newErrors.message = 'Message is required';
      if (formData.wouldRecommend === null) newErrors.wouldRecommend = 'This field is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleRatingChange = (name: keyof FeedbackFormData, value: number) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateStep(currentStep)) {
      setIsSubmitting(true);
      
      // Simulate API call
      try {
        await new Promise(resolve => setTimeout(resolve, 2000));
        console.log('Feedback submitted:', formData);
        setIsSubmitted(true);
      } catch (error) {
        console.error('Error submitting feedback:', error);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const StarRating: React.FC<{
    rating: number;
    onChange: (rating: number) => void;
    label: string;
    error?: string;
  }> = ({ rating, onChange, label, error }) => (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground/80">{label}</label>
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="transition-all duration-200 hover:scale-110"
          >
            <Star
              className={`w-8 h-8 ${
                star <= rating
                  ? 'fill-yellow-400 text-yellow-400 drop-shadow-glow'
                  : 'text-gray-400'
              }`}
            />
          </button>
        ))}
      </div>
      {error && <p className="text-red-400 text-sm">{error}</p>}
    </div>
  );

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl mx-auto">
          <div className="glass-card p-8 text-center">
            <div className="w-20 h-20 mx-auto mb-6 bg-green-500/20 rounded-full flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-400" />
            </div>
            <h2 className="text-3xl font-orbitron font-bold text-green-400 mb-4">
              Thank You for Your Feedback!
            </h2>
            <p className="text-foreground/80 mb-6">
              Your feedback has been successfully submitted. We appreciate you taking the time to help us improve HackForce.
            </p>
            <button
              onClick={() => {
                setIsSubmitted(false);
                setCurrentStep(1);
                setFormData({
                  name: '',
                  email: '',
                  hackathonExperience: 0,
                  organizationRating: 0,
                  venueRating: 0,
                  foodRating: 0,
                  overallRating: 0,
                  category: 'general',
                  message: '',
                  wouldRecommend: null,
                  allowContact: false,
                });
              }}
              className="bg-gradient-primary text-primary-foreground px-6 py-3 rounded-lg font-orbitron font-bold hover:scale-105 transition-transform duration-200"
            >
              Submit Another Feedback
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-hero py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl md:text-5xl font-orbitron font-bold mb-4 bg-gradient-primary bg-clip-text text-transparent">
            HackForce Feedback
          </h1>
          <p className="text-foreground/80 text-lg">
            Help us make HackForce better! Share your experience with us.
          </p>
        </div>

        {/* Progress Bar */}
        <div className="glass-card p-6 mb-8">
          <div className="flex items-center justify-between mb-4">
            {[1, 2, 3].map(step => (
              <div key={step} className="flex items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-orbitron font-bold border-2 ${
                    step <= currentStep
                      ? 'bg-primary text-primary-foreground border-primary'
                      : 'bg-background-secondary border-border'
                  }`}
                >
                  {step}
                </div>
                {step < 3 && (
                  <div
                    className={`w-20 h-1 mx-4 ${
                      step < currentStep ? 'bg-primary' : 'bg-border'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
          <div className="flex justify-between text-sm text-foreground/80">
            <span>Personal Info</span>
            <span>Ratings</span>
            <span>Feedback</span>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="glass-card p-8">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-orbitron font-bold text-primary mb-6">
                Personal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="Enter your full name"
                  />
                  {errors.name && (
                    <p className="text-red-400 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground/80 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200"
                    placeholder="your.email@example.com"
                  />
                  {errors.email && (
                    <p className="text-red-400 text-sm mt-1">{errors.email}</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Feedback Category
                </label>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                  {categories.map(category => {
                    const IconComponent = category.icon;
                    return (
                      <button
                        key={category.value}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, category: category.value as any }))}
                        className={`p-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.category === category.value
                            ? 'border-primary bg-primary/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5 mx-auto mb-1" />
                        <span className="text-xs">{category.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Ratings */}
          {currentStep === 2 && (
            <div className="space-y-8">
              <h2 className="text-2xl font-orbitron font-bold text-primary mb-6">
                Rate Your Experience
              </h2>
              
              <StarRating
                rating={formData.overallRating}
                onChange={(rating) => handleRatingChange('overallRating', rating)}
                label="Overall Hackathon Experience *"
                error={errors.overallRating}
              />

              <div className="grid md:grid-cols-2 gap-8">
                <StarRating
                  rating={formData.hackathonExperience}
                  onChange={(rating) => handleRatingChange('hackathonExperience', rating)}
                  label="Hackathon Organization *"
                  error={errors.hackathonExperience}
                />

                <StarRating
                  rating={formData.organizationRating}
                  onChange={(rating) => handleRatingChange('organizationRating', rating)}
                  label="Event Organization"
                />

                <StarRating
                  rating={formData.venueRating}
                  onChange={(rating) => handleRatingChange('venueRating', rating)}
                  label="Venue & Facilities"
                />

                <StarRating
                  rating={formData.foodRating}
                  onChange={(rating) => handleRatingChange('foodRating', rating)}
                  label="Food & Refreshments"
                />
              </div>
            </div>
          )}

          {/* Step 3: Detailed Feedback */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h2 className="text-2xl font-orbitron font-bold text-primary mb-6">
                Share Your Thoughts
              </h2>
              
              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-2">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={6}
                  className="w-full px-4 py-3 bg-input border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary transition-all duration-200 resize-none"
                  placeholder="Tell us about your experience, what you liked, what we can improve..."
                />
                {errors.message && (
                  <p className="text-red-400 text-sm mt-1">{errors.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground/80 mb-3">
                  Would you recommend HackForce to others? *
                </label>
                <div className="flex space-x-4">
                  {[
                    { value: true, label: 'Yes', icon: ThumbsUp },
                    { value: false, label: 'No', icon: AlertCircle },
                  ].map(option => {
                    const IconComponent = option.icon;
                    return (
                      <button
                        key={option.label}
                        type="button"
                        onClick={() => setFormData(prev => ({ ...prev, wouldRecommend: option.value }))}
                        className={`flex items-center space-x-2 px-6 py-3 rounded-lg border-2 transition-all duration-200 ${
                          formData.wouldRecommend === option.value
                            ? option.value
                              ? 'border-green-400 bg-green-400/20'
                              : 'border-red-400 bg-red-400/20'
                            : 'border-border hover:border-primary/50'
                        }`}
                      >
                        <IconComponent className="w-5 h-5" />
                        <span>{option.label}</span>
                      </button>
                    );
                  })}
                </div>
                {errors.wouldRecommend && (
                  <p className="text-red-400 text-sm mt-1">{errors.wouldRecommend}</p>
                )}
              </div>

              <label className="flex items-center space-x-3">
                <input
                  type="checkbox"
                  name="allowContact"
                  checked={formData.allowContact}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary bg-input border-border rounded focus:ring-primary"
                />
                <span className="text-sm text-foreground/80">
                  I'm open to being contacted for follow-up questions about my feedback
                </span>
              </label>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t border-border">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={prevStep}
                className="px-6 py-3 border-2 border-border rounded-lg hover:border-primary/50 transition-all duration-200 font-orbitron"
              >
                Previous
              </button>
            ) : (
              <div></div>
            )}

            {currentStep < 3 ? (
              <button
                type="button"
                onClick={nextStep}
                className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-orbitron font-bold hover:scale-105 transition-transform duration-200"
              >
                Next Step
              </button>
            ) : (
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-3 bg-gradient-primary text-primary-foreground rounded-lg font-orbitron font-bold hover:scale-105 transition-transform duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <Send className="w-5 h-5" />
                    <span>Submit Feedback</span>
                  </>
                )}
              </button>
            )}
          </div>
        </form>

        {/* Additional Info */}
        <div className="glass-card p-6 mt-6 text-center">
          <p className="text-foreground/60 text-sm">
            Your feedback helps us create better hackathon experiences. We read every submission and use your insights to improve.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FeedbackForm;