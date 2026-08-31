/**
 * MasterMindAI Career Capability Registry
 *
 * Maps Role -> Capabilities -> Required Skills -> Required Level (0-100) + Prerequisites
 *
 * This is a pure domain configuration — NO React imports.
 * The onboarding UI reads from this registry to generate dynamic questions.
 * The gap engine uses this to compute deterministic skill gaps.
 *
 * Structure:
 *   CapabilityRegistry[roleId] = {
 *     roleName, roleFamily, capabilities: [{ id, name, skills: [{ skillId, requiredLevel, prerequisites[] }] }]
 *   }
 */

// ============================================================
// SKILL METADATA
// ============================================================
export interface SkillMeta {
  id: string;
  name: string;
  category: string;
  description?: string;
}

export const ALL_SKILLS: Record<string, SkillMeta> = {
  // Programming
  'python': { id: 'python', name: 'Python', category: 'Programming' },
  'javascript': { id: 'javascript', name: 'JavaScript', category: 'Programming' },
  'typescript': { id: 'typescript', name: 'TypeScript', category: 'Programming' },
  'java': { id: 'java', name: 'Java', category: 'Programming' },
  'cpp': { id: 'cpp', name: 'C++', category: 'Programming' },
  'go': { id: 'go', name: 'Go', category: 'Programming' },
  'rust': { id: 'rust', name: 'Rust', category: 'Programming' },
  'sql': { id: 'sql', name: 'SQL & Relational DBs', category: 'Data' },
  'git': { id: 'git', name: 'Git & Version Control', category: 'Engineering' },

  // Data & AI
  'numpy-pandas': { id: 'numpy-pandas', name: 'NumPy & Pandas', category: 'Data & AI' },
  'statistics': { id: 'statistics', name: 'Statistics & Probability', category: 'Data & AI' },
  'machine-learning': { id: 'machine-learning', name: 'Machine Learning', category: 'Data & AI' },
  'deep-learning': { id: 'deep-learning', name: 'Deep Learning', category: 'Data & AI' },
  'pytorch': { id: 'pytorch', name: 'PyTorch', category: 'Data & AI' },
  'tensorflow': { id: 'tensorflow', name: 'TensorFlow', category: 'Data & AI' },
  'nlp': { id: 'nlp', name: 'NLP (Natural Language Processing)', category: 'Data & AI' },
  'computer-vision': { id: 'computer-vision', name: 'Computer Vision', category: 'Data & AI' },
  'gen-ai': { id: 'gen-ai', name: 'Generative AI & LLMs', category: 'Data & AI' },
  'mlops': { id: 'mlops', name: 'MLOps', category: 'Data & AI' },
  'feature-engineering': { id: 'feature-engineering', name: 'Feature Engineering', category: 'Data & AI' },
  'model-evaluation': { id: 'model-evaluation', name: 'Model Evaluation', category: 'Data & AI' },
  'data-viz': { id: 'data-viz', name: 'Data Visualization', category: 'Data & AI' },
  'big-data': { id: 'big-data', name: 'Big Data (Spark/Hadoop)', category: 'Data & AI' },

  // Frontend
  'html-css': { id: 'html-css', name: 'HTML & CSS', category: 'Frontend' },
  'react': { id: 'react', name: 'React', category: 'Frontend' },
  'nextjs': { id: 'nextjs', name: 'Next.js', category: 'Frontend' },
  'vue': { id: 'vue', name: 'Vue.js', category: 'Frontend' },
  'accessibility': { id: 'accessibility', name: 'Web Accessibility', category: 'Frontend' },
  'performance': { id: 'performance', name: 'Web Performance', category: 'Frontend' },

  // Backend
  'nodejs': { id: 'nodejs', name: 'Node.js', category: 'Backend' },
  'fastapi': { id: 'fastapi', name: 'FastAPI / Flask / Django', category: 'Backend' },
  'api-design': { id: 'api-design', name: 'API Design (REST/GraphQL)', category: 'Backend' },
  'database-design': { id: 'database-design', name: 'Database Design', category: 'Backend' },
  'system-design': { id: 'system-design', name: 'System Design', category: 'Architecture' },

  // Infrastructure
  'docker': { id: 'docker', name: 'Docker & Containerization', category: 'Infrastructure' },
  'kubernetes': { id: 'kubernetes', name: 'Kubernetes', category: 'Infrastructure' },
  'cloud': { id: 'cloud', name: 'Cloud Platforms (AWS/GCP/Azure)', category: 'Infrastructure' },
  'devops': { id: 'devops', name: 'DevOps & CI/CD', category: 'Infrastructure' },
  'linux': { id: 'linux', name: 'Linux & Shell Scripting', category: 'Infrastructure' },
  'monitoring': { id: 'monitoring', name: 'Monitoring & Observability', category: 'Infrastructure' },

  // Security
  'networking': { id: 'networking', name: 'Networking Fundamentals', category: 'Security' },
  'security-fundamentals': { id: 'security-fundamentals', name: 'Security Fundamentals', category: 'Security' },
  'owasp': { id: 'owasp', name: 'OWASP & Application Security', category: 'Security' },
  'cryptography': { id: 'cryptography', name: 'Cryptography', category: 'Security' },
  'threat-modeling': { id: 'threat-modeling', name: 'Threat Modeling', category: 'Security' },
  'cloud-security': { id: 'cloud-security', name: 'Cloud Security', category: 'Security' },
  'siem': { id: 'siem', name: 'SIEM & Incident Response', category: 'Security' },
  'pen-testing': { id: 'pen-testing', name: 'Penetration Testing', category: 'Security' },

  // Product & Design
  'user-research': { id: 'user-research', name: 'User Research', category: 'Product & Design' },
  'product-strategy': { id: 'product-strategy', name: 'Product Strategy', category: 'Product & Design' },
  'roadmapping': { id: 'roadmapping', name: 'Product Roadmapping', category: 'Product & Design' },
  'prioritization': { id: 'prioritization', name: 'Prioritization Frameworks', category: 'Product & Design' },
  'stakeholder-mgmt': { id: 'stakeholder-mgmt', name: 'Stakeholder Management', category: 'Product & Design' },
  'product-analytics': { id: 'product-analytics', name: 'Product Analytics', category: 'Product & Design' },
  'experimentation': { id: 'experimentation', name: 'A/B Testing & Experimentation', category: 'Product & Design' },
  'figma': { id: 'figma', name: 'Figma & Prototyping', category: 'Product & Design' },
  'interaction-design': { id: 'interaction-design', name: 'Interaction Design', category: 'Product & Design' },
  'visual-design': { id: 'visual-design', name: 'Visual Design Principles', category: 'Product & Design' },
  'usability-testing': { id: 'usability-testing', name: 'Usability Testing', category: 'Product & Design' },
  'design-systems': { id: 'design-systems', name: 'Design Systems', category: 'Product & Design' },
  'information-architecture': { id: 'information-architecture', name: 'Information Architecture', category: 'Product & Design' },

  // Business & Finance
  'financial-modeling': { id: 'financial-modeling', name: 'Financial Modeling', category: 'Business & Finance' },
  'accounting': { id: 'accounting', name: 'Accounting Fundamentals', category: 'Business & Finance' },
  'excel': { id: 'excel', name: 'Excel / Google Sheets', category: 'Business & Finance' },
  'data-analysis-biz': { id: 'data-analysis-biz', name: 'Business Data Analysis', category: 'Business & Finance' },
  'power-bi': { id: 'power-bi', name: 'Power BI / Tableau', category: 'Business & Finance' },
  'market-research': { id: 'market-research', name: 'Market Research', category: 'Business & Finance' },
  'business-strategy': { id: 'business-strategy', name: 'Business Strategy', category: 'Business & Finance' },
  'presentation': { id: 'presentation', name: 'Presentation & Communication', category: 'Business & Finance' },

  // Soft Skills / Professional
  'communication': { id: 'communication', name: 'Communication', category: 'Professional' },
  'technical-writing': { id: 'technical-writing', name: 'Technical Writing', category: 'Professional' },
  'leadership': { id: 'leadership', name: 'Leadership & Mentoring', category: 'Professional' },
  'problem-solving': { id: 'problem-solving', name: 'Problem Solving', category: 'Professional' },
  'critical-thinking': { id: 'critical-thinking', name: 'Critical Thinking', category: 'Professional' },
  'time-management': { id: 'time-management', name: 'Time Management', category: 'Professional' },
  'testing': { id: 'testing', name: 'Testing & QA', category: 'Engineering' },

  // Research / Education
  'research-methods': { id: 'research-methods', name: 'Research Methods', category: 'Research' },
  'academic-writing': { id: 'academic-writing', name: 'Academic Writing', category: 'Research' },
  'curriculum-design': { id: 'curriculum-design', name: 'Curriculum Design', category: 'Education' },
  'pedagogy': { id: 'pedagogy', name: 'Pedagogy & Teaching Methods', category: 'Education' },

  // Embedded / Hardware
  'c-embedded': { id: 'c-embedded', name: 'C / Embedded C', category: 'Hardware' },
  'microcontrollers': { id: 'microcontrollers', name: 'Microcontrollers (Arduino/STM)', category: 'Hardware' },
  'rtos': { id: 'rtos', name: 'RTOS & Embedded OS', category: 'Hardware' },
  'electronics': { id: 'electronics', name: 'Electronics & Circuit Design', category: 'Hardware' },
};

