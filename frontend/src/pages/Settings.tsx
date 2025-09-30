import { BackgroundScene } from '@/components/3d/background-scene';
import { ThemeToggle } from '@/components/theme/theme-toggle';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
    Bell,
    Eye,
    EyeOff,
    Github,
    Globe,
    Key,
    Linkedin,
    Palette,
    Save,
    Shield,
    Trash2,
    Twitter,
    Upload,
    User,
} from 'lucide-react';
import { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { updateSettings, updateProfile } from '@/slices/profileSlice';
import { setTheme } from '@/slices/uiSlice';

// Default settings data as fallback
const defaultSettingsData = {
    profile: {
        name: 'Alex Rodriguez',
        username: 'alexdev',
        email: 'alex.rodriguez@email.com',
        phone: '+1 (555) 123-4567',
        bio: 'Passionate developer with 5+ years of experience in building scalable web applications.',
        location: 'San Francisco, CA',
        website: 'https://alexdev.com',
        avatar: '/placeholder-avatar.jpg',
    },
    // notifications: {
    //     hackathonInvites: true,
    //     teamFormation: true,
    //     projectUpdates: false,
    //     achievements: true,
    //     newsletter: false,
    //     marketing: false,
    // },
    privacy: {
        // profileVisibility: 'public',
        showEmail: true,
        showPhone: true,
        // showStats: true,
        // allowDirectMessages: true,
    },
    social: {
        github: 'alexrodriguez',
        linkedin: 'alex-rodriguez-dev',
        twitter: 'alexdev_codes',
    },
};

export default function Settings() {
    const dispatch = useAppDispatch();
    
    // Get data from Redux store with fallback to defaults
    const { profile: reduxProfile, settings: reduxSettings } = useAppSelector((state) => state?.profile || {});
    const { theme } = useAppSelector((state) => state?.ui || { theme: 'light' });
    
    // Use Redux data if available, otherwise use defaults
    const profile = reduxProfile || defaultSettingsData.profile;
    const settings = reduxSettings || defaultSettingsData;
    
    const [activeTab, setActiveTab] = useState('profile');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [formData, setFormData] = useState(settings);

    const tabs = [
        { id: 'profile', label: 'Profile', icon: User },
        // { id: 'notifications', label: 'Notifications', icon: Bell },
        { id: 'privacy', label: 'Privacy & Security', icon: Shield },
        { id: 'appearance', label: 'Appearance', icon: Palette },
        { id: 'social', label: 'Social Links', icon: Globe },
    ];

    const handleSave = () => {
        // Update profile if it's the active tab
        if (activeTab === 'profile') {
            dispatch(updateProfile(formData.profile));
        } else {
            // Update settings for other tabs
            dispatch(updateSettings(formData));
        }
        console.log('Saving settings:', formData);
    };

    const renderProfileTab = () => (
        <div className="space-y-6">
            <div className="flex items-center gap-6 mb-8">
                <div className="relative">
                    <Avatar className="w-24 h-24">
                        <AvatarImage src={formData.profile.avatar} />
                        <AvatarFallback className="bg-gradient-primary text-foreground font-orbitron font-bold text-2xl">
                            {formData.profile.name
                                .split(' ')
                                .map((n) => n[0])
                                .join('')}
                        </AvatarFallback>
                    </Avatar>
                    <Button
                        variant="glass"
                        size="sm"
                        className="absolute -bottom-2 -right-2"
                    >
                        <Upload className="w-4 h-4" />
                    </Button>
                </div>
                <div>
                    <h3 className="font-orbitron font-bold text-xl text-foreground mb-2">
                        Profile Picture
                    </h3>
                    <p className="text-muted-foreground text-sm mb-4">
                        Upload a new profile picture or remove the current one
                    </p>
                    <div className="flex gap-2">
                        <Button variant="neon" size="sm">
                            Upload New
                        </Button>
                        <Button variant="ghost" size="sm">
                            <Trash2 className="w-4 h-4 mr-2" />
                            Remove
                        </Button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Full Name
                    </label>
                    <Input
                        value={formData.profile.name}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                profile: {
                                    ...formData.profile,
                                    name: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Username
                    </label>
                    <Input
                        value={formData.profile.username}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                profile: {
                                    ...formData.profile,
                                    username: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                        placeholder="@username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Email
                    </label>
                    <Input
                        type="email"
                        value={formData.profile.email}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                profile: {
                                    ...formData.profile,
                                    email: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Phone
                    </label>
                    <Input
                        value={formData.profile.phone || ''}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                profile: {
                                    ...formData.profile,
                                    phone: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Location
                    </label>
                    <Input
                        value={formData.profile.location}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                profile: {
                                    ...formData.profile,
                                    location: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                        Website
                    </label>
                    <Input
                        value={formData.profile.website}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                profile: {
                                    ...formData.profile,
                                    website: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                        placeholder="https://yourwebsite.com"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-sm font-medium text-foreground">
                    Bio
                </label>
                <Textarea
                    value={formData.profile.bio}
                    onChange={(e) =>
                        setFormData({
                            ...formData,
                            profile: {
                                ...formData.profile,
                                bio: e.target.value,
                            },
                        })
                    }
                    className="bg-background/50 border-glass-border"
                    rows={4}
                    placeholder="Tell us about yourself..."
                />
            </div>
        </div>
    );

    const renderNotificationsTab = () => (
        <div className="space-y-6">
            {Object.entries(formData.notifications).map(([key, value]) => (
                <div
                    key={key}
                    className="flex items-center justify-between p-4 rounded-lg glass"
                >
                    <div>
                        <h4 className="font-medium text-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            {key === 'hackathonInvites' &&
                                'Receive notifications when invited to hackathons'}
                            {key === 'teamFormation' &&
                                'Get notified when teams are being formed'}
                            {key === 'projectUpdates' &&
                                'Updates on your project progress and milestones'}
                            {key === 'achievements' &&
                                'Notifications for new achievements and badges'}
                            {key === 'newsletter' &&
                                'Weekly newsletter with platform updates'}
                            {key === 'marketing' &&
                                'Marketing emails and promotional content'}
                        </p>
                    </div>
                    <Switch
                        checked={value}
                        onCheckedChange={(checked) =>
                            setFormData({
                                ...formData,
                                notifications: {
                                    ...formData.notifications,
                                    [key]: checked,
                                },
                            })
                        }
                    />
                </div>
            ))}
        </div>
    );

    const renderPrivacyTab = () => (
        <div className="space-y-6">
            <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-4">
                    Privacy Settings
                </h3>
                <div className="space-y-4">
                    {Object.entries(formData.privacy).map(([key, value]) => (
                        <div
                            key={key}
                            className="flex items-center justify-between"
                        >
                            <div>
                                <h4 className="font-medium text-foreground capitalize">
                                    {key.replace(/([A-Z])/g, ' $1').trim()}
                                </h4>
                                <p className="text-sm text-muted-foreground">
                                    {/* {key === 'profileVisibility' &&
                                        'Control who can see your profile'} */}
                                    {key === 'showEmail' &&
                                        'Display email address on During your hackathons going online'}
                                    {key === 'showPhone' && 
                                        'Display phone number on During your hackathons going online'}
                                    {/* {key === 'showStats' &&
                                        'Show your statistics and achievements publicly'} */}
                                    {/* {key === 'allowDirectMessages' &&
                                        'Allow other users to send you direct messages'} */}
                                </p>
                            </div>
                            <Switch
                                checked={
                                    typeof value === 'boolean'
                                        ? value
                                        : value === 'public'
                                }
                                onCheckedChange={(checked) =>
                                    setFormData({
                                        ...formData,
                                        privacy: {
                                            ...formData.privacy,
                                            [key]:
                                                typeof value === 'boolean'
                                                    ? checked
                                                    : checked
                                                    ? 'public'
                                                    : 'private',
                                        },
                                    })
                                }
                            />
                        </div>
                    ))}
                </div>
            </GlassCard>

            <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-4">
                    Security
                </h3>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Current Password
                        </label>
                        <div className="relative">
                            <Input
                                type={isPasswordVisible ? 'text' : 'password'}
                                className="bg-background/50 border-glass-border pr-10"
                                placeholder="Enter current password"
                            />
                            <Button
                                variant="ghost"
                                size="sm"
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1"
                                onClick={() =>
                                    setIsPasswordVisible(!isPasswordVisible)
                                }
                            >
                                {isPasswordVisible ? (
                                    <EyeOff className="w-4 h-4" />
                                ) : (
                                    <Eye className="w-4 h-4" />
                                )}
                            </Button>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            New Password
                        </label>
                        <Input
                            type="password"
                            className="bg-background/50 border-glass-border"
                            placeholder="Enter new password"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">
                            Confirm New Password
                        </label>
                        <Input
                            type="password"
                            className="bg-background/50 border-glass-border"
                            placeholder="Confirm new password"
                        />
                    </div>

                    <Button variant="neon" size="sm">
                        <Key className="w-4 h-4 mr-2" />
                        Update Password
                    </Button>
                </div>
            </GlassCard>
        </div>
    );

    const renderAppearanceTab = () => (
        <div className="space-y-6">
            <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-4">
                    Theme Settings
                </h3>
                <div className="flex items-center justify-between">
                    <div>
                        <h4 className="font-medium text-foreground">
                            Dark Mode
                        </h4>
                        <p className="text-sm text-muted-foreground">
                            Toggle between light and dark themes
                        </p>
                    </div>
                    <ThemeToggle />
                </div>
            </GlassCard>

            {/* <GlassCard className="p-6">
                <h3 className="font-orbitron font-bold text-lg text-foreground mb-4">
                    Display Preferences
                </h3>
                <div className="space-y-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-foreground">
                                Animations
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Enable or disable UI animations
                            </p>
                        </div>
                        <Switch defaultChecked />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-foreground">
                                Sound Effects
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Play sounds for notifications and interactions
                            </p>
                        </div>
                        <Switch />
                    </div>

                    <div className="flex items-center justify-between">
                        <div>
                            <h4 className="font-medium text-foreground">
                                Compact Mode
                            </h4>
                            <p className="text-sm text-muted-foreground">
                                Use a more compact layout
                            </p>
                        </div>
                        <Switch />
                    </div>
                </div>
            </GlassCard> */}
        </div>
    );

    const renderSocialTab = () => (
        <div className="space-y-6">
            <div className="grid grid-cols-1 gap-6">
                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        GitHub Username
                    </label>
                    <Input
                        value={formData.social.github}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                social: {
                                    ...formData.social,
                                    github: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                        placeholder="your-github-username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Linkedin className="w-4 h-4" />
                        LinkedIn Username
                    </label>
                    <Input
                        value={formData.social.linkedin}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                social: {
                                    ...formData.social,
                                    linkedin: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                        placeholder="your-linkedin-username"
                    />
                </div>

                <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground flex items-center gap-2">
                        <Twitter className="w-4 h-4" />
                        Twitter Handle
                    </label>
                    <Input
                        value={formData.social.twitter}
                        onChange={(e) =>
                            setFormData({
                                ...formData,
                                social: {
                                    ...formData.social,
                                    twitter: e.target.value,
                                },
                            })
                        }
                        className="bg-background/50 border-glass-border"
                        placeholder="@your-twitter-handle"
                    />
                </div>
            </div>

            <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
                <h4 className="font-medium text-foreground mb-2">
                    Why connect social accounts?
                </h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Showcase your open source contributions</li>
                    <li>• Help team members find and connect with you</li>
                    <li>
                        • Build credibility through your professional profiles
                    </li>
                    <li>• Enable easier collaboration on projects</li>
                </ul>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen animated-bg relative overflow-hidden pt-24">
            <BackgroundScene className="absolute inset-0 w-full h-full" />

            <div className="relative max-w-7xl mx-auto p-6">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-8"
                >
                    <h1 className="font-orbitron font-bold text-4xl md:text-5xl text-foreground mb-4">
                        Settings
                    </h1>
                    <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                        Customize your HackMate experience and manage your
                        account preferences
                    </p>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                    >
                        <GlassCard className="p-6">
                            <nav className="space-y-2">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors ${
                                            activeTab === tab.id
                                                ? 'bg-primary/20 text-primary border border-primary/30'
                                                : 'text-muted-foreground hover:text-foreground hover:bg-primary/5'
                                        }`}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        <span className="font-medium">
                                            {tab.label}
                                        </span>
                                    </button>
                                ))}
                            </nav>
                        </GlassCard>
                    </motion.div>

                    {/* Content */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="lg:col-span-3"
                    >
                        <GlassCard className="p-8">
                            <div className="flex items-center justify-between mb-8">
                                <h2 className="font-orbitron font-bold text-2xl text-foreground">
                                    {
                                        tabs.find((tab) => tab.id === activeTab)
                                            ?.label
                                    }
                                </h2>
                                <Button
                                    variant="neon"
                                    onClick={handleSave}
                                    className="gap-2"
                                >
                                    <Save className="w-4 h-4" />
                                    Save Changes
                                </Button>
                            </div>

                            {activeTab === 'profile' && renderProfileTab()}
                            {/* {activeTab === 'notifications' &&
                                renderNotificationsTab()} */}
                            {activeTab === 'privacy' && renderPrivacyTab()}
                            {activeTab === 'appearance' &&
                                renderAppearanceTab()}
                            {activeTab === 'social' && renderSocialTab()}
                        </GlassCard>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}