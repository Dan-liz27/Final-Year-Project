import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AppProvider } from './context/AppContext';
import { ThemeProvider } from './context/ThemeContext';
import { AuthProvider } from './context/AuthContext';
import { TutorialProvider } from './context/TutorialContext';
import ProtectedRoute from './components/ProtectedRoute';
import OnboardingTutorial from './components/tutorial/OnboardingTutorial';
import Layout from './components/layout/Layout';
import Welcome from './pages/Welcome';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Home from './pages/Home';
import UploadPage from './pages/UploadPage';
import Profile from './pages/Profile';
import HistoryPage from './pages/HistoryPage';
import LearnHub from './pages/LearnHub';
import ArticlesPage from './pages/ArticlesPage';
import PhotographyPage from './pages/PhotographyPage';
import PreventionPage from './pages/PreventionPage';
import DoctorGuidePage from './pages/DoctorGuidePage';
import FAQPage from './pages/FAQPage';
import ScrollToTop from './components/ScrollToTop';

function App() {
    return (
        <BrowserRouter>
            <ScrollToTop />
            <ThemeProvider>
                <AuthProvider>
                    <TutorialProvider>
                        <AppProvider>
                            <Toaster
                                position="top-center"
                                toastOptions={{
                                    duration: 3000,
                                    style: {
                                        background: 'var(--toast-bg)',
                                        color: 'var(--toast-color)',
                                        border: '1px solid var(--toast-border)',
                                    },
                                    success: {
                                        duration: 3000,
                                        iconTheme: {
                                            primary: '#10b981',
                                            secondary: '#fff',
                                        },
                                    },
                                    error: {
                                        duration: 4000,
                                        iconTheme: {
                                            primary: '#ef4444',
                                            secondary: '#fff',
                                        },
                                    },
                                }}
                            />

                            <Routes>
                                {/* Public Routes */}
                                <Route path="/welcome" element={<Welcome />} />
                                <Route path="/login" element={<Login />} />
                                <Route path="/signup" element={<Signup />} />

                                {/* Protected Routes */}
                                <Route path="/" element={
                                    <ProtectedRoute>
                                        <Layout />
                                    </ProtectedRoute>
                                }>
                                    <Route index element={<Home />} />
                                    <Route path="upload" element={<UploadPage />} />
                                    <Route path="profile" element={<Profile />} />
                                    <Route path="history" element={<HistoryPage />} />
                                    <Route path="learn" element={<LearnHub />} />
                                    <Route path="learn/articles" element={<ArticlesPage />} />
                                    <Route path="learn/photography" element={<PhotographyPage />} />
                                    <Route path="learn/prevention" element={<PreventionPage />} />
                                    <Route path="learn/doctor" element={<DoctorGuidePage />} />
                                    <Route path="learn/faq" element={<FAQPage />} />
                                </Route>

                                {/* Redirect unknown routes */}
                                <Route path="*" element={<Navigate to="/welcome" replace />} />
                            </Routes>
                            <OnboardingTutorial />
                        </AppProvider>
                    </TutorialProvider>
                </AuthProvider>
            </ThemeProvider>
        </BrowserRouter >
    );
}

export default App;
