import fs from 'fs';

const replacements = [
  {
    file: 'src/components/admin/AdminGuard.tsx',
    find: 'import { Outlet, Navigate } from \'react-router-dom\';',
    replace: 'import { Outlet } from \'react-router-dom\';'
  },
  {
    file: 'src/components/dashboard/ProfileGuard.tsx',
    find: 'const { profile, loading } = useProfile();',
    replace: 'const { loading } = useProfile();'
  },
  {
    file: 'src/components/dashboard/Sidebar.tsx',
    find: 'const { user, profile } = useAuth();',
    replace: 'const { profile } = useAuth();'
  },
  {
    file: 'src/components/dashboard/Sidebar.tsx',
    find: 'Compass,',
    replace: ''
  },
  {
    file: 'src/components/dashboard/Sidebar.tsx',
    find: 'Folder,',
    replace: ''
  },
  {
    file: 'src/components/dashboard/Sidebar.tsx',
    find: 'Plus,',
    replace: ''
  },
  {
    file: 'src/lib/api.ts',
    find: 'const client = new Client()',
    replace: '// const client = new Client()'
  },
  {
    file: 'src/lib/appwrite.ts',
    find: 'import { Client, Databases, Storage, ID } from \'appwrite\';',
    replace: 'import { Client, Databases, Storage } from \'appwrite\';'
  },
  {
    file: 'src/pages/dashboard/DashboardPage.tsx',
    find: 'import { Link, Navigate } from \'react-router-dom\';',
    replace: 'import { Link } from \'react-router-dom\';'
  },
  {
    file: 'src/pages/dashboard/DashboardPage.tsx',
    find: 'const { user, profile } = useAuth();',
    replace: 'const { profile } = useAuth();'
  },
  {
    file: 'src/pages/dashboard/ProfilePage.tsx',
    find: 'BookOpen,',
    replace: ''
  },
  {
    file: 'src/pages/dashboard/ProfilePage.tsx',
    find: 'const { user, profile } = useAuth();',
    replace: 'const { profile } = useAuth();'
  },
  {
    file: 'src/pages/dashboard/ProfileSetupPage.tsx',
    find: 'BookOpen,',
    replace: ''
  },
  {
    file: 'src/pages/dashboard/ProfileSetupPage.tsx',
    find: 'Clock,',
    replace: ''
  },
  {
    file: 'src/pages/dashboard/RoadmapGeneratorPage.tsx',
    find: 'const [currentRoadmap, setCurrentRoadmap] = useState<string | null>(null);',
    replace: ''
  },
  {
    file: 'src/pages/dashboard/RoadmapGeneratorPage.tsx',
    find: 'setCurrentRoadmap(null);',
    replace: ''
  },
  {
    file: 'src/pages/dashboard/RoadmapGeneratorPage.tsx',
    find: 'setCurrentRoadmap(mermaidCode);',
    replace: ''
  },
  {
    file: 'src/pages/dashboard/RoadmapGeneratorPage.tsx',
    find: 'setCurrentRoadmap(DEFAULT_MERMAID_CODE);',
    replace: ''
  }
];

for (const rep of replacements) {
  try {
    let content = fs.readFileSync(rep.file, 'utf8');
    content = content.replace(rep.find, rep.replace);
    fs.writeFileSync(rep.file, content);
    console.log(`Replaced in ${rep.file}`);
  } catch (e) {
    console.error(`Error in ${rep.file}:`, e.message);
  }
}
