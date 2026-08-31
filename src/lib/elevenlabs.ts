import { ElevenLabsClient } from 'elevenlabs';

const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY;

if (!apiKey) {
  console.warn('ElevenLabs API key not found. Audio generation will not work.');
}

const elevenlabs = apiKey ? new ElevenLabsClient({ apiKey }) : null;

export interface TextToSpeechOptions {
  text: string;
  voiceId?: string;
  modelId?: string;
  outputFormat?: string;
}

export async function generateAudio(options: TextToSpeechOptions): Promise<string> {
  if (!elevenlabs) {
    throw new Error('ElevenLabs API key not configured');
  }

  const {
    text,
    voiceId = 'JBFqnCBsd6RMkjVDRZzb', // Default voice (George)
    modelId = 'eleven_v3',
    outputFormat = 'mp3_44100_128'
  } = options;

  try {
    console.log('Generating audio with ElevenLabs...');
    
    const audioStream = await elevenlabs.textToSpeech.convert(voiceId, {
      text,
      model_id: modelId,
      output_format: outputFormat,
    });

    // Convert the stream to a blob and create a URL
    const chunks: Uint8Array[] = [];
    const reader = audioStream.getReader();
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      chunks.push(value);
    }
    
    const audioBlob = new Blob(chunks, { type: 'audio/mpeg' });
    const audioUrl = URL.createObjectURL(audioBlob);
    
    console.log('Audio generated successfully');
    return audioUrl;
  } catch (error) {
    console.error('Error generating audio with ElevenLabs:', error);
    const errorMessage = error instanceof Error ? error.message : String(error);
    throw new Error(`Failed to generate audio: ${errorMessage}`);
  }
}

export const AVAILABLE_VOICES = [
  { id: 'JBFqnCBsd6RMkjVDRZzb', name: 'George', description: 'British male, middle-aged' },
  { id: 'EXAVITQu4vr4xnSDxMaL', name: 'Bella', description: 'American female, young' },
  { id: 'ErXwobaYiN019PkySvjV', name: 'Antoni', description: 'American male, young' },
  { id: 'VR6AewLTigWG4xSOukaG', name: 'Arnold', description: 'American male, middle-aged' },
  { id: 'pNInz6obpgDQGcFmaJgB', name: 'Adam', description: 'American male, middle-aged' },
  { id: 'yoZ06aMxZJJ28mfd3POQ', name: 'Sam', description: 'American male, young' },
];