/**
 * Audio Registry
 * 
 * Centralized system for all audio in XPira.
 * Supports original compositions and public domain music.
 * 
 * Audio ID format: category.name
 * Examples: music.menu, sfx.click, ambient.forest
 */

export type AudioType = 'music' | 'sfx' | 'ambient' | 'voice';
export type AudioFormat = 'mp3' | 'ogg' | 'wav';

export interface AudioAsset {
  id: string;
  type: AudioType;
  name: string;
  // Source info
  src?: string;
  sources?: { format: AudioFormat; src: string }[];
  // Metadata
  composer?: string;
  license: 'original' | 'public-domain' | 'cc0' | 'cc-by' | 'licensed';
  attribution?: string;
  // Playback settings
  defaultVolume?: number; // 0-1
  loop?: boolean;
  fadeInDuration?: number; // ms
  fadeOutDuration?: number; // ms
  // For sprite sheets (multiple sounds in one file)
  sprite?: { start: number; duration: number };
}

// ============================================================================
// MUSIC DEFINITIONS
// Original compositions + public domain classical
// ============================================================================

const MUSIC_ASSETS: Record<string, AudioAsset> = {
  // === ORIGINAL COMPOSITIONS (placeholders) ===
  'music.menu': {
    id: 'music.menu',
    type: 'music',
    name: 'Welcome to XPira',
    license: 'original',
    composer: 'TBD',
    loop: true,
    defaultVolume: 0.5,
    fadeInDuration: 1000,
    // src: '/audio/music/menu.mp3', // Add when created
  },
  'music.world': {
    id: 'music.world',
    type: 'music',
    name: 'Village Life',
    license: 'original',
    composer: 'TBD',
    loop: true,
    defaultVolume: 0.4,
    fadeInDuration: 2000,
  },
  'music.learning': {
    id: 'music.learning',
    type: 'music',
    name: 'Curious Mind',
    license: 'original',
    composer: 'TBD',
    loop: true,
    defaultVolume: 0.3,
  },
  'music.success': {
    id: 'music.success',
    type: 'music',
    name: 'Victory Fanfare',
    license: 'original',
    composer: 'TBD',
    loop: false,
    defaultVolume: 0.6,
  },
  
  // === PUBLIC DOMAIN CLASSICAL ===
  'music.classical.chopin.scherzo2': {
    id: 'music.classical.chopin.scherzo2',
    type: 'music',
    name: 'Scherzo No. 2 in B-flat minor, Op. 31',
    license: 'public-domain',
    composer: 'Frédéric Chopin',
    attribution: 'Composed 1837, public domain',
    loop: false,
    defaultVolume: 0.5,
    // src: '/audio/music/classical/chopin-scherzo-2.mp3',
  },
  'music.classical.chopin.nocturne9': {
    id: 'music.classical.chopin.nocturne9',
    type: 'music',
    name: 'Nocturne in E-flat major, Op. 9 No. 2',
    license: 'public-domain',
    composer: 'Frédéric Chopin',
    attribution: 'Composed 1830-1832, public domain',
    loop: true,
    defaultVolume: 0.4,
  },
  'music.classical.debussy.clair': {
    id: 'music.classical.debussy.clair',
    type: 'music',
    name: 'Clair de Lune',
    license: 'public-domain',
    composer: 'Claude Debussy',
    attribution: 'Composed 1890, public domain',
    loop: true,
    defaultVolume: 0.4,
  },
  'music.classical.satie.gymnopedie1': {
    id: 'music.classical.satie.gymnopedie1',
    type: 'music',
    name: 'Gymnopédie No. 1',
    license: 'public-domain',
    composer: 'Erik Satie',
    attribution: 'Composed 1888, public domain',
    loop: true,
    defaultVolume: 0.4,
  },
  'music.classical.bach.cello1': {
    id: 'music.classical.bach.cello1',
    type: 'music',
    name: 'Cello Suite No. 1 in G major, Prélude',
    license: 'public-domain',
    composer: 'Johann Sebastian Bach',
    attribution: 'Composed c. 1717-1723, public domain',
    loop: true,
    defaultVolume: 0.4,
  },
};

