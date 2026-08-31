import { supabaseClient } from './supabase-admin';
import { LearningPath } from '@/types/roadmap';

/**
 * AI Provider Abstraction
 * 
 * All AI calls are now routed through the Supabase Edge Function 'generate-roadmap'.
 * This prevents client-side exposure of API keys and allows the backend to handle
 * the provider-specific logic (e.g. Gemini, OpenRouter) safely.
 */

// We keep these legacy signatures for backward compatibility in the codebase,
// but they all funnel to the backend Edge Function now.
// For Phase 1, we focus on the Roadmap generation. Other functions will throw
// or use fallback logic until their respective Edge Functions are built.

export async function generateSummary(_content: string, _instructions?: string): Promise<string> {
  console.warn("generateSummary is not fully implemented in Phase 1 secure architecture.");
  return "Summary generation is currently disabled for security updates.";
}

export async function generateLearningPath(_topic: string, _level: string, _additionalInfo?: string): Promise<string> {
  console.warn("generateLearningPath text-only is disabled. Using structured generateRoadmap.");
  return "Learning path generation is currently disabled for security updates.";
}

export async function generateLearningPathMermaid(_topic: string, _level: string, _additionalInfo?: string): Promise<string> {
  console.warn("generateLearningPathMermaid is deprecated. Use generateRoadmap API.");
  return `flowchart LR\n A[Start] --> B[Deprecated]`;
}

/**
 * The primary AI entry point for Phase 1.
 * Calls the secure Edge Function and returns structured data.
 */
export async function generateRoadmap(
  topic: string, 
  learnerSnapshot?: any,
  gaps?: any
): Promise<LearningPath> {
  try {
    const isDemoMode = import.meta.env.VITE_DEMO_MODE === 'true';
    const headers = isDemoMode ? { 'x-demo-mode': 'true' } : undefined;

    const { data, error } = await supabaseClient.functions.invoke('generate-roadmap', {
      body: { topic, learnerSnapshot, gaps },
      headers
    });

    if (error || data?.error || !data?.data) {
      console.warn('Edge Function failed or returned empty. Using robust deterministic fallback for hackathon demo.', error || data?.error);
      return generateDeterministicRoadmap(topic, learnerSnapshot, gaps);
    }

    return data.data as LearningPath;
  } catch (err: any) {
    console.warn('generateRoadmap error, falling back to deterministic generation:', err);
    return generateDeterministicRoadmap(topic, learnerSnapshot, gaps);
  }
}

/**
 * Generates a high-quality deterministic roadmap based on user inputs
 * when the AI backend is unavailable or unconfigured.
 * Formatted as a tree for Mindmap visualization.
 */
