# Animation Studio Backend Integration Setup

This guide explains how to set up the Animation Studio page to work with the Manim video generation backend using Appwrite and GitHub Actions.

## Prerequisites

1. **Appwrite Project**: Set up an Appwrite project with the required database and storage
2. **GitHub Repository**: A repository with Manim video generation workflow
3. **GitHub Personal Access Token**: With workflow and repo permissions

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```bash
cp .env.example .env.local
```

### Required Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_APPWRITE_ENDPOINT` | Appwrite server endpoint | `https://cloud.appwrite.io/v1` |
| `VITE_APPWRITE_PROJECT_ID` | Your Appwrite project ID | `64f2a8b4c123456789` |
| `VITE_GITHUB_REPO_OWNER` | GitHub repository owner | `username` |
| `VITE_GITHUB_REPO_NAME` | GitHub repository name | `manimAnimationAgent` |
| `VITE_GH_PAT` | GitHub Personal Access Token | `ghp_xxxxx` |

### Optional Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_GITHUB_WORKFLOW_FILENAME` | Workflow file name | `video-renderer.yml` |
| `VITE_BACKEND_URL` | Backend service URL | `http://localhost:8000` |
| `VITE_GITHUB_API_TIMEOUT_MS` | GitHub API timeout | `30000` |

## Appwrite Setup

### 1. Create Database

1. Go to your Appwrite console
2. Navigate to Databases
3. Create a new database with ID: `video_metadata`

### 2. Create Collections

#### Videos Collection (`videos`)
Create collection with ID: `videos`

**Attributes:**
- `topic` (String, required) - Video topic
- `description` (String, optional) - Video description  
- `status` (String, required) - Status: `queued`, `planning`, `rendering`, `completed`, `failed`
- `progress` (Integer, optional) - Progress percentage (0-100)
- `scene_count` (Integer, required) - Number of scenes
- `combined_video_url` (String, optional) - Final video file ID
- `error_message` (String, optional) - Error message if failed
- `created_at` (String, required) - Creation timestamp
- `updated_at` (String, required) - Last update timestamp

**Permissions:**
- Read: `any`
- Create: `any` 
- Update: `any`
- Delete: `any`

#### Scenes Collection (`scenes`)
Create collection with ID: `scenes`

**Attributes:**
- `video_id` (String, required) - Reference to video document
- `scene_number` (Integer, required) - Scene order number
- `status` (String, required) - Status: `planned`, `coded`, `rendered`, `failed`
- `video_url` (String, optional) - Scene video file ID
- `duration` (Float, optional) - Scene duration in seconds
- `created_at` (String, required) - Creation timestamp
- `updated_at` (String, required) - Last update timestamp

**Permissions:**
- Read: `any`
- Create: `any`
- Update: `any`
- Delete: `any`

### 3. Create Storage Buckets

#### Final Videos Bucket
- **Bucket ID**: `final_videos`
- **File Security**: Enabled
- **Permissions**: Read access for `any`

#### Scene Videos Bucket  
- **Bucket ID**: `scene_videos`
- **File Security**: Enabled
- **Permissions**: Read access for `any`

## GitHub Setup

### 1. Create Personal Access Token

1. Go to GitHub Settings > Developer settings > Personal access tokens
2. Generate new token (classic)
3. Select scopes:
   - `repo` (Full control of private repositories)
   - `workflow` (Update GitHub Action workflows)
4. Copy the token to `VITE_GH_PAT` environment variable

### 2. Create GitHub Workflow

Create `.github/workflows/video-renderer.yml` in your GitHub repository:

```yaml
name: Manim Video Renderer

on:
  workflow_dispatch:
    inputs:
      video_id:
        description: 'Video ID'
        required: true
        type: string
      topic:
        description: 'Video topic'
        required: true
        type: string
      description:
        description: 'Video description'
        required: false
        type: string
      subject:
        description: 'Subject area'
        required: false
        type: string
        default: 'general'
      difficulty_level:
        description: 'Difficulty level'
        required: false
        type: string
        default: 'intermediate'

jobs:
  render-video:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v3
      
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.9'
      
      - name: Install dependencies
        run: |
          pip install manim
          pip install appwrite
          # Add other dependencies
      
      - name: Generate and render video
        env:
          APPWRITE_ENDPOINT: ${{ secrets.APPWRITE_ENDPOINT }}
          APPWRITE_PROJECT_ID: ${{ secrets.APPWRITE_PROJECT_ID }}
          APPWRITE_API_KEY: ${{ secrets.APPWRITE_API_KEY }}
        run: |
          python render_video.py \
            --video-id "${{ github.event.inputs.video_id }}" \
            --topic "${{ github.event.inputs.topic }}" \
            --description "${{ github.event.inputs.description }}" \
            --subject "${{ github.event.inputs.subject }}" \
            --difficulty "${{ github.event.inputs.difficulty_level }}"
```

### 3. Add Repository Secrets

In your GitHub repository, go to Settings > Secrets and variables > Actions, and add:

- `APPWRITE_ENDPOINT`: Your Appwrite endpoint
- `APPWRITE_PROJECT_ID`: Your Appwrite project ID  
- `APPWRITE_API_KEY`: Your Appwrite API key (server-side)

## Usage

### Frontend Integration

The AnimationStudioPage now includes:

1. **Video Generation**: Creates Appwrite document and triggers GitHub workflow
2. **Real-time Updates**: Subscribes to Appwrite real-time updates for video status
3. **History Management**: Lists completed videos from Appwrite storage
4. **Progress Tracking**: Shows current status and progress for rendering videos

### API Functions

- `generateVideo()`: Creates video document and triggers GitHub workflow
- `checkVideoStatus()`: Gets current status from Appwrite document
- `useVideoStatus()`: React hook for real-time status updates

### Data Flow

1. User submits animation request
2. Frontend creates video document in Appwrite
3. Frontend triggers GitHub workflow with video parameters
4. GitHub workflow renders video and updates Appwrite documents
5. Frontend receives real-time updates via Appwrite subscriptions
6. Completed videos are uploaded to Appwrite storage

## Troubleshooting

### Common Issues

1. **"Missing Appwrite configuration"**
   - Verify environment variables are set correctly
   - Check Appwrite project ID and endpoint

2. **"GitHub workflow trigger failed"**  
   - Verify GitHub Personal Access Token permissions
   - Check repository owner/name are correct
   - Ensure workflow file exists

3. **"Real-time updates not working"**
   - Verify Appwrite project has realtime enabled
   - Check browser console for connection errors

### Testing Connection

Use the test connection function:

```typescript
import { testConnection } from './lib/appwrite';

const test = await testConnection();
console.log(test);
```

## Security Notes

- Never expose GitHub Personal Access Token in frontend code
- Use Appwrite permissions to control access to documents
- Consider implementing user authentication for production use
- GitHub workflows should validate inputs and handle errors gracefully

## Next Steps

1. Implement the actual Manim rendering script (`render_video.py`)
2. Add error handling and retry logic
3. Implement user authentication and authorization
4. Add video thumbnails and metadata
5. Optimize for production deployment 