// ============================================================================
// SOUND EFFECTS
// ============================================================================

const SFX_ASSETS: Record<string, AudioAsset> = {
  // UI sounds
  'sfx.ui.click': {
    id: 'sfx.ui.click',
    type: 'sfx',
    name: 'Button Click',
    license: 'original',
    defaultVolume: 0.5,
  },
  'sfx.ui.hover': {
    id: 'sfx.ui.hover',
    type: 'sfx',
    name: 'Button Hover',
    license: 'original',
    defaultVolume: 0.3,
  },
  'sfx.ui.open': {
    id: 'sfx.ui.open',
    type: 'sfx',
    name: 'Menu Open',
    license: 'original',
    defaultVolume: 0.4,
  },
  'sfx.ui.close': {
    id: 'sfx.ui.close',
    type: 'sfx',
    name: 'Menu Close',
    license: 'original',
    defaultVolume: 0.4,
  },
  
  // Game sounds
  'sfx.game.xp': {
    id: 'sfx.game.xp',
    type: 'sfx',
    name: 'XP Gained',
    license: 'original',
    defaultVolume: 0.6,
  },
  'sfx.game.levelup': {
    id: 'sfx.game.levelup',
    type: 'sfx',
    name: 'Level Up',
    license: 'original',
    defaultVolume: 0.7,
  },
  'sfx.game.coin': {
    id: 'sfx.game.coin',
    type: 'sfx',
    name: 'Coin Collect',
    license: 'original',
    defaultVolume: 0.5,
  },
  'sfx.game.unlock': {
    id: 'sfx.game.unlock',
    type: 'sfx',
    name: 'Unlock',
    license: 'original',
    defaultVolume: 0.6,
  },
  
  // Movement
  'sfx.move.step': {
    id: 'sfx.move.step',
    type: 'sfx',
    name: 'Footstep',
    license: 'original',
    defaultVolume: 0.3,
  },
  'sfx.move.water': {
    id: 'sfx.move.water',
    type: 'sfx',
    name: 'Water Splash',
    license: 'original',
    defaultVolume: 0.4,
  },
  
  // Speech/dialogue
  'sfx.dialogue.start': {
    id: 'sfx.dialogue.start',
    type: 'sfx',
    name: 'Dialogue Start',
    license: 'original',
    defaultVolume: 0.4,
  },
  'sfx.dialogue.blip': {
    id: 'sfx.dialogue.blip',
    type: 'sfx',
    name: 'Text Blip',
    license: 'original',
    defaultVolume: 0.2,
  },
  'sfx.speech.correct': {
    id: 'sfx.speech.correct',
    type: 'sfx',
    name: 'Correct Answer',
    license: 'original',
    defaultVolume: 0.6,
  },
  'sfx.speech.incorrect': {
    id: 'sfx.speech.incorrect',
    type: 'sfx',
    name: 'Try Again',
    license: 'original',
    defaultVolume: 0.4,
  },
};

// ============================================================================
// AMBIENT SOUNDS
// ============================================================================

const AMBIENT_ASSETS: Record<string, AudioAsset> = {
  'ambient.village': {
    id: 'ambient.village',
    type: 'ambient',
    name: 'Village Ambience',
    license: 'original',
    loop: true,
    defaultVolume: 0.2,
  },
  'ambient.forest': {
    id: 'ambient.forest',
    type: 'ambient',
    name: 'Forest Sounds',
    license: 'original',
    loop: true,
    defaultVolume: 0.25,
  },
  'ambient.market': {
    id: 'ambient.market',
    type: 'ambient',
    name: 'Busy Marketplace',
    license: 'original',
    loop: true,
    defaultVolume: 0.3,
  },
  'ambient.rain': {
    id: 'ambient.rain',
    type: 'ambient',
    name: 'Rain',
    license: 'original',
    loop: true,
    defaultVolume: 0.3,
  },
  'ambient.fire': {
    id: 'ambient.fire',
    type: 'ambient',
    name: 'Crackling Fire',
    license: 'original',
    loop: true,
    defaultVolume: 0.25,
  },
};

