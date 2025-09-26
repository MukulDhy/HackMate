import heroBackground from '@/assets/hero-background.jpg';
import { ContentSection } from '@/components/layout/content-section';
import { PageHeader } from '@/components/layout/page-header';
import { PageLayout } from '@/components/layout/page-layout';
import { Button } from '@/components/ui/button';
import { GlassCard } from '@/components/ui/glass-card';
import { useUser } from '@/hooks/authHook';
import { motion } from 'framer-motion';
import {
    ArrowRight,
    Quote,
    Star,
    Target,
    Trophy,
    Users,
    Zap,
} from 'lucide-react';
import { Link } from 'react-router-dom';

const features = [
    {
        icon: Users,
        title: 'Skill-Based Matching',
        description:
            'Get matched with teammates based on complementary skills and experience levels.',
    },
    {
        icon: Zap,
        title: 'Instant Lobbies',
        description:
            'Join hackathon lobbies instantly and start collaborating with like-minded developers.',
    },
    {
        icon: Target,
        title: 'Problem Assignment',
        description:
            "Receive tailored challenges that match your team's collective skill set.",
    },
    {
        icon: Trophy,
        title: 'Competitive Ranking',
        description:
            'Track your progress and compete on leaderboards across multiple hackathons.',
    },
];

const testimonials = [
    {
        quote: 'HackMate helped me find the perfect team for my first hackathon. The skill matching is incredible!',
        author: 'Sarah Chen',
        role: 'Frontend Developer',
        rating: 5,
    },
    {
        quote: "The platform's lobby system makes team formation so much easier. No more awkward networking!",
        author: 'Marcus Rodriguez',
        role: 'Full Stack Engineer',
        rating: 5,
    },
    {
        quote: "Best hackathon platform I've used. The problem assignment feature is a game-changer.",
        author: 'Emily Johnson',
        role: 'Data Scientist',
        rating: 5,
    },
];

const partners = ['Skill', 'Speed', 'Collaboration', 'Innovation', 'Growth', 'Community'];

export default function Landing() {
    const { user } = useUser();
    return (
        <PageLayout>
            {/* Hero Section */}
            <div className="pt-20">
                <PageHeader
                    title="HackMate"
                    subtitle="Where Skills Meet Challenges"
                    variant="hero"
                >
                    {/* Hero Background Image Overlay */}
                    <div
                        className="absolute inset-0 -z-10 opacity-20 rounded-3xl"
                        style={{
                            backgroundImage: `url(${heroBackground})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            filter: 'blur(1px)',
                        }}
                    />

                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{
                            delay: 0.3,
                            type: 'spring',
                            stiffness: 200,
                        }}
                        className="mb-8 flex justify-center"
                    >
                        <div className="w-32 h-32 flex items-center justify-center bg-gradient-to-br from-blue-500 to-blue-700 rounded-2xl shadow-xl">
                            <span className="text-4xl font-bold text-white">
                                HM
                            </span>
                        </div>
                    </motion.div>

                    <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                        className="text-lg text-muted-foreground mb-12 max-w-3xl mx-auto"
                    >
                        Join the ultimate platform for skill-based hackathons,
                        intelligent team formation, and competitive coding
                        challenges. Connect with developers worldwide and build
                        the future together.
                    </motion.p>

                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="flex flex-col sm:flex-row gap-4 justify-center"
                    >
                        <Link to={user ? "/lobbies" : "/login"}>
                            <Button variant="hero" size="xl" className="group">
                                Join Hackathon
                                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        {/* <Button variant="glass" size="xl">
                            Learn More
                        </Button> */}
                    </motion.div>
                </PageHeader>

                {/* Features Section */}
                <ContentSection spacing="xl">
                    <div className="text-center mb-16">
                        <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-foreground">
                            Powerful Features
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Everything you need to excel in hackathons and
                            collaborative coding challenges
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <motion.div
                                key={feature.title}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard
                                    variant="interactive"
                                    className="p-8 h-full text-center group"
                                >
                                    <div className="w-16 h-16 mx-auto mb-6 bg-gradient-primary rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                                        <feature.icon className="w-8 h-8 text-foreground" />
                                    </div>
                                    <h3 className="font-orbitron font-semibold text-xl mb-4 text-foreground">
                                        {feature.title}
                                    </h3>
                                    <p className="text-muted-foreground">
                                        {feature.description}
                                    </p>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>

                {/* Testimonials Section */}
                <ContentSection spacing="xl">
                    <div className="text-center mb-16">
                        <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-foreground">
                            What Developers Say
                        </h2>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
                            Join thousands of developers who have transformed
                            their hackathon experience
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {testimonials.map((testimonial, index) => (
                            <motion.div
                                key={testimonial.author}
                                initial={{ opacity: 0, y: 50 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <GlassCard className="p-8 h-full">
                                    <Quote className="w-8 h-8 text-primary mb-4" />
                                    <p className="text-foreground mb-6 italic">
                                        "{testimonial.quote}"
                                    </p>
                                    <div className="flex items-center gap-4 mb-4">
                                        <div>
                                            <p className="font-semibold text-foreground">
                                                {testimonial.author}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {testimonial.role}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1">
                                        {[...Array(testimonial.rating)].map(
                                            (_, i) => (
                                                <Star
                                                    key={i}
                                                    className="w-4 h-4 fill-primary text-primary"
                                                />
                                            ),
                                        )}
                                    </div>
                                </GlassCard>
                            </motion.div>
                        ))}
                    </div>
                </ContentSection>

                {/* Partners Section */}
                <ContentSection spacing="lg">
                    <div className="text-center mb-16">
                        <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-foreground">
                            Why HackMate Stands Out
                        </h2>
                    </div>

                    <GlassCard className="p-8">
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 items-center">
                            {partners.map((partner, index) => (
                                <motion.div
                                    key={partner}
                                    initial={{ opacity: 0, scale: 0.5 }}
                                    whileInView={{ opacity: 1, scale: 1 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: index * 0.1 }}
                                    className="text-center"
                                >
                                    <div className="text-2xl font-bold text-muted-foreground hover:text-primary transition-colors duration-300 cursor-pointer">
                                        {partner}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </GlassCard>
                </ContentSection>

                {/* CTA Section */}
                <ContentSection spacing="xl">
                    <div className="max-w-4xl mx-auto text-center">
                        <GlassCard variant="glow" className="p-12">
                            <h2 className="font-orbitron font-bold text-4xl md:text-5xl mb-6 text-foreground">
                                Ready to Hack the Future?
                            </h2>
                            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                                Join HackMate today and connect with the most
                                talented developers in the world. Your next
                                breakthrough is just one hackathon away.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <Link to="/login">
                                    <Button
                                        variant="hero"
                                        size="xl"
                                        className="group"
                                    >
                                        Get Started Now
                                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                {/* <Button variant="neon" size="xl">
                                    View Demo
                                </Button> */}
                            </div>
                        </GlassCard>
                    </div>
                </ContentSection>
            </div>
        </PageLayout>
    );
}
