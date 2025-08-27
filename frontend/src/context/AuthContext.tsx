
import React, { createContext, useContext, useEffect, useState } from "react";
import { User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import { useSupabaseAuth } from '../hooks/useSupabaseAuth';

export type UserRole = "admin" | "user" | null;

interface UserProfile {
  id: string;
  auth_id: string;
  name: string;
  email: string;
  role: UserRole;
  profile_image_url?: string;
  created_at: string;
  updated_at: string;
}

interface AuthContextType {
  user: User | null;
  profile: UserProfile | null;
  role: UserRole;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ error?: string }>;
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error?: string }>;
  logout: () => Promise<void>;
  username: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, session, loading: authLoading, signOut } = useSupabaseAuth();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  // Get user profile when auth state changes
  useEffect(() => {
    async function getProfile() {
      if (user) {
        try {
          // Try to get profile from users table, but don't fail if it errors
          let userData = null;
          try {
            const { data, error } = await supabase
              .from('users')
              .select('*')
              .eq('auth_id', user.id)
              .single();

            if (!error) {
              userData = data;
            }
          } catch (dbError) {
            console.log('Users table not accessible, using auth metadata');
          }

          // If no data from users table, create profile from auth metadata
          if (!userData) {
            userData = {
              id: user.id,
              auth_id: user.id,
              name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
              email: user.email,
              role: user.user_metadata?.role || 'user',
              created_at: user.created_at,
              updated_at: user.updated_at || user.created_at,
            };
          }

          setProfile(userData);
        } catch (error) {
          console.error('Error in getProfile:', error);
          // Fallback to auth metadata
          setProfile({
            id: user.id,
            auth_id: user.id,
            name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
            email: user.email,
            role: user.user_metadata?.role || 'user',
            created_at: user.created_at,
            updated_at: user.updated_at || user.created_at,
          });
        }
      } else {
        setProfile(null);
      }
      setLoading(authLoading);
    }

    getProfile();
  }, [user, authLoading]);

  const login = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { error: error.message };
      }

      // Log login history
      if (data.user) {
        await supabase.from('login_history').insert({
          user_id: profile?.id,
          ip_address: 'web-client', // In a real app, you'd get the actual IP
        });
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const register = async (email: string, password: string, name: string, role: UserRole = 'user') => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: undefined, // Disable email redirect for now
        },
      });

      if (error) {
        return { error: error.message };
      }

      // If trigger doesn't work, create user profile manually
      if (data.user && !error) {
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert([{
              auth_id: data.user.id,
              name: name,
              email: email,
              role: role
            }]);

          if (profileError) {
            console.log('Profile creation handled by trigger or already exists');
          }
        } catch (profileErr) {
          console.log('Profile creation handled by trigger');
        }

        // IMPORTANT: Sign out the user immediately after registration
        // This prevents auto-login and allows proper success message flow
        await supabase.auth.signOut();
      }

      return {};
    } catch (error) {
      return { error: 'An unexpected error occurred' };
    }
  };

  const logout = async () => {
    await signOut();
    setProfile(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user,
        profile,
        role: profile?.role || null,
        isAuthenticated: !!user,
        loading,
        login,
        register,
        logout,
        username: profile?.name || null
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