// ============================================================================
// COMBINED REGISTRY
// ============================================================================

const ALL_AUDIO: Record<string, AudioAsset> = {
  ...MUSIC_ASSETS,
  ...SFX_ASSETS,
  ...AMBIENT_ASSETS,
};

// ============================================================================
// AUDIO REGISTRY CLASS
// ============================================================================

class AudioRegistryClass {
  private audio: Map<string, AudioAsset> = new Map();
  private loadedAudio: Map<string, HTMLAudioElement> = new Map();
  private currentMusic: HTMLAudioElement | null = null;
  private currentMusicId: string | null = null;
  private masterVolume: number = 1.0;
  private musicVolume: number = 0.7;
  private sfxVolume: number = 1.0;
  private _ambientVolume: number = 0.5;

  /**
   * Get ambient volume
   */
  getAmbientVolume(): number {
    return this._ambientVolume;
  }

  /**
   * Set ambient volume
   */
  setAmbientVolume(volume: number): void {
    this._ambientVolume = Math.max(0, Math.min(1, volume));
  }
  private muted: boolean = false;

  constructor() {
    Object.values(ALL_AUDIO).forEach(asset => {
      this.audio.set(asset.id, asset);
    });
  }

  /**
   * Get an audio asset definition
   */
  get(id: string): AudioAsset | undefined {
    return this.audio.get(id);
  }

  /**
   * Register a new audio asset
   */
  register(asset: AudioAsset): void {
    this.audio.set(asset.id, asset);
  }

  /**
   * Set audio source for an asset
   */
  setSource(id: string, src: string): void {
    const asset = this.audio.get(id);
    if (asset) {
      asset.src = src;
    }
  }

  /**
   * Preload audio file
   */
  async preload(id: string): Promise<void> {
    const asset = this.audio.get(id);
    if (!asset?.src) return;

    return new Promise((resolve, reject) => {
      const audio = new Audio(asset.src);
      audio.preload = 'auto';
      audio.oncanplaythrough = () => {
        this.loadedAudio.set(id, audio);
        resolve();
      };
      audio.onerror = reject;
      audio.load();
    });
  }

  /**
   * Play a sound effect
   */
  playSfx(id: string): void {
    if (this.muted) return;
    
    const asset = this.audio.get(id);
    if (!asset?.src) {
      console.log(`[Audio] SFX not loaded: ${id}`);
      return;
    }

    const audio = new Audio(asset.src);
    audio.volume = (asset.defaultVolume || 1) * this.sfxVolume * this.masterVolume;
    audio.play().catch(() => {});
  }

  /**
   * Play music (with optional crossfade)
   */
  async playMusic(id: string, crossfade: boolean = true): Promise<void> {
    if (this.currentMusicId === id) return;

    const asset = this.audio.get(id);
    if (!asset?.src) {
      console.log(`[Audio] Music not loaded: ${id}`);
      return;
    }

    // Fade out current music
    if (this.currentMusic && crossfade) {
      await this.fadeOut(this.currentMusic, asset.fadeOutDuration || 1000);
    } else if (this.currentMusic) {
      this.currentMusic.pause();
    }

    // Create and play new music
    const audio = new Audio(asset.src);
    audio.loop = asset.loop ?? true;
    audio.volume = 0;
    
    this.currentMusic = audio;
    this.currentMusicId = id;

    if (!this.muted) {
      await audio.play().catch(() => {});
      await this.fadeIn(audio, (asset.defaultVolume || 0.5) * this.musicVolume * this.masterVolume, asset.fadeInDuration || 1000);
    }
  }

  /**
   * Stop current music
   */
  async stopMusic(fadeOut: boolean = true): Promise<void> {
    if (!this.currentMusic) return;

    if (fadeOut) {
      await this.fadeOut(this.currentMusic, 1000);
    }
    
    this.currentMusic.pause();
    this.currentMusic = null;
    this.currentMusicId = null;
  }

