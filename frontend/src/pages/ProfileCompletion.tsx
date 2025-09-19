import { BackgroundScene } from '@/components/3d/background-scene';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { updateProfile } from '@/slices/profileSlice';
import { motion } from 'framer-motion';
import {
    AlertCircle,
    Award,
    Briefcase,
    Check,
    CheckCircle,
    Circle,
    FileText,
    Globe,
    GraduationCap,
    LucideIcon,
    Sparkles,
    Upload,
    User,
} from 'lucide-react';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';

interface CompletionItem {
    id: string;
    title: string;
    description: string;
    icon: LucideIcon;
    completed: boolean;
    required: boolean;
    weight: number;
}

interface ResumeData {
    name?: string;
    email?: string;
    phone?: string;
    location?: string;
    title?: string;
    bio?: string;
    skills?: string[];
    experience?: Array<{
        company: string;
        position: string;
        duration: string;
        description: string;
    }>;
    education?: Array<{
        institution: string;
        degree: string;
        year: string;
    }>;
}

export default function ProfileCompletion() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const { profile } = useAppSelector((state) => state.profile);

    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [extractedData, setExtractedData] = useState<ResumeData | null>(null);
    const [showExtractedData, setShowExtractedData] = useState(false);

    // Calculate completion items based on current profile
    const getCompletionItems = (): CompletionItem[] => [
        {
            id: 'basic-info',
            title: 'Basic Information',
            description: 'Name, email, and profile picture',
            icon: User,
            completed: !!(profile?.name && profile?.email && profile?.avatar),
            required: true,
            weight: 20,
        },
        {
            id: 'professional',
            title: 'Professional Details',
            description: 'Job title, bio, and location',
            icon: Briefcase,
            completed: !!(profile?.title && profile?.bio && profile?.location),
            required: true,
            weight: 25,
        },
        {
            id: 'skills',
            title: 'Skills & Expertise',
            description: 'Technical and soft skills',
            icon: Award,
            completed: !!(profile?.skills && profile?.skills.length >= 3),
            required: true,
            weight: 20,
        },
        {
            id: 'social',
            title: 'Social Links',
            description: 'GitHub, LinkedIn, and portfolio',
            icon: Globe,
            completed: !!(
                profile?.github ||
                profile?.linkedin ||
                profile?.website
            ),
            required: false,
            weight: 15,
        },
        {
            id: 'experience',
            title: 'Work Experience',
            description: 'Professional background and achievements',
            icon: GraduationCap,
            completed: !!(
                profile?.stats?.hackathonsJoined &&
                profile?.stats?.hackathonsJoined > 0
            ),
            required: false,
            weight: 10,
        },
        {
            id: 'resume',
            title: 'Resume Upload',
            description: 'Upload your resume for auto-completion',
            icon: FileText,
            completed: false, // We'll track this separately
            required: false,
            weight: 10,
        },
    ];

    const completionItems = getCompletionItems();
    const totalWeight = completionItems.reduce(
        (sum, item) => sum + item.weight,
        0,
    );
    const completedWeight = completionItems
        .filter((item) => item.completed)
        .reduce((sum, item) => sum + item.weight, 0);
    const completionPercentage = Math.round(
        (completedWeight / totalWeight) * 100,
    );

    // Mock resume parsing function - in real app, this would call an AI service
    const parseResume = (file: File): Promise<ResumeData> => {
        return new Promise((resolve) => {
            setTimeout(() => {
                // Mock extracted data - in reality, this would come from resume parsing AI
                const mockData: ResumeData = {
                    name: 'John Smith',
                    email: 'john.smith@email.com',
                    phone: '+1 (555) 123-4567',
                    location: 'San Francisco, CA',
                    title: 'Senior Full Stack Developer',
                    bio: 'Experienced software engineer with 5+ years in web development, specializing in React, Node.js, and cloud technologies. Passionate about building scalable applications and mentoring junior developers.',
                    skills: [
                        'React',
                        'Node.js',
                        'TypeScript',
                        'Python',
                        'AWS',
                        'Docker',
                        'MongoDB',
                        'GraphQL',
                    ],
                    experience: [
                        {
                            company: 'TechCorp Inc.',
                            position: 'Senior Software Engineer',
                            duration: '2022 - Present',
                            description:
                                'Led development of microservices architecture serving 1M+ users',
                        },
                        {
                            company: 'StartupXYZ',
                            position: 'Full Stack Developer',
                            duration: '2020 - 2022',
                            description:
                                'Built entire web platform from scratch using React and Node.js',
                        },
                    ],
                    education: [
                        {
                            institution: 'Stanford University',
                            degree: 'BS Computer Science',
                            year: '2020',
                        },
                    ],
                };
                resolve(mockData);
            }, 2000);
        });
    };

    const handleResumeUpload = useCallback(
        async (event: React.ChangeEvent<HTMLInputElement>) => {
            const file = event.target.files?.[0];
            if (!file) return;

            // File validation
            const maxSize = 10 * 1024 * 1024; // 10MB
            const allowedTypes = [
                'application/pdf',
                'application/msword',
                'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            ];

            if (file.size > maxSize) {
                alert('File size must be less than 10MB');
                return;
            }

            if (!allowedTypes.includes(file.type)) {
                alert('Please upload a PDF, DOC, or DOCX file');
                return;
            }

            setIsUploading(true);
            setUploadProgress(0);

            // Simulate upload progress
            const progressInterval = setInterval(() => {
                setUploadProgress((prev) => {
                    if (prev >= 90) {
                        clearInterval(progressInterval);
                        return 90;
                    }
                    return prev + 10;
                });
            }, 200);

            try {
                const data = await parseResume(file);
                setExtractedData(data);
                setUploadProgress(100);
                setShowExtractedData(true);
            } catch (error) {
                console.error('Resume parsing failed:', error);
            } finally {
                setIsUploading(false);
                clearInterval(progressInterval);
            }
        },
        [],
    );

    const applyExtractedData = () => {
        if (!extractedData) return;

        // Validate extracted data before applying
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const phoneRegex = /^[+]?[1-9]\d{0,15}$/;

        if (extractedData.email && !emailRegex.test(extractedData.email)) {
            alert(
                'Invalid email format detected in resume. Please review and edit manually.',
            );
            return;
        }

        if (
            extractedData.phone &&
            !phoneRegex.test(extractedData.phone.replace(/[\s\-()]/g, ''))
        ) {
            alert(
                'Invalid phone format detected in resume. Please review and edit manually.',
            );
            return;
        }

        if (extractedData.name && extractedData.name.length < 2) {
            alert('Name too short. Please review extracted data.');
            return;
        }

        dispatch(
            updateProfile({
                name: extractedData.name || profile?.name,
                email: extractedData.email || profile?.email,
                phone: extractedData.phone || profile?.phone,
                location: extractedData.location || profile?.location,
                title: extractedData.title || profile?.title,
                bio: extractedData.bio || profile?.bio,
                github: profile?.github, // Keep existing social links
                linkedin: profile?.linkedin,
                website: extractedData.name
                    ? `https://${extractedData.name
                          .toLowerCase()
                          .replace(' ', '')}.dev`
                    : profile?.website,
            }),
        );

        // In a real app, you'd also update skills and experience in separate actions
        setShowExtractedData(false);
        setExtractedData(null);
    };

    const requiredItems = completionItems.filter((item) => item.required);
    const allRequiredCompleted = requiredItems.every((item) => item.completed);

    return (
        <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
            <BackgroundScene className="absolute inset-0 w-full h-full" />

            <div className="relative max-w-5xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="text-4xl font-orbitron font-bold text-foreground mb-4">
                        Complete Your Profile
                    </h1>
                    <p className="text-muted-foreground text-lg">
                        Boost your hackathon success with a complete profile
                    </p>
                </motion.div>

                {/* Progress Overview */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="mb-8"
                >
                    <GlassCard variant="glow" className="p-6">
                        <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                                <Sparkles className="w-6 h-6 text-primary" />
                                <h2 className="text-2xl font-semibold">
                                    Profile Completion
                                </h2>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold text-primary">
                                    {completionPercentage}%
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    Complete
                                </div>
                            </div>
                        </div>

                        <Progress
                            value={completionPercentage}
                            className="h-3 mb-4"
                        />

                        <div className="flex flex-wrap gap-2">
                            {allRequiredCompleted ? (
                                <Badge
                                    variant="default"
                                    className="bg-green-500/20 text-green-400 border-green-500/30"
                                >
                                    <CheckCircle className="w-3 h-3 mr-1" />
                                    Ready for Hackathons!
                                </Badge>
                            ) : (
                                <Badge
                                    variant="secondary"
                                    className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
                                >
                                    <AlertCircle className="w-3 h-3 mr-1" />
                                    Complete required fields
                                </Badge>
                            )}
                            <Badge variant="outline">
                                {
                                    completionItems.filter(
                                        (item) => item.completed,
                                    ).length
                                }{' '}
                                of {completionItems.length} completed
                            </Badge>
                        </div>
                    </GlassCard>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Completion Checklist */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <GlassCard className="p-6">
                            <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-primary" />
                                Completion Checklist
                            </h3>

                            <div className="space-y-4">
                                {completionItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{
                                            delay: 0.3 + index * 0.1,
                                        }}
                                        className={`flex items-start gap-4 p-4 rounded-lg border transition-all duration-300 ${
                                            item.completed
                                                ? 'border-green-500/30 bg-green-500/10'
                                                : item.required
                                                ? 'border-yellow-500/30 bg-yellow-500/5'
                                                : 'border-glass-border bg-background/30'
                                        }`}
                                    >
                                        <div
                                            className={`p-2 rounded-lg ${
                                                item.completed
                                                    ? 'bg-green-500/20'
                                                    : 'bg-primary/20'
                                            }`}
                                        >
                                            <item.icon
                                                className={`w-5 h-5 ${
                                                    item.completed
                                                        ? 'text-green-400'
                                                        : 'text-primary'
                                                }`}
                                            />
                                        </div>

                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-medium text-foreground">
                                                    {item.title}
                                                </h4>
                                                {item.required && (
                                                    <Badge
                                                        variant="outline"
                                                        className="text-xs"
                                                    >
                                                        Required
                                                    </Badge>
                                                )}
                                                <div className="ml-auto">
                                                    {item.completed ? (
                                                        <Check className="w-4 h-4 text-green-400" />
                                                    ) : (
                                                        <Circle className="w-4 h-4 text-muted-foreground" />
                                                    )}
                                                </div>
                                            </div>
                                            <p className="text-sm text-muted-foreground">
                                                {item.description}
                                            </p>
                                            <div className="mt-2">
                                                <div className="text-xs text-primary">
                                                    {item.weight}% of total
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        </GlassCard>
                    </motion.div>

                    {/* Resume Upload & Quick Actions */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Resume Upload */}
                        <GlassCard className="p-6">
                            <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                                <Upload className="w-5 h-5 text-primary" />
                                Smart Resume Upload
                            </h3>

                            <div className="space-y-4">
                                <p className="text-muted-foreground text-sm">
                                    Upload your resume and we'll automatically
                                    extract your information to complete your
                                    profile.
                                </p>

                                <div className="border-2 border-dashed border-glass-border rounded-lg p-6 text-center hover:border-primary/50 transition-colors">
                                    <FileText className="w-12 h-12 text-primary mx-auto mb-4" />
                                    <Label
                                        htmlFor="resume-upload"
                                        className="cursor-pointer"
                                    >
                                        <Button
                                            variant="hero"
                                            disabled={isUploading}
                                        >
                                            {isUploading
                                                ? 'Processing...'
                                                : 'Upload Resume'}
                                        </Button>
                                        <Input
                                            id="resume-upload"
                                            type="file"
                                            accept=".pdf,.doc,.docx"
                                            className="hidden"
                                            onChange={handleResumeUpload}
                                            disabled={isUploading}
                                        />
                                    </Label>
                                    <p className="text-xs text-muted-foreground mt-2">
                                        Supports PDF, DOC, DOCX files
                                    </p>
                                </div>

                                {isUploading && (
                                    <div className="space-y-2">
                                        <Progress
                                            value={uploadProgress}
                                            className="h-2"
                                        />
                                        <p className="text-sm text-muted-foreground text-center">
                                            {uploadProgress < 90
                                                ? 'Uploading...'
                                                : 'Analyzing resume...'}
                                        </p>
                                    </div>
                                )}
                            </div>
                        </GlassCard>

                        {/* Extracted Data Preview */}
                        {showExtractedData && extractedData && (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                            >
                                <GlassCard className="p-6 border-green-500/30">
                                    <h3 className="text-xl font-semibold mb-4 flex items-center gap-2 text-green-400">
                                        <Sparkles className="w-5 h-5" />
                                        Extracted Information
                                    </h3>

                                    <div className="space-y-3 mb-6">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Name
                                                </Label>
                                                <p className="font-medium">
                                                    {extractedData.name}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Title
                                                </Label>
                                                <p className="font-medium">
                                                    {extractedData.title}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Email
                                                </Label>
                                                <p className="font-medium">
                                                    {extractedData.email}
                                                </p>
                                            </div>
                                            <div>
                                                <Label className="text-muted-foreground">
                                                    Location
                                                </Label>
                                                <p className="font-medium">
                                                    {extractedData.location}
                                                </p>
                                            </div>
                                        </div>

                                        <div>
                                            <Label className="text-muted-foreground">
                                                Bio
                                            </Label>
                                            <p className="text-sm mt-1">
                                                {extractedData.bio}
                                            </p>
                                        </div>

                                        <div>
                                            <Label className="text-muted-foreground">
                                                Skills
                                            </Label>
                                            <div className="flex flex-wrap gap-1 mt-1">
                                                {extractedData.skills
                                                    ?.slice(0, 6)
                                                    .map((skill, index) => (
                                                        <Badge
                                                            key={index}
                                                            variant="secondary"
                                                            className="text-xs"
                                                        >
                                                            {skill}
                                                        </Badge>
                                                    ))}
                                                {extractedData.skills &&
                                                    extractedData.skills
                                                        .length > 6 && (
                                                        <Badge
                                                            variant="outline"
                                                            className="text-xs"
                                                        >
                                                            +
                                                            {extractedData
                                                                .skills.length -
                                                                6}{' '}
                                                            more
                                                        </Badge>
                                                    )}
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex gap-3">
                                        <Button
                                            onClick={applyExtractedData}
                                            variant="hero"
                                        >
                                            Apply to Profile
                                        </Button>
                                        <Button
                                            onClick={() =>
                                                setShowExtractedData(false)
                                            }
                                            variant="ghost"
                                        >
                                            Dismiss
                                        </Button>
                                    </div>
                                </GlassCard>
                            </motion.div>
                        )}

                        {/* Quick Actions */}
                        <GlassCard className="p-6">
                            <h3 className="text-xl font-semibold mb-4">
                                Quick Actions
                            </h3>
                            <div className="space-y-3">
                                <Button
                                    variant="glass"
                                    className="w-full justify-start"
                                    onClick={() => navigate('/profile')}
                                >
                                    <User className="w-4 h-4 mr-2" />
                                    Edit Profile Details
                                </Button>
                                <Button
                                    variant="glass"
                                    className="w-full justify-start"
                                    onClick={() => navigate('/settings')}
                                >
                                    <Globe className="w-4 h-4 mr-2" />
                                    Add Social Links
                                </Button>
                                {allRequiredCompleted && (
                                    <Button
                                        variant="hero"
                                        className="w-full justify-start"
                                        onClick={() => navigate('/lobbies')}
                                    >
                                        <Sparkles className="w-4 h-4 mr-2" />
                                        Start Joining Hackathons!
                                    </Button>
                                )}
                            </div>
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