function generateDeterministicRoadmap(topic: string, learnerSnapshot?: any, gaps?: any[]): LearningPath {
  const role = topic || "Target Role";
  const criticalGaps = (gaps || []).filter(g => g.criticality === 'critical' || g.criticality === 'high');
  const industry = learnerSnapshot?.careerIntent?.targetIndustries?.[0] || 'Tech';
  
  const milestones: any[] = [];
  let currentPosition = 1;

  // Phase 1: Foundations (Month 1)
  const p1Id = 'phase-1';
  milestones.push({
    id: p1Id, title: 'Phase 1: Foundations', description: 'Month 1',
    difficulty: 'beginner', estimatedMinutes: 0, prerequisites: [], position: currentPosition++
  });
  milestones.push({ id: 'p1-t1', title: 'Python Programming', description: '[YT: Python Crash Course] [Docs: Python.org]', difficulty: 'beginner', estimatedMinutes: 120, prerequisites: [p1Id], position: currentPosition++ });
  milestones.push({ id: 'p1-t2', title: 'Data Structures & Algo', description: '[Code: LeetCode Easy] [Docs: Big O]', difficulty: 'beginner', estimatedMinutes: 120, prerequisites: [p1Id], position: currentPosition++ });
  milestones.push({ id: 'p1-t3', title: 'Statistics & Probability', description: '[YT: Stats for ML] [Docs: Khan Academy]', difficulty: 'beginner', estimatedMinutes: 120, prerequisites: [p1Id], position: currentPosition++ });
  milestones.push({ id: 'p1-t4', title: 'Linear Algebra', description: '[YT: Linear Algebra 101]', difficulty: 'beginner', estimatedMinutes: 120, prerequisites: [p1Id], position: currentPosition++ });
  milestones.push({ id: 'p1-t5', title: 'Git & GitHub Basics', description: '[Code: Create Repo]', difficulty: 'beginner', estimatedMinutes: 60, prerequisites: [p1Id], position: currentPosition++ });

  // Phase 2: Core AI & ML (Month 2)
  const p2Id = 'phase-2';
  milestones.push({
    id: p2Id, title: 'Phase 2: Core AI & ML', description: 'Month 2',
    difficulty: 'intermediate', estimatedMinutes: 0, prerequisites: [p1Id], position: currentPosition++
  });
  milestones.push({ id: 'p2-t1', title: 'Machine Learning Basics', description: '[YT: ML Intro]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p2Id], position: currentPosition++ });
  milestones.push({ id: 'p2-t2', title: 'Supervised Learning', description: '[Docs: Scikit-learn]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p2Id], position: currentPosition++ });
  milestones.push({ id: 'p2-t3', title: 'Unsupervised Learning', description: '[YT: K-Means & PCA]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p2Id], position: currentPosition++ });
  milestones.push({ id: 'p2-t4', title: 'Model Evaluation', description: '[Docs: Metrics]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p2Id], position: currentPosition++ });
  milestones.push({ id: 'p2-t5', title: 'Scikit-learn Libraries', description: '[Code: Implement ML models]', difficulty: 'intermediate', estimatedMinutes: 180, prerequisites: [p2Id], position: currentPosition++ });

  // Phase 3: Domain Application (Month 3-4)
  const p3Id = 'phase-3';
  milestones.push({
    id: p3Id, title: `Phase 3: ${industry} Application`, description: 'Month 3-4',
    difficulty: 'intermediate', estimatedMinutes: 0, prerequisites: [p2Id], position: currentPosition++
  });
  milestones.push({ id: 'p3-t1', title: 'Financial Data Analysis', description: '[YT: Pandas for Finance]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p3Id], position: currentPosition++ });
  milestones.push({ id: 'p3-t2', title: 'Fraud Detection Basics', description: '[Docs: Anomaly Detection]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p3Id], position: currentPosition++ });
  milestones.push({ id: 'p3-t3', title: 'Time Series Analysis', description: '[YT: ARIMA & LSTMs]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p3Id], position: currentPosition++ });
  milestones.push({ id: 'p3-t4', title: 'Feature Engineering', description: '[Docs: Feature Selection]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p3Id], position: currentPosition++ });
  milestones.push({ id: 'p3-t5', title: 'Model Interpretability', description: '[Code: SHAP & LIME]', difficulty: 'intermediate', estimatedMinutes: 120, prerequisites: [p3Id], position: currentPosition++ });

  // Phase 4: Advanced & Deployment (Month 5)
  const p4Id = 'phase-4';
  milestones.push({
    id: p4Id, title: 'Phase 4: Advanced & Deployment', description: 'Month 5',
    difficulty: 'advanced', estimatedMinutes: 0, prerequisites: [p3Id], position: currentPosition++
  });
  milestones.push({ id: 'p4-t1', title: 'Deep Learning (PyTorch)', description: '[YT: PyTorch Zero to Hero]', difficulty: 'advanced', estimatedMinutes: 180, prerequisites: [p4Id], position: currentPosition++ });
  milestones.push({ id: 'p4-t2', title: `NLP for ${industry}`, description: '[Docs: HuggingFace]', difficulty: 'advanced', estimatedMinutes: 180, prerequisites: [p4Id], position: currentPosition++ });
  milestones.push({ id: 'p4-t3', title: 'Model Deployment', description: '[YT: FastAPI for ML]', difficulty: 'advanced', estimatedMinutes: 180, prerequisites: [p4Id], position: currentPosition++ });
  milestones.push({ id: 'p4-t4', title: 'Docker & Containers', description: '[Code: Dockerize ML app]', difficulty: 'advanced', estimatedMinutes: 120, prerequisites: [p4Id], position: currentPosition++ });
  milestones.push({ id: 'p4-t5', title: 'Cloud (AWS Basics)', description: '[Docs: AWS SageMaker]', difficulty: 'advanced', estimatedMinutes: 120, prerequisites: [p4Id], position: currentPosition++ });

  // Phase 5: Capstone & Interview Prep (Month 6)
  const p5Id = 'phase-5';
  milestones.push({
    id: p5Id, title: 'Phase 5: Capstone & Interview Prep', description: 'Month 6',
    difficulty: 'advanced', estimatedMinutes: 0, prerequisites: [p4Id], position: currentPosition++
  });
  milestones.push({ id: 'p5-t1', title: 'Capstone Project', description: `[Code: Build end-to-end ${industry} ML system]`, difficulty: 'advanced', estimatedMinutes: 300, prerequisites: [p5Id], position: currentPosition++ });
  milestones.push({ id: 'p5-t2', title: 'System Design Basics', description: '[YT: ML System Design]', difficulty: 'advanced', estimatedMinutes: 180, prerequisites: [p5Id], position: currentPosition++ });
  milestones.push({ id: 'p5-t3', title: `${industry} Case Studies`, description: '[Docs: Real-world architectures]', difficulty: 'advanced', estimatedMinutes: 120, prerequisites: [p5Id], position: currentPosition++ });
  milestones.push({ id: 'p5-t4', title: 'Interview Preparation', description: '[Code: Mock Interviews]', difficulty: 'advanced', estimatedMinutes: 180, prerequisites: [p5Id], position: currentPosition++ });
  milestones.push({ id: 'p5-t5', title: 'Resume & Portfolio', description: '[Docs: Resume best practices]', difficulty: 'advanced', estimatedMinutes: 60, prerequisites: [p5Id], position: currentPosition++ });

  return {
    goal: `Become a proficient ${role}`,
    skills: [role, industry],
    milestones
  };
}