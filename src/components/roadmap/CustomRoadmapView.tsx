import React from 'react';
import RoadmapHeader from './RoadmapHeader';
import RoadmapPersonalization from './RoadmapPersonalization';
import RoadmapTimeline, { Phase, Topic } from './RoadmapTimeline';
import RoadmapBottomPanels from './RoadmapBottomPanels';
import { LearnerDNA, SkillGap } from '@/types/mastermind';

interface CustomRoadmapViewProps {
  dna: LearnerDNA;
  skillGaps: SkillGap[];
  milestones: any[];
}

export default function CustomRoadmapView({ dna, skillGaps, milestones }: CustomRoadmapViewProps) {
  
  // 1. Header mapping (Safe fallbacks for missing DNA)
  const safeDna = dna || {} as LearnerDNA;
  const goal = safeDna.careerIntent?.primaryTargetRole?.replace(/-/g, ' ')?.replace(/\b\w/g, c => c.toUpperCase()) || 'Target Role';
  const industry = safeDna.careerIntent?.targetIndustries?.[0] || 'Tech';
  const targetCompany = safeDna.careerIntent?.targetCompanies?.[0] || 'Product Companies';
  const level = safeDna.currentSituation === 'first_job' ? 'Entry Level' : 'Mid Level';
  const timeframeMonths = safeDna.careerIntent?.timeframeMonths || 6;
  const weeklyHours = Math.round((safeDna.availability?.weeklyLearningCapacityMinutes || 600) / 60);
  const currentLevel = 'Beginner'; // Starting from 0

  // 2. Personalization mapping
  const factors = [
    { factor: 'Learning Style', value: '', impact: 'Optimized for deep work + practical projects based on your preferences.' },
    { factor: 'Timeline', value: '', impact: `Began with fundamentals because your current level is Beginner.` },
    { factor: 'Project Style', value: '', impact: `Hands-on learning preference shaped more projects & labs.` },
    { factor: 'Highest-Impact Gaps', value: '', impact: `${industry} focus added domain-specific capstone requirements.` },
  ];

  // 3. Timeline parsing (map milestones to phases safely)
  const safeMilestones = Array.isArray(milestones) ? milestones : [];
  const phases: Phase[] = [];
  const phaseNodes = safeMilestones.filter(m => m?.id?.startsWith('phase-'));
  
  phaseNodes.forEach(pNode => {
    const childNodes = safeMilestones.filter(m => m?.prerequisites?.includes(pNode.id));
    
    phases.push({
      id: pNode.id,
      title: pNode.title?.split(': ')[1] || pNode.title || 'Phase',
      subtitle: pNode.title?.split(': ')[0] || `Phase`,
      topics: childNodes.map(c => ({
        id: c.id,
        title: c.title || 'Topic',
        isCompleted: false // Everything starts from 0
      })),
      progress: 0,
      totalTopics: childNodes.length
    });
  });

  // Fallback if no phases found (e.g. old data structure without 'phase-' prefix)
  if (phases.length === 0 && safeMilestones.length > 0) {
    phases.push({
      id: 'fallback', title: 'Learning Journey', subtitle: 'Phase 1', progress: 0, totalTopics: safeMilestones.length,
      topics: safeMilestones.slice(0, 10).map(m => ({ id: m.id, title: m.title, isCompleted: false }))
    });
  }

  // 4. Bottom panels mapping
  const safeSkillGaps = Array.isArray(skillGaps) ? skillGaps : [];
  const projects = [
    { title: 'Credit Card Fraud Detection System', difficulty: 'Medium' as const },
    { title: 'Stock Price Prediction using LSTM', difficulty: 'Medium' as const },
    { title: 'FinTech Chatbot using RAG & LLM', difficulty: 'Easy' as const },
  ];

  const firstIncompleteTopic = phases[0]?.topics[0];
  const nextStepTitle = firstIncompleteTopic?.title || 'Start Learning';
  const nextStepSubtitle = 'Continue your learning journey';
  
  const dailyGoalMinutes = 60;
  const dailyCompletedMinutes = 0;

  return (
    <div className="w-full max-w-[1200px] mx-auto pb-12">
      <RoadmapHeader 
        goal={goal}
        industry={industry}
        targetCompany={targetCompany}
        level={level}
        timeframeMonths={timeframeMonths}
        weeklyHours={weeklyHours}
        currentLevel={currentLevel}
        progressPercent={0}
        completedMilestones={0}
        totalMilestones={safeMilestones.length}
      />

      <RoadmapPersonalization factors={factors} />

      <RoadmapTimeline phases={phases} />

      <RoadmapBottomPanels 
        skillGaps={safeSkillGaps}
        projects={projects}
        nextStepTitle={nextStepTitle}
        nextStepSubtitle={nextStepSubtitle}
        dailyGoalMinutes={dailyGoalMinutes}
        dailyCompletedMinutes={dailyCompletedMinutes}
      />
    </div>
  );
}
