import ModalFeedbackForm from '@/components/feedback/ModalFeedbackForm';
import { Footer } from '@/components/layout/footer';
import { Navbar } from '@/components/layout/navbar';
import ScrollToTop from '@/components/layout/scroll-to-top';
import { webSocketService } from '@/store/index';
import React, { useEffect, useState } from 'react';
import {
    Navigate,
    Route,
    BrowserRouter as Router,
    Routes,
} from 'react-router-dom';
import Loader from './components/ui/Loader';
import { useAuth, useUser } from './hooks/authHook';
import Analytics from './pages/Analytics';
import Dashboard from './pages/Dashboard';
import ForgotPassword from './pages/ForgotPassword';
import HackathonDetailsPage from './pages/Hackathon';
import Landing from './pages/Landing';
import Lobbies from './pages/Lobbies';
import Login from './pages/Login';
import NotFound from './pages/NotFound';
import Profile from './pages/Profile';
import Settings from './pages/Settings';
import Signup from './pages/Signup';
import TeamChat from './pages/TeamChat';
import Teams from './pages/Teams';
import { verifyToken } from './store/slices/authSlice';

const AppContent: React.FC = () => {
    const { isAuthenticated, isLoading, dispatch } = useAuth();
    const { user } = useUser();
    const [isBootstrapping, setIsBootstrapping] = useState(true);

    useEffect(() => {
        const init = async () => {
            const token = localStorage.getItem('token');
            if (token) {
                try {
                    await dispatch(verifyToken());
                    // establish websocket connection with token so we receive real-time events
                    try {
                        webSocketService.connect(token);
                    } catch (err) {
                        console.warn('WebSocket connect failed', err);
                    }
                } catch (e) {
                    // ignore
                }
            }
            setIsBootstrapping(false);
        };

        init();
    }, [dispatch]);

    // subscribe to the user's current hackathon so we receive hackathon lifecycle events
    useEffect(() => {
        if (user && user.currentHackathonId) {
            try {
                webSocketService.subscribeToHackathon(user.currentHackathonId);
            } catch (err) {
                console.warn('Failed to subscribe to hackathon', err);
            }
        }
    }, [user]);

    // disconnect websocket when user logs out
    useEffect(() => {
        if (!isAuthenticated) {
            try {
                webSocketService.disconnect();
            } catch (err) {
                // ignore
            }
        }
    }, [isAuthenticated]);

    if (isBootstrapping || isLoading) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    return (
        <Router>
            <ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
                <Navbar />
                <ModalFeedbackForm />
                <main className="pt-20">
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/signup" element={<Signup />} />

                        <Route
                            path="/dashboard"
                            element={
                                isAuthenticated ? (
                                    <Dashboard />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/lobbies"
                            element={
                                isAuthenticated ? (
                                    <Lobbies />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/teams"
                            element={
                                isAuthenticated ? (
                                    <Teams />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/analytics"
                            element={
                                isAuthenticated ? (
                                    <Analytics />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/profile"
                            element={
                                isAuthenticated ? (
                                    <Profile />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />
                        <Route
                            path="/settings"
                            element={
                                isAuthenticated ? (
                                    <Settings />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />

                        <Route
                            path="/hackathon/:id"
                            element={
                                isAuthenticated ? (
                                    <HackathonDetailsPage />
                                ) : (
                                    <Navigate to="/login" />
                                )
                            }
                        />

                        <Route path="/team" element={<TeamChat />} />
                        <Route
                            path="/forgot-password"
                            element={<ForgotPassword />}
                        />
                        {/* feedback is collected via global popup ModalFeedbackForm; no dedicated /feedback page */}

                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>
                <Footer />
            </div>
        </Router>
    );
};

const App: React.FC = () => {
    return <AppContent />;
};

export default App;
