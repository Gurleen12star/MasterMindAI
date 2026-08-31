export interface LogoPath {
  title: string;
  path?: string;
  type: 'path' | 'file';
  file?: string;
}

export const logoPaths: LogoPath[] = [
  {
    title: 'Firecrawl',
    type: 'file',
    file: '/Firecrawl-logo.svg',
  },
  {
    title: 'Bolt',
    type: 'file', 
    file: '/bolt.png',
  },
  {
    title: 'Mania Animation',
    type: 'file',
    file: '/maniamanimation_logo.svg',
  },
  {
    title: 'Supabase',
    type: 'file',
    file: '/supabase-logo-wordmark--light.svg',
  },
  {
    title: 'ElevenLabs',
    type: 'file',
    file: '/elevenlabs-logo-white.svg',
  },
  {
    title: 'Mem0ai',
    type: 'file',
    file: '/mem0ai-logo.png',
  },
  
  {
    title: 'netlify',
    type: 'file',
    file: '/logo-netlify-small-fullcolor-lightmode.svg',
  },
  {
    title: 'Tavus',
    type: 'file',
    file: '/Tavus-logo.svg',
  }
   // {
  //   title: 'Cisco',
  //   type: 'file',
  //   file: '/logo-netlify-small-fullcolor-lightmode.svg',
  // }
  
];

export const shuffle = (array: LogoPath[]): LogoPath[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};