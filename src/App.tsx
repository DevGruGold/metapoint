import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./hooks/useAuth";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import About from "./pages/About";
import Newsletter from "./pages/Newsletter";
import Archive from "./pages/Archive";
import Article from "./pages/Article";
import Advisors from "./pages/Advisors";
import Subscribe from "./pages/Subscribe";
import Contact from "./pages/Contact";
import Auth from "./pages/Auth";
import Dashboard from "./pages/admin/Dashboard";
import Articles from "./pages/admin/Articles";
import ArticleForm from "./pages/admin/ArticleForm";
import Users from "./pages/admin/Users";
import MediaLibrary from "./pages/admin/MediaLibrary";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            <Navigation />
            <main className="flex-grow">
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/about" element={<About />} />
                <Route path="/newsletter" element={<Newsletter />} />
                <Route path="/archive" element={<Archive />} />
                <Route path="/articles/:slug" element={<Article />} />
                <Route path="/advisors" element={<Advisors />} />
                <Route path="/subscribe" element={<Subscribe />} />
                <Route path="/contact" element={<Contact />} />
                <Route path="/auth" element={<Auth />} />
                
                {/* Admin Routes - Protected */}
                <Route 
                  path="/admin" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Dashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/articles" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Articles />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/articles/new" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <ArticleForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/articles/:id/edit" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <ArticleForm />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/users" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <Users />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/media" 
                  element={
                    <ProtectedRoute requireAdmin>
                      <MediaLibrary />
                    </ProtectedRoute>
                  } 
                />
                
                <Route path="*" element={<NotFound />} />
              </Routes>
            </main>
            <Footer />
          </div>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
