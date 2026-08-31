import { z } from 'zod';

// Define the schema for a Learning Node (a milestone in the roadmap)
export const LearningNodeSchema = z.object({
  id: z.string().describe("A unique, web-safe identifier for this node (e.g., 'react-basics')"),
  title: z.string().describe("Short, clear title for the milestone"),
  description: z.string().describe("Detailed explanation of what will be learned"),
  difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
  estimatedMinutes: z.number().int().positive().describe("Estimated time to complete in minutes"),
  prerequisites: z.array(z.string()).describe("Array of node IDs that must be completed before this one"),
  resources: z.array(z.string()).optional().describe("List of recommended resource URLs or search terms"),
  project: z.string().optional().describe("A mini-project idea to apply the skills"),
  status: z.enum(['not_started', 'in_progress', 'completed']).default('not_started'),
  position: z.number().int().describe("The sequential order of this node in the path (e.g., 1, 2, 3)")
});

// Define the schema for the entire Learning Path
export const LearningPathSchema = z.object({
  goal: z.string().describe("The overarching goal of this roadmap"),
  skills: z.array(z.string()).describe("List of core skills covered in this path"),
  milestones: z.array(LearningNodeSchema).describe("The chronological list of learning milestones"),
});

// Infer TypeScript types from the Zod schemas
export type LearningNode = z.infer<typeof LearningNodeSchema>;
export type LearningPath = z.infer<typeof LearningPathSchema>;

// Represents the data as stored in the 'roadmaps' table
export interface RoadmapRecord {
  id: string;
  topic: string;
  mermaid_code?: string; // Legacy support
  structured_data?: LearningPath; // New structured format
  user_id: string;
  created_at: string;
}
