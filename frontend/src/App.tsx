
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useUser } from './hooks/authHook';
import { verifyToken } from './store/slices/authSlice';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Lobbies from "./pages/Lobbies2";
import Teams from "./pages/Teams";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect, useState } from "react";
import ScrollToTop from './components/layout/scroll-to-top';
import ForgotPassword from './pages/ForgotPassword';
import FeedbackForm from './pages/Feedback';

import HackathonDetailsPage from './pages/Hackathon';
import { userFetchHackathon } from './store/slices/userCurrrentHacthon';
// import TeamAssignment from './pages/TeamAssignment';
import TeamChat from './pages/TeamChat';
import Loader from './components/ui/Loader';
import HackMateDonationPage from './pages/Donation';
import { BackgroundScene } from './components/3d/background-scene';


const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, dispatch,message } = useAuth();
  const {user} = useUser();
  const [isBootstrapping, setIsBootstrapping] = useState(true); // 👈 NEW STATE

  useEffect(() => {
    const token = localStorage.getItem("token");

    const checkToken = async () => {
      if (token) {
        await dispatch(verifyToken());
      }
      setTimeout(() => {
        setIsBootstrapping(false); // 👈 only after token check is done
      }, 5000);

    };

    checkToken();
  }, [dispatch]);

  useEffect(() => {

    if(user && user?.currentHackathonId){
    dispatch(userFetchHackathon(user.currentHackathonId));
    }
  },[user,user?.currentHackathonId]);

    if (isBootstrapping || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader  />
      </div>
    );
  }

  return (

          
          <Router><ScrollToTop />
            <div className="min-h-screen  text-foreground">
              {/* <BackgroundScene className="absolute inset-0 w-full h-full" /> */}
              <Navbar />
              <main className="pt-20">
                <Routes>
                  <Route path="/" element={<Landing />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                  <Route 
                    path="/dashboard" 
                    element={isAuthenticated ? <Dashboard /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/lobbies" 
                    element={isAuthenticated ? <Lobbies /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/teams" 
                    element={isAuthenticated ? <Teams /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/analytics" 
                    element={isAuthenticated ? <Analytics /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/profile" 
                    element={isAuthenticated ? <Profile /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/settings" 
                    element={isAuthenticated ? <Settings /> : <Navigate to="/login" />} 
                  />
                  <Route 
                    path="/hackathon/:id" 
                    element={isAuthenticated ? <HackathonDetailsPage /> : <Navigate to="/login" />} 
                  />
                   <Route 
                    path="/team" 
                    element={<TeamChat></TeamChat>} 
                  />
                   <Route 
                    path="/donation" 
                    element={<HackMateDonationPage></HackMateDonationPage>} 
                  />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/feedback" element={<FeedbackForm />} />
                  {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </main>
              <Footer />
            </div>
          </Router>
  );
};

const App: React.FC = () => {
  return (
      <AppContent />
  );
};

export default App;