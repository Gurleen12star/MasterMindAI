import { LearningPath } from '@/types/roadmap';

/**
 * Converts a structured LearningPath domain model into a Mermaid flowchart string.
 * This is solely for visualization and serves as an adapter, ensuring Mermaid
 * rendering is isolated from the core data model.
 */
export function convertLearningPathToMermaid(path: LearningPath): string {
  if (!path || !path.milestones || path.milestones.length === 0) {
    return 'mindmap\n  root((No milestones found))';
  }

  const safeText = (text: string) => {
    // Mermaid mindmap is very strict about special characters inside labels
    // We use markdown syntax for labels: `node["My Label"]` or just `node[My Label]`
    // Best is to remove brackets and parens to avoid parsing errors
    return text.replace(/[\[\]"(){}]/g, '').replace(/\n/g, ' ').trim();
  };

  let mermaidCode = 'mindmap\n';
  mermaidCode += `  root(("${safeText(path.goal)}"))\n`;

  // Build an adjacency list to represent the tree
  const childrenMap: Record<string, any[]> = { root: [] };
  
  // Initialize map
  path.milestones.forEach(node => {
    childrenMap[node.id] = [];
  });

  // Populate children
  path.milestones.forEach(node => {
    // If no prereq, it's a top-level child (direct child of root)
    const parentId = node.prerequisites && node.prerequisites.length > 0 ? node.prerequisites[0] : 'root';
    
    // Safety check in case AI returned a prereq ID that doesn't exist
    if (childrenMap[parentId]) {
      childrenMap[parentId].push(node);
    } else {
      childrenMap['root'].push(node);
    }
  });

  // Recursive function to generate mindmap nodes with correct indentation
  const generateTree = (parentId: string, depth: number) => {
    const children = childrenMap[parentId] || [];
    const indent = '  '.repeat(depth + 1); // 2 spaces per depth level

    children.forEach(node => {
      // Create the node string
      // Format: ID["Title<br/>Description"]
      const title = safeText(node.title);
      let desc = safeText(node.description);
      
      // Add visual markers based on content
      if (desc.includes('YT:')) desc = '📺 ' + desc;
      else if (desc.includes('Docs:')) desc = '📄 ' + desc;
      else if (desc.includes('Code:')) desc = '💻 ' + desc;

      const label = `${title}\\n${desc}`;
      
      // Node styling class binding based on status or difficulty
      let shapeOpen = '[';
      let shapeClose = ']';
      if (node.difficulty === 'advanced') {
        shapeOpen = '(('; shapeClose = '))'; // Circle
      } else if (node.difficulty === 'intermediate') {
        shapeOpen = '{{'; shapeClose = '}}'; // Hexagon
      }

      mermaidCode += `${indent}${node.id.replace(/-/g, '_')}${shapeOpen}"${label}"${shapeClose}\n`;

      // Recurse for children
      generateTree(node.id, depth + 1);
    });
  };

  // Start generation from root
  generateTree('root', 1);

  return mermaidCode;
}
