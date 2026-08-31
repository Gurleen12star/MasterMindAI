import fs from 'fs';

const criticalFiles = [
  'src/components/admin/AdminGuard.tsx',
  'src/components/dashboard/ProfileGuard.tsx',
  'src/components/dashboard/Sidebar.tsx',
  'src/lib/appwrite.ts',
  'src/lib/api.ts',
  'src/pages/dashboard/ProfileSetupPage.tsx',
  'src/pages/dashboard/RoadmapGeneratorPage.tsx',
  'src/pages/dashboard/ProfilePage.tsx',
  'src/pages/dashboard/DashboardPage.tsx'
];

for (const file of criticalFiles) {
  try {
    let content = fs.readFileSync(file, 'utf8');
    if (content.startsWith('// @ts-nocheck\n')) {
      content = content.replace('// @ts-nocheck\n', '');
      fs.writeFileSync(file, content);
      console.log(`Removed @ts-nocheck from ${file}`);
    }
  } catch (e) {
    console.error(`Error processing ${file}: ${e.message}`);
  }
}