// ============================================================
// CAPABILITY & ROLE TYPES
// ============================================================
export interface SkillRequirement {
  skillId: string;
  requiredLevel: number;    // 0-100
  importance: number;       // 1-10 (used in gap priority score)
  prerequisites: string[];  // skillIds that should be learned first
}

export interface Capability {
  id: string;
  name: string;
  description: string;
  importance: number;       // 1-10, used in gap scoring
  skills: SkillRequirement[];
}

export interface RoleDefinition {
  roleId: string;
  roleName: string;
  roleFamily: string;
  description: string;
  capabilities: Capability[];
}

// ============================================================
// CAPABILITY REGISTRY
// ============================================================
export const CAPABILITY_REGISTRY: Record<string, RoleDefinition> = {

  // ──────────────────────────────────────────
  // AI / ML
  // ──────────────────────────────────────────
  'ai-engineer': {
    roleId: 'ai-engineer',
    roleName: 'AI Engineer',
    roleFamily: 'AI/ML',
    description: 'Builds and deploys AI/ML systems in production environments.',
    capabilities: [
      {
        id: 'programming', name: 'Programming Foundations', description: 'Core programming skills for AI/ML', importance: 10,
        skills: [
          { skillId: 'python', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'git', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'sql', requiredLevel: 60, importance: 7, prerequisites: [] },
        ]
      },
      {
        id: 'data-skills', name: 'Data Skills', description: 'Working with data at scale', importance: 9,
        skills: [
          { skillId: 'numpy-pandas', requiredLevel: 75, importance: 9, prerequisites: ['python'] },
          { skillId: 'statistics', requiredLevel: 70, importance: 9, prerequisites: [] },
          { skillId: 'feature-engineering', requiredLevel: 65, importance: 8, prerequisites: ['numpy-pandas'] },
          { skillId: 'data-viz', requiredLevel: 60, importance: 6, prerequisites: [] },
        ]
      },
      {
        id: 'ml-core', name: 'Machine Learning', description: 'Core ML theory and practice', importance: 10,
        skills: [
          { skillId: 'machine-learning', requiredLevel: 75, importance: 10, prerequisites: ['statistics', 'python'] },
          { skillId: 'model-evaluation', requiredLevel: 70, importance: 9, prerequisites: ['machine-learning'] },
          { skillId: 'deep-learning', requiredLevel: 70, importance: 9, prerequisites: ['machine-learning'] },
          { skillId: 'pytorch', requiredLevel: 65, importance: 8, prerequisites: ['deep-learning'] },
        ]
      },
      {
        id: 'production-ml', name: 'Production ML Engineering', description: 'Deploying and operating ML systems', importance: 9,
        skills: [
          { skillId: 'api-design', requiredLevel: 70, importance: 9, prerequisites: ['python'] },
          { skillId: 'docker', requiredLevel: 65, importance: 9, prerequisites: [] },
          { skillId: 'cloud', requiredLevel: 65, importance: 8, prerequisites: [] },
          { skillId: 'mlops', requiredLevel: 60, importance: 8, prerequisites: ['docker', 'machine-learning'] },
          { skillId: 'monitoring', requiredLevel: 55, importance: 7, prerequisites: ['mlops'] },
        ]
      },
      {
        id: 'engineering', name: 'Engineering Practices', description: 'Quality engineering habits', importance: 7,
        skills: [
          { skillId: 'testing', requiredLevel: 60, importance: 7, prerequisites: [] },
          { skillId: 'system-design', requiredLevel: 55, importance: 7, prerequisites: [] },
          { skillId: 'communication', requiredLevel: 60, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },

  'ml-engineer': {
    roleId: 'ml-engineer',
    roleName: 'Machine Learning Engineer',
    roleFamily: 'AI/ML',
    description: 'Specializes in training and deploying ML models at scale.',
    capabilities: [
      {
        id: 'programming', name: 'Programming', description: 'Core programming', importance: 10,
        skills: [
          { skillId: 'python', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'git', requiredLevel: 70, importance: 7, prerequisites: [] },
          { skillId: 'sql', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      },
      {
        id: 'ml-advanced', name: 'Advanced ML', description: 'Deep ML expertise', importance: 10,
        skills: [
          { skillId: 'machine-learning', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'deep-learning', requiredLevel: 80, importance: 10, prerequisites: ['machine-learning'] },
          { skillId: 'pytorch', requiredLevel: 75, importance: 9, prerequisites: ['deep-learning'] },
          { skillId: 'feature-engineering', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'model-evaluation', requiredLevel: 80, importance: 9, prerequisites: ['machine-learning'] },
        ]
      },
      {
        id: 'deployment', name: 'Model Deployment', description: 'Serving models in production', importance: 9,
        skills: [
          { skillId: 'docker', requiredLevel: 70, importance: 9, prerequisites: [] },
          { skillId: 'cloud', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'mlops', requiredLevel: 70, importance: 9, prerequisites: ['docker', 'machine-learning'] },
          { skillId: 'monitoring', requiredLevel: 65, importance: 8, prerequisites: ['mlops'] },
        ]
      }
    ]
  },

  'data-scientist': {
    roleId: 'data-scientist',
    roleName: 'Data Scientist',
    roleFamily: 'Data',
    description: 'Extracts insights from data using statistical and ML methods.',
    capabilities: [
      {
        id: 'foundations', name: 'Data Science Foundations', description: 'Core analytics skills', importance: 10,
        skills: [
          { skillId: 'python', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'statistics', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'sql', requiredLevel: 80, importance: 9, prerequisites: [] },
          { skillId: 'numpy-pandas', requiredLevel: 80, importance: 9, prerequisites: ['python'] },
          { skillId: 'data-viz', requiredLevel: 75, importance: 8, prerequisites: [] },
        ]
      },
      {
        id: 'ml', name: 'Machine Learning', description: 'Applied ML for insights', importance: 9,
        skills: [
          { skillId: 'machine-learning', requiredLevel: 80, importance: 9, prerequisites: ['statistics'] },
          { skillId: 'feature-engineering', requiredLevel: 75, importance: 9, prerequisites: ['machine-learning'] },
          { skillId: 'model-evaluation', requiredLevel: 75, importance: 9, prerequisites: ['machine-learning'] },
        ]
      },
      {
        id: 'communication', name: 'Communication & Business', description: 'Communicating insights effectively', importance: 8,
        skills: [
          { skillId: 'communication', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'presentation', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'problem-solving', requiredLevel: 75, importance: 8, prerequisites: [] },
        ]
      }
    ]
  },

  'data-engineer': {
    roleId: 'data-engineer',
    roleName: 'Data Engineer',
    roleFamily: 'Data',
    description: 'Builds data pipelines and infrastructure for analytics.',
    capabilities: [
      {
        id: 'programming', name: 'Programming', description: 'Core programming skills', importance: 10,
        skills: [
          { skillId: 'python', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'sql', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'git', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      },
      {
        id: 'data-infra', name: 'Data Infrastructure', description: 'Pipelines, lakes, warehouses', importance: 10,
        skills: [
          { skillId: 'big-data', requiredLevel: 70, importance: 9, prerequisites: ['python'] },
          { skillId: 'database-design', requiredLevel: 80, importance: 10, prerequisites: ['sql'] },
          { skillId: 'cloud', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'docker', requiredLevel: 60, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // SOFTWARE ENGINEERING
  // ──────────────────────────────────────────
  'frontend-engineer': {
    roleId: 'frontend-engineer',
    roleName: 'Frontend Engineer',
    roleFamily: 'Software',
    description: 'Builds user interfaces and interactive web experiences.',
    capabilities: [
      {
        id: 'web-core', name: 'Web Core', description: 'HTML, CSS, JS fundamentals', importance: 10,
        skills: [
          { skillId: 'html-css', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'javascript', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'typescript', requiredLevel: 70, importance: 8, prerequisites: ['javascript'] },
          { skillId: 'git', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      },
      {
        id: 'frameworks', name: 'Frontend Frameworks', description: 'Modern UI frameworks', importance: 9,
        skills: [
          { skillId: 'react', requiredLevel: 75, importance: 9, prerequisites: ['javascript'] },
          { skillId: 'accessibility', requiredLevel: 65, importance: 8, prerequisites: [] },
          { skillId: 'performance', requiredLevel: 65, importance: 8, prerequisites: ['react'] },
        ]
      },
      {
        id: 'engineering', name: 'Engineering Quality', description: 'Testing, APIs, security', importance: 8,
        skills: [
          { skillId: 'testing', requiredLevel: 65, importance: 8, prerequisites: [] },
          { skillId: 'api-design', requiredLevel: 60, importance: 7, prerequisites: [] },
          { skillId: 'system-design', requiredLevel: 55, importance: 6, prerequisites: [] },
        ]
      }
    ]
  },

  'backend-engineer': {
    roleId: 'backend-engineer',
    roleName: 'Backend Engineer',
    roleFamily: 'Software',
    description: 'Builds scalable server-side applications and APIs.',
    capabilities: [
      {
        id: 'programming', name: 'Programming', description: 'Core programming', importance: 10,
        skills: [
          { skillId: 'javascript', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'python', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'sql', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'git', requiredLevel: 70, importance: 7, prerequisites: [] },
        ]
      },
      {
        id: 'backend-core', name: 'Backend Engineering', description: 'Server-side systems', importance: 10,
        skills: [
          { skillId: 'nodejs', requiredLevel: 75, importance: 9, prerequisites: ['javascript'] },
          { skillId: 'api-design', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'database-design', requiredLevel: 75, importance: 9, prerequisites: ['sql'] },
          { skillId: 'system-design', requiredLevel: 65, importance: 8, prerequisites: [] },
        ]
      },
      {
        id: 'infra', name: 'Infrastructure', description: 'Deployment and scaling', importance: 8,
        skills: [
          { skillId: 'docker', requiredLevel: 60, importance: 8, prerequisites: [] },
          { skillId: 'cloud', requiredLevel: 60, importance: 7, prerequisites: [] },
          { skillId: 'testing', requiredLevel: 70, importance: 8, prerequisites: [] },
        ]
      }
    ]
  },

  'fullstack-developer': {
    roleId: 'fullstack-developer',
    roleName: 'Full-Stack Developer',
    roleFamily: 'Software',
    description: 'Builds both frontend and backend components of web applications.',
    capabilities: [
      {
        id: 'frontend', name: 'Frontend', description: 'Client-side skills', importance: 9,
        skills: [
          { skillId: 'html-css', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'javascript', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'typescript', requiredLevel: 65, importance: 8, prerequisites: ['javascript'] },
          { skillId: 'react', requiredLevel: 75, importance: 9, prerequisites: ['javascript'] },
        ]
      },
      {
        id: 'backend', name: 'Backend', description: 'Server-side skills', importance: 9,
        skills: [
          { skillId: 'nodejs', requiredLevel: 70, importance: 9, prerequisites: ['javascript'] },
          { skillId: 'api-design', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'database-design', requiredLevel: 70, importance: 8, prerequisites: ['sql'] },
          { skillId: 'sql', requiredLevel: 70, importance: 8, prerequisites: [] },
        ]
      },
      {
        id: 'infra', name: 'Infrastructure', description: 'Cloud & deployment', importance: 7,
        skills: [
          { skillId: 'docker', requiredLevel: 55, importance: 7, prerequisites: [] },
          { skillId: 'cloud', requiredLevel: 55, importance: 7, prerequisites: [] },
          { skillId: 'git', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'system-design', requiredLevel: 60, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // CLOUD / DEVOPS
  // ──────────────────────────────────────────
  'cloud-engineer': {
    roleId: 'cloud-engineer',
    roleName: 'Cloud Engineer',
    roleFamily: 'Cloud/DevOps',
    description: 'Designs and manages cloud infrastructure and deployments.',
    capabilities: [
      {
        id: 'cloud-core', name: 'Cloud Platforms', description: 'Core cloud skills', importance: 10,
        skills: [
          { skillId: 'cloud', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'linux', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'docker', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'kubernetes', requiredLevel: 65, importance: 8, prerequisites: ['docker'] },
        ]
      },
      {
        id: 'devops', name: 'DevOps Practices', description: 'CI/CD & automation', importance: 9,
        skills: [
          { skillId: 'devops', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'monitoring', requiredLevel: 65, importance: 8, prerequisites: [] },
          { skillId: 'python', requiredLevel: 55, importance: 6, prerequisites: [] },
        ]
      }
    ]
  },

  'devops-engineer': {
    roleId: 'devops-engineer',
    roleName: 'DevOps Engineer',
    roleFamily: 'Cloud/DevOps',
    description: 'Bridges development and operations through automation and tooling.',
    capabilities: [
      {
        id: 'core', name: 'DevOps Core', description: 'Core DevOps skills', importance: 10,
        skills: [
          { skillId: 'linux', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'docker', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'kubernetes', requiredLevel: 70, importance: 9, prerequisites: ['docker'] },
          { skillId: 'devops', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'cloud', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'monitoring', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'python', requiredLevel: 55, importance: 6, prerequisites: [] },
          { skillId: 'git', requiredLevel: 75, importance: 8, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // CYBERSECURITY
  // ──────────────────────────────────────────
  'cybersecurity-engineer': {
    roleId: 'cybersecurity-engineer',
    roleName: 'Cybersecurity Engineer',
    roleFamily: 'Security',
    description: 'Protects systems and networks from cyber threats.',
    capabilities: [
      {
        id: 'foundations', name: 'Security Foundations', description: 'Core security knowledge', importance: 10,
        skills: [
          { skillId: 'networking', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'linux', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'security-fundamentals', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'cryptography', requiredLevel: 70, importance: 9, prerequisites: [] },
        ]
      },
      {
        id: 'applied-security', name: 'Applied Security', description: 'Practical security skills', importance: 9,
        skills: [
          { skillId: 'owasp', requiredLevel: 75, importance: 9, prerequisites: ['security-fundamentals'] },
          { skillId: 'threat-modeling', requiredLevel: 70, importance: 9, prerequisites: ['security-fundamentals'] },
          { skillId: 'cloud-security', requiredLevel: 65, importance: 8, prerequisites: ['cloud'] },
          { skillId: 'siem', requiredLevel: 60, importance: 7, prerequisites: ['networking'] },
          { skillId: 'pen-testing', requiredLevel: 60, importance: 7, prerequisites: ['networking', 'linux'] },
          { skillId: 'python', requiredLevel: 55, importance: 6, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // PRODUCT MANAGEMENT
  // ──────────────────────────────────────────
  'product-manager': {
    roleId: 'product-manager',
    roleName: 'Product Manager',
    roleFamily: 'Product',
    description: 'Defines product vision and drives cross-functional execution.',
    capabilities: [
      {
        id: 'product-core', name: 'Product Management Core', description: 'Essential PM skills', importance: 10,
        skills: [
          { skillId: 'product-strategy', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'user-research', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'roadmapping', requiredLevel: 75, importance: 9, prerequisites: ['product-strategy'] },
          { skillId: 'prioritization', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'product-analytics', requiredLevel: 70, importance: 9, prerequisites: [] },
          { skillId: 'experimentation', requiredLevel: 65, importance: 8, prerequisites: ['product-analytics'] },
        ]
      },
      {
        id: 'leadership', name: 'Leadership & Communication', description: 'Driving cross-functional teams', importance: 9,
        skills: [
          { skillId: 'stakeholder-mgmt', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'communication', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'presentation', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'leadership', requiredLevel: 65, importance: 8, prerequisites: [] },
        ]
      },
      {
        id: 'market', name: 'Market & Business', description: 'Market understanding', importance: 7,
        skills: [
          { skillId: 'market-research', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'business-strategy', requiredLevel: 60, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // UX/UI DESIGN
  // ──────────────────────────────────────────
  'ux-designer': {
    roleId: 'ux-designer',
    roleName: 'UX Designer',
    roleFamily: 'Design',
    description: 'Creates user-centered digital experiences through research and design.',
    capabilities: [
      {
        id: 'research-design', name: 'UX Research & Design', description: 'Core UX skills', importance: 10,
        skills: [
          { skillId: 'user-research', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'interaction-design', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'usability-testing', requiredLevel: 75, importance: 9, prerequisites: ['user-research'] },
          { skillId: 'information-architecture', requiredLevel: 70, importance: 9, prerequisites: [] },
          { skillId: 'figma', requiredLevel: 80, importance: 10, prerequisites: [] },
        ]
      },
      {
        id: 'visual', name: 'Visual & Systems', description: 'Visual design and design systems', importance: 8,
        skills: [
          { skillId: 'visual-design', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'design-systems', requiredLevel: 65, importance: 7, prerequisites: ['visual-design', 'figma'] },
          { skillId: 'communication', requiredLevel: 70, importance: 8, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // BUSINESS / FINANCE
  // ──────────────────────────────────────────
  'business-analyst': {
    roleId: 'business-analyst',
    roleName: 'Business Analyst',
    roleFamily: 'Business',
    description: 'Bridges business needs and technical implementation.',
    capabilities: [
      {
        id: 'analysis', name: 'Analysis & Data', description: 'Data and business analysis', importance: 10,
        skills: [
          { skillId: 'excel', requiredLevel: 80, importance: 9, prerequisites: [] },
          { skillId: 'sql', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'data-analysis-biz', requiredLevel: 80, importance: 10, prerequisites: ['excel'] },
          { skillId: 'power-bi', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'statistics', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      },
      {
        id: 'business', name: 'Business Acumen', description: 'Business domain knowledge', importance: 9,
        skills: [
          { skillId: 'business-strategy', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'communication', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'stakeholder-mgmt', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'presentation', requiredLevel: 75, importance: 8, prerequisites: [] },
          { skillId: 'technical-writing', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },

  'financial-analyst': {
    roleId: 'financial-analyst',
    roleName: 'Financial Analyst',
    roleFamily: 'Finance',
    description: 'Analyzes financial data to support business decisions.',
    capabilities: [
      {
        id: 'finance-core', name: 'Finance Core', description: 'Core finance skills', importance: 10,
        skills: [
          { skillId: 'excel', requiredLevel: 90, importance: 10, prerequisites: [] },
          { skillId: 'financial-modeling', requiredLevel: 80, importance: 10, prerequisites: ['excel'] },
          { skillId: 'accounting', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'statistics', requiredLevel: 70, importance: 8, prerequisites: [] },
          { skillId: 'data-analysis-biz', requiredLevel: 75, importance: 9, prerequisites: ['excel'] },
          { skillId: 'power-bi', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'presentation', requiredLevel: 75, importance: 8, prerequisites: [] },
          { skillId: 'communication', requiredLevel: 70, importance: 8, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // EMBEDDED / HARDWARE
  // ──────────────────────────────────────────
  'embedded-engineer': {
    roleId: 'embedded-engineer',
    roleName: 'Embedded Systems Engineer',
    roleFamily: 'Hardware',
    description: 'Develops software for embedded systems and microcontrollers.',
    capabilities: [
      {
        id: 'embedded-core', name: 'Embedded Core', description: 'Embedded development fundamentals', importance: 10,
        skills: [
          { skillId: 'c-embedded', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'cpp', requiredLevel: 75, importance: 9, prerequisites: ['c-embedded'] },
          { skillId: 'microcontrollers', requiredLevel: 80, importance: 10, prerequisites: ['c-embedded'] },
          { skillId: 'electronics', requiredLevel: 65, importance: 8, prerequisites: [] },
          { skillId: 'rtos', requiredLevel: 65, importance: 8, prerequisites: ['c-embedded', 'microcontrollers'] },
          { skillId: 'linux', requiredLevel: 65, importance: 8, prerequisites: [] },
          { skillId: 'git', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },

  // ──────────────────────────────────────────
  // RESEARCH / EDUCATION
  // ──────────────────────────────────────────
  'researcher': {
    roleId: 'researcher',
    roleName: 'Research Scientist',
    roleFamily: 'Research',
    description: 'Conducts applied or academic research in a specialized domain.',
    capabilities: [
      {
        id: 'research-core', name: 'Research Core', description: 'Research methods and communication', importance: 10,
        skills: [
          { skillId: 'research-methods', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'statistics', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'academic-writing', requiredLevel: 80, importance: 9, prerequisites: [] },
          { skillId: 'python', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'data-viz', requiredLevel: 65, importance: 7, prerequisites: [] },
          { skillId: 'critical-thinking', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'communication', requiredLevel: 75, importance: 9, prerequisites: [] },
        ]
      }
    ]
  },

  'professor': {
    roleId: 'professor',
    roleName: 'Professor / Educator',
    roleFamily: 'Education',
    description: 'Teaches, designs curriculum, and contributes to research.',
    capabilities: [
      {
        id: 'education-core', name: 'Education Core', description: 'Teaching and curriculum skills', importance: 10,
        skills: [
          { skillId: 'pedagogy', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'curriculum-design', requiredLevel: 75, importance: 9, prerequisites: ['pedagogy'] },
          { skillId: 'research-methods', requiredLevel: 75, importance: 9, prerequisites: [] },
          { skillId: 'academic-writing', requiredLevel: 80, importance: 9, prerequisites: [] },
          { skillId: 'communication', requiredLevel: 85, importance: 10, prerequisites: [] },
          { skillId: 'presentation', requiredLevel: 80, importance: 9, prerequisites: [] },
          { skillId: 'critical-thinking', requiredLevel: 80, importance: 10, prerequisites: [] },
          { skillId: 'leadership', requiredLevel: 65, importance: 7, prerequisites: [] },
        ]
      }
    ]
  },
};

// ──────────────────────────────────────────
// HELPER: Get all skills for a role (flat, deduplicated)
// ──────────────────────────────────────────
export function getSkillsForRole(roleId: string): SkillRequirement[] {
  const role = CAPABILITY_REGISTRY[roleId];
  if (!role) return [];

  const seen = new Set<string>();
  const skills: SkillRequirement[] = [];

  for (const cap of role.capabilities) {
    for (const skill of cap.skills) {
      if (!seen.has(skill.skillId)) {
        seen.add(skill.skillId);
        skills.push(skill);
      }
    }
  }

  return skills;
}

// ──────────────────────────────────────────
// HELPER: Get available roles list for the UI
// ──────────────────────────────────────────
export function getAllRoles(): Array<{ id: string; name: string; family: string }> {
  return Object.values(CAPABILITY_REGISTRY).map(r => ({
    id: r.roleId,
    name: r.roleName,
    family: r.roleFamily,
  }));
}

// ──────────────────────────────────────────
// ROLE FAMILIES for grouping in the UI
// ──────────────────────────────────────────
export const ROLE_FAMILIES: Record<string, string[]> = {
  'AI/ML': ['ai-engineer', 'ml-engineer', 'data-scientist', 'data-engineer'],
  'Software': ['frontend-engineer', 'backend-engineer', 'fullstack-developer'],
  'Cloud/DevOps': ['cloud-engineer', 'devops-engineer'],
  'Security': ['cybersecurity-engineer'],
  'Product': ['product-manager'],
  'Design': ['ux-designer'],
  'Business': ['business-analyst', 'financial-analyst'],
  'Hardware': ['embedded-engineer'],
  'Research/Education': ['researcher', 'professor'],
};

// Human readable names for families
export const ROLE_FAMILY_LABELS: Record<string, string> = {
  'AI/ML': '🤖 AI / Machine Learning',
  'Software': '💻 Software Engineering',
  'Cloud/DevOps': '☁️ Cloud & DevOps',
  'Security': '🔒 Cybersecurity',
  'Product': '📦 Product Management',
  'Design': '🎨 UX / UI Design',
  'Business': '📊 Business & Finance',
  'Hardware': '🔌 Embedded & Hardware',
  'Research/Education': '🎓 Research & Education',
};
