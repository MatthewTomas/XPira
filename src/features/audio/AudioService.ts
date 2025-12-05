import { Howl } from 'howler';

// Audio manager for game sounds
class AudioService {
  private sounds: Map<string, Howl> = new Map();
  private sfxVolume = 0.5;

  constructor() {
    // Pre-load common sounds using Web Audio API generated tones
    this.createToneSound('click', 440, 0.1, 'sine');
    this.createToneSound('success', 880, 0.2, 'sine');
    this.createToneSound('error', 220, 0.3, 'sawtooth');
    this.createToneSound('speak-start', 660, 0.15, 'sine');
    this.createToneSound('speak-end', 550, 0.15, 'sine');
    this.createToneSound('npc-talk', 330, 0.1, 'triangle');
    this.createToneSound('footstep', 100, 0.05, 'square');
    this.createToneSound('level-up', 523.25, 0.4, 'sine'); // C5
  }

  private createToneSound(
    name: string, 
    frequency: number, 
    duration: number, 
    type: OscillatorType
  ) {
    // Create a data URL for a simple tone
    const audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    const sampleRate = audioContext.sampleRate;
    const samples = duration * sampleRate;
    const buffer = audioContext.createBuffer(1, samples, sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < samples; i++) {
      const t = i / sampleRate;
      let value = 0;
      
      switch (type) {
        case 'sine':
          value = Math.sin(2 * Math.PI * frequency * t);
          break;
        case 'square':
          value = Math.sin(2 * Math.PI * frequency * t) > 0 ? 1 : -1;
          break;
        case 'sawtooth':
          value = 2 * (t * frequency - Math.floor(t * frequency + 0.5));
          break;
        case 'triangle':
          value = Math.abs(2 * (t * frequency - Math.floor(t * frequency + 0.5))) * 2 - 1;
          break;
      }
      
      // Apply envelope (fade in/out)
      const envelope = Math.min(1, Math.min(i / (sampleRate * 0.01), (samples - i) / (sampleRate * 0.01)));
      data[i] = value * envelope * 0.3;
    }

    // Convert to WAV blob
    const wavBlob = this.bufferToWav(buffer);
    const url = URL.createObjectURL(wavBlob);

    this.sounds.set(name, new Howl({
      src: [url],
      format: ['wav'],
      volume: this.sfxVolume,
    }));

    audioContext.close();
  }

  private bufferToWav(buffer: AudioBuffer): Blob {
    const numChannels = buffer.numberOfChannels;
    const sampleRate = buffer.sampleRate;
    const format = 1; // PCM
    const bitDepth = 16;
    const bytesPerSample = bitDepth / 8;
    const blockAlign = numChannels * bytesPerSample;
    const data = buffer.getChannelData(0);
    const samples = data.length;
    const dataSize = samples * blockAlign;
    const bufferSize = 44 + dataSize;
    const arrayBuffer = new ArrayBuffer(bufferSize);
    const view = new DataView(arrayBuffer);

    // WAV header
    const writeString = (offset: number, str: string) => {
      for (let i = 0; i < str.length; i++) {
        view.setUint8(offset + i, str.charCodeAt(i));
      }
    };

    writeString(0, 'RIFF');
    view.setUint32(4, bufferSize - 8, true);
    writeString(8, 'WAVE');
    writeString(12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, format, true);
    view.setUint16(22, numChannels, true);
    view.setUint32(24, sampleRate, true);
    view.setUint32(28, sampleRate * blockAlign, true);
    view.setUint16(32, blockAlign, true);
    view.setUint16(34, bitDepth, true);
    writeString(36, 'data');
    view.setUint32(40, dataSize, true);

    // Write audio data
    let offset = 44;
    for (let i = 0; i < samples; i++) {
      const sample = Math.max(-1, Math.min(1, data[i]));
      view.setInt16(offset, sample * 0x7FFF, true);
      offset += 2;
    }

    return new Blob([arrayBuffer], { type: 'audio/wav' });
  }

  play(soundName: string) {
    const sound = this.sounds.get(soundName);
    if (sound) {
      sound.play();
    }
  }

  setVolume(volume: number) {
    this.sfxVolume = volume;
    this.sounds.forEach((sound) => {
      sound.volume(volume);
    });
  }
}

// Singleton
let audioServiceInstance: AudioService | null = null;

export function getAudioService(): AudioService {
  if (!audioServiceInstance) {
    audioServiceInstance = new AudioService();
  }
  return audioServiceInstance;
}

export function playSound(name: string) {
  getAudioService().play(name);
}
