
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth, useUser } from './hooks/authHook';
import { verifyToken } from './store/slices/authSlice';
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Lobbies from "./pages/Lobbies";
import Teams from "./pages/Teams";
import Profile from "./pages/Profile";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";
import { useEffect } from "react";
import ScrollToTop from './components/layout/scroll-to-top';
import HackathonPage from './pages/HackathonPage';
import HackathonDetailsPage from './pages/Hackathon';
import { userFetchHackathon } from './store/slices/userCurrrentHacthon';
import TeamAssignment from './pages/TeamAssignment';
import TeamChat from './pages/TeamChat';


const AppContent: React.FC = () => {
  const { isAuthenticated, isLoading, dispatch,message } = useAuth();
  const {user} = useUser();
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token && !isAuthenticated) {
      dispatch(verifyToken());
    }
  }, [dispatch, isAuthenticated]);


  useEffect(() => {
    console.log(user);
    if(user && user?.currentHackathonId){
    dispatch(userFetchHackathon(user.currentHackathonId));
    }
  },[user,user?.currentHackathonId])
  // if (isLoading) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <LoadingSpinner size="lg" />
  //     </div>
  //   );
  // }

  return (

          
          <Router><ScrollToTop />
            <div className="min-h-screen bg-background text-foreground">
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