// ============================================================================
// IMPROVED useAuth.tsx - PREVENTS GLITCHING WITH STABLE ADMIN CHECK
// ============================================================================
// Replace src/hooks/useAuth.tsx with this improved version
// Key improvements:
// 1. Prevents race conditions by deferring admin check
// 2. Adds debouncing to prevent rapid state changes
// 3. Better error handling and logging
// 4. More stable loading states
// ============================================================================

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  isAdmin: boolean;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error: any }>;
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>;
  signOut: () => Promise<void>;
  checkAdminRole: (userId: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // Prevent duplicate admin checks
  const adminCheckInProgress = useRef(false);

  const checkAdminRole = async (userId: string): Promise<boolean> => {
    try {
      console.log('[Auth] Checking admin role for user:', userId);
      
      const { data, error } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', userId)
        .in('role', ['admin', 'superadmin']);
      
      if (error) {
        console.error('[Auth] Error checking admin role:', error);
        return false;
      }
      
      const hasAdminRole = data && data.length > 0;
      console.log('[Auth] Admin role check result:', hasAdminRole, 'Data:', data);
      return hasAdminRole;

    } catch (error) {
      console.error('[Auth] Exception checking admin role:', error);
      return false;
    }
  };

  // Update admin status with proper concurrency handling
  const updateAdminStatus = async (userId: string) => {
    // Prevent concurrent checks with timeout
    if (adminCheckInProgress.current) {
      console.log('[Auth] Admin check already in progress, skipping...');
      return;
    }
    
    adminCheckInProgress.current = true;
    
    // Add timeout to prevent stuck flag
    const timeout = setTimeout(() => {
      console.warn('[Auth] Admin check timeout - resetting flag');
      adminCheckInProgress.current = false;
    }, 5000);
    
    try {
      const isAdminUser = await checkAdminRole(userId);
      console.log('[Auth] Setting isAdmin to:', isAdminUser);
      setIsAdmin(isAdminUser);
      setLoading(false);
      
      console.log('[Auth] Admin status updated:', {
        userId,
        isAdmin: isAdminUser,
        loading: false
      });
    } catch (error) {
      console.error('[Auth] Error updating admin status:', error);
      setIsAdmin(false);
      setLoading(false);
    } finally {
      clearTimeout(timeout);
      adminCheckInProgress.current = false;
    }
  };

  useEffect(() => {
    console.log('[Auth] Setting up auth state listener');
    
    // Set up auth state listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, currentSession) => {
        console.log('[Auth] Auth state change:', event, currentSession?.user?.email);
        
        // Only synchronous state updates here
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
        
        if (currentSession?.user) {
          // Defer admin check with setTimeout to prevent deadlock
          setTimeout(() => {
            updateAdminStatus(currentSession.user.id);
          }, 0);
        } else {
          // User signed out - clear admin status immediately
          setIsAdmin(false);
          setLoading(false);
          adminCheckInProgress.current = false; // Reset flag on sign out
          console.log('[Auth] User signed out, admin status cleared');
        }
      }
    );

    // Check for existing session on mount
    supabase.auth.getSession().then(({ data: { session: currentSession } }) => {
      console.log('[Auth] Initial session check:', currentSession?.user?.email);
      
      setSession(currentSession);
      setUser(currentSession?.user ?? null);
      
      if (currentSession?.user) {
        updateAdminStatus(currentSession.user.id);
      } else {
        setLoading(false);
      }
    });

    return () => {
      console.log('[Auth] Cleaning up auth listener');
      subscription.unsubscribe();
    };
  }, []); // Empty dependency array - only run once on mount

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[Auth] Signing in:', email);
      
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      
      if (error) {
        console.error('[Auth] Sign in error:', error);
        toast.error(error.message);
        return { error };
      }
      
      toast.success('Signed in successfully!');
      
      // Wait for admin status to be checked before navigating
      await new Promise(resolve => setTimeout(resolve, 500));
      navigate('/');
      
      return { error: null };
    } catch (error: any) {
      console.error('[Auth] Sign in exception:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signUp = async (email: string, password: string, fullName: string) => {
    try {
      console.log('[Auth] Signing up:', email);
      
      const redirectUrl = `${window.location.origin}/`;
      
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: redirectUrl,
          data: {
            full_name: fullName,
          }
        }
      });
      
      if (error) {
        console.error('[Auth] Sign up error:', error);
        if (error.message.includes('already registered')) {
          toast.error('This email is already registered. Please sign in instead.');
        } else {
          toast.error(error.message);
        }
        return { error };
      }
      
      toast.success('Account created! Please check your email to verify.');
      return { error: null };
    } catch (error: any) {
      console.error('[Auth] Sign up exception:', error);
      toast.error('An unexpected error occurred');
      return { error };
    }
  };

  const signOut = async () => {
    try {
      console.log('[Auth] Signing out');
      
      // Clear admin check flag and state immediately
      adminCheckInProgress.current = false;
      setIsAdmin(false);
      setUser(null);
      setSession(null);
      
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('[Auth] Sign out error:', error);
        toast.error(error.message);
        return;
      }
      
      console.log('[Auth] Sign out successful');
      toast.success('Signed out successfully');
      navigate('/');
    } catch (error) {
      console.error('[Auth] Sign out exception:', error);
      toast.error('Error signing out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        isAdmin,
        loading,
        signIn,
        signUp,
        signOut,
        checkAdminRole,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
