'use client';

import React from 'react';
import { Link } from 'react-router-dom';
import { useAppContext } from '@/contexts/PersonalizedLearningContext';
import { useSidebar } from '@/components/dashboard/SidebarContext';
import { Button } from '@/components/ui/button';
import { resetContext } from '@/lib/personalized-learning/utilFunctions';
import {
  Lock,
  Unlock,
  Award,
  ChevronLeft,
  ChevronRight,
  History
} from 'lucide-react';

interface LearningModulesSidebarProps {
  className?: string;
}

export default function LearningModulesSidebar({ className }: LearningModulesSidebarProps) {
  const { studyPlatform, setStudyPlatform, setIntroduction } = useAppContext();
  const { isCollapsed: mainSidebarCollapsed } = useSidebar();

  // Don't render if study platform is not shown
  if (!studyPlatform.show) {
    return null;
  }

  return (
    <div className={`w-64 h-full bg-[#1a1a1a] border-r border-white/10 flex flex-col ${className}`}>
      {/* Header */}
      <div className="p-4 border-b border-white/10">
        <h3 className="text-sm font-semibold tracking-wider text-gray-300 uppercase">
          Learning Modules
        </h3>
        <p className="text-xs text-gray-500 mt-1">
          {studyPlatform.modulos.length} modules available
        </p>
      </div>
      
      {/* Modules List */}
      <div className="flex-1 p-3 overflow-y-auto">
        <div className="space-y-1">
          {studyPlatform.modulos.map((modulo, index) => (
            <button
              key={index}
              className={`flex items-center text-sm font-medium rounded-md transition-all duration-200 ease-in-out relative group w-full px-4 py-3 ${
                studyPlatform.actModule === index
                  ? 'text-white bg-white/10 border border-white/20'
                  : 'text-gray-400 hover:text-white hover:bg-white/5'
              } ${!modulo.isOpen ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}`}
              disabled={!modulo.isOpen}
              onClick={() => {
                if (!modulo.isOpen) return;
                setStudyPlatform(prevState => ({
                  ...prevState,
                  actModule: index,
                  isGettingModulo: true,
                  isLoading: true,
                }));
              }}
              title={modulo.title}
            >
              {/* Active indicator */}
              {studyPlatform.actModule === index && (
                <div className="absolute left-0 top-1/2 -translate-y-1/2">
                  <div className="h-6 w-1 bg-primary rounded-r-full shadow-[0_0_8px_rgba(139,92,246,0.6)]"></div>
                </div>
              )}
              
              {modulo.isOpen ? 
                <Unlock className="mr-3 h-4 w-4 flex-shrink-0" /> : 
                <Lock className="mr-3 h-4 w-4 flex-shrink-0" />
              }
              <span className="truncate text-left">{modulo.title}</span>
              
              {/* Progress indicator */}
              {modulo.isOpen && (
                <div className="ml-auto">
                  <div className="w-2 h-2 rounded-full bg-green-500"></div>
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
      
      {/* Footer - Change Topic Button */}
      <div className="p-3 border-t border-white/10">
        <Link to="/dashboard/personalized-learning-history">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5 mb-2"
          >
            <History className="mr-3 h-4 w-4" />
            Learning History
          </Button>
        </Link>
        <Button
          variant="ghost"
          size="sm"
          className="w-full justify-start text-gray-400 hover:text-white hover:bg-white/5"
          onClick={() => resetContext(setIntroduction, setStudyPlatform)}
        >
          <Award className="mr-3 h-4 w-4" />
          Change Topic
        </Button>
      </div>
    </div>
  );
}