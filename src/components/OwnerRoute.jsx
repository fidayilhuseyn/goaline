import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';
import { Loader2 } from 'lucide-react';

const OwnerRoute = ({ children }) => {
  const { user } = useAuth();
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchRole = async () => {
      if (!user) {
        if (isMounted) {
          setLoading(false);
        }
        return;
      }

      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('id', user.id)
          .maybeSingle();

        if (error) {
          console.error('Supabase error fetching role:', error);
          throw error;
        }

        if (isMounted) {
          if (data) {
            setRole(data.role);
          } else {
            console.warn(`No profile found for user ID: ${user.id}. Check if profiles table is populated.`);
            setRole(null);
          }
        }
      } catch (err) {
        console.error('Error fetching user role from profiles:', err.message);
        if (isMounted) {
          setRole(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchRole();

    return () => {
      isMounted = false;
    };
  }, [user]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] text-slate-400">
        <Loader2 size={48} className="animate-spin text-primary mb-4" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role !== 'owner') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default OwnerRoute;