  /**
   * Fade in audio
   */
  private fadeIn(audio: HTMLAudioElement, targetVolume: number, duration: number): Promise<void> {
    return new Promise(resolve => {
      const steps = 20;
      const stepDuration = duration / steps;
      const volumeStep = targetVolume / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.min(volumeStep * currentStep, targetVolume);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Fade out audio
   */
  private fadeOut(audio: HTMLAudioElement, duration: number): Promise<void> {
    return new Promise(resolve => {
      const steps = 20;
      const stepDuration = duration / steps;
      const startVolume = audio.volume;
      const volumeStep = startVolume / steps;
      let currentStep = 0;

      const interval = setInterval(() => {
        currentStep++;
        audio.volume = Math.max(startVolume - volumeStep * currentStep, 0);
        
        if (currentStep >= steps) {
          clearInterval(interval);
          resolve();
        }
      }, stepDuration);
    });
  }

  /**
   * Set master volume
   */
  setMasterVolume(volume: number): void {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateCurrentMusicVolume();
  }

  /**
   * Set music volume
   */
  setMusicVolume(volume: number): void {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    this.updateCurrentMusicVolume();
  }

  /**
   * Set SFX volume
   */
  setSfxVolume(volume: number): void {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Toggle mute
   */
  toggleMute(): boolean {
    this.muted = !this.muted;
    if (this.currentMusic) {
      this.currentMusic.muted = this.muted;
    }
    return this.muted;
  }

  /**
   * Check if muted
   */
  isMuted(): boolean {
    return this.muted;
  }

  private updateCurrentMusicVolume(): void {
    if (this.currentMusic && this.currentMusicId) {
      const asset = this.audio.get(this.currentMusicId);
      const targetVolume = (asset?.defaultVolume || 0.5) * this.musicVolume * this.masterVolume;
      this.currentMusic.volume = this.muted ? 0 : targetVolume;
    }
  }

  /**
   * Get all audio in a category
   */
  getCategory(type: AudioType): AudioAsset[] {
    return Array.from(this.audio.values()).filter(a => a.type === type);
  }

  /**
   * Get public domain music list
   */
  getPublicDomainMusic(): AudioAsset[] {
    return Array.from(this.audio.values())
      .filter(a => a.type === 'music' && a.license === 'public-domain');
  }

  /**
   * Get all audio IDs
   */
  getAllIds(): string[] {
    return Array.from(this.audio.keys()).sort();
  }
}

// Singleton instance
export const AudioRegistry = new AudioRegistryClass();

// ============================================================================
// AUDIO ID CONSTANTS
// ============================================================================

export const AudioIds = {
  music: {
    menu: 'music.menu',
    world: 'music.world',
    learning: 'music.learning',
    success: 'music.success',
    classical: {
      chopinScherzo2: 'music.classical.chopin.scherzo2',
      chopinNocturne9: 'music.classical.chopin.nocturne9',
      debussyClair: 'music.classical.debussy.clair',
      satieGymnopedie: 'music.classical.satie.gymnopedie1',
      bachCello: 'music.classical.bach.cello1',
    },
  },
  sfx: {
    ui: {
      click: 'sfx.ui.click',
      hover: 'sfx.ui.hover',
      open: 'sfx.ui.open',
      close: 'sfx.ui.close',
    },
    game: {
      xp: 'sfx.game.xp',
      levelup: 'sfx.game.levelup',
      coin: 'sfx.game.coin',
      unlock: 'sfx.game.unlock',
    },
    speech: {
      correct: 'sfx.speech.correct',
      incorrect: 'sfx.speech.incorrect',
    },
  },
  ambient: {
    village: 'ambient.village',
    forest: 'ambient.forest',
    market: 'ambient.market',
    rain: 'ambient.rain',
    fire: 'ambient.fire',
  },
} as const;
