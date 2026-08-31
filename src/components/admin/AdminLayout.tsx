import React from 'react';
import { motion } from 'framer-motion';
import { Outlet } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Shield } from 'lucide-react';
import AdminGuard from './AdminGuard';

export default function AdminLayout() {
  return (
    <AdminGuard>
      <div className="relative">
        {/* Admin badge */}
        <div className="fixed top-20 right-4 z-40">
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            className="bg-primary text-primary-foreground py-1 px-3 rounded-full text-xs font-medium flex items-center gap-1 shadow-lg"
          >
            <Shield className="h-3 w-3" />
            Admin Mode
          </motion.div>
        </div>
        
        {/* Background decoration elements */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute -top-20 -left-20 w-64 h-64 bg-primary/5 rounded-full blur-3xl opacity-50" />
          <div className="absolute top-1/3 -right-20 w-80 h-80 bg-primary/5 rounded-full blur-3xl opacity-60" />
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-primary/5 rounded-full blur-3xl opacity-50" />
        </div>
        
        {/* Content area */}
        <Outlet />
      </div>
    </AdminGuard>
  );
}