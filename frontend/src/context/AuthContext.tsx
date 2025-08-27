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
  register: (email: string, password: string, name: string, role?: UserRole) => Promise<{ error?: string; success?: boolean; message?: string; needsConfirmation?: boolean }>;
  resetPassword: (email: string) => Promise<{ error?: string; success?: boolean; message?: string }>;
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
      // Check if user already exists in our users table first
      const { data: existingUser, error: checkError } = await supabase
        .from('users')
        .select('email')
        .eq('email', email)
        .single();

      // If user exists and there's no error, return error message
      if (existingUser && !checkError) {
        return { error: 'An account with this email already exists. Please login instead.' };
      }

      // Proceed with signup
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
            role,
          },
          emailRedirectTo: `${window.location.origin}/login?confirmed=true`,
        },
      });

      if (error) {
        // Handle specific Supabase auth errors
        if (error.message.includes('User already registered') || 
            error.message.includes('already been registered') ||
            error.message.includes('already exists') ||
            error.message.includes('duplicate')) {
          return { error: 'An account with this email already exists. Please login instead.' };
        }
        return { error: error.message };
      }

      // If signup was successful and we have a user
      if (data.user) {
        // Try to create user profile
        try {
          const { error: profileError } = await supabase
            .from('users')
            .insert([{
              auth_id: data.user.id,
              name: name,
              email: email,
              role: role
            }]);

          // If profile creation fails due to duplicate, the user already exists
          if (profileError) {
            if (profileError.message.includes('duplicate key') || 
                profileError.message.includes('already exists') ||
                profileError.code === '23505') { // PostgreSQL unique violation code
              return { error: 'An account with this email already exists. Please login instead.' };
            }
            console.log('Profile creation handled by trigger');
          }
        } catch (profileErr: any) {
          if (profileErr.message?.includes('duplicate key') || 
              profileErr.message?.includes('already exists') ||
              profileErr.code === '23505') {
            return { error: 'An account with this email already exists. Please login instead.' };
          }
          console.log('Profile creation handled by trigger');
        }

        // Check if user needs email confirmation
        if (!data.user.email_confirmed_at) {
          return { 
            success: true, 
            message: 'Registration successful! Please check your email and click the confirmation link to activate your account.',
            needsConfirmation: true 
          };
        }
      }

      return { success: true, message: 'Registration successful! You can now log in.' };
    } catch (error: any) {
      if (error.message?.includes('duplicate key') || 
          error.message?.includes('already exists') ||
          error.code === '23505') {
        return { error: 'An account with this email already exists. Please login instead.' };
      }
      return { error: 'An unexpected error occurred' };
    }
  };

  const resetPassword = async (email: string) => {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        return { error: error.message };
      }

      return { success: true, message: 'Password reset email sent. Please check your inbox.' };
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
        resetPassword,
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
