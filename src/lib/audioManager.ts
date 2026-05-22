class AudioManager {
  private sounds: Record<string, HTMLAudioElement> = {};
  private bgmStarted = false;

  constructor() {
    // We don't load in constructor to avoid SSR or early initialization issues
  }

  /**
   * Initialize and pre-load sounds. 
   * Should be called after the first user interaction.
   */
  init() {
    this.load('correct', '/sounds/correct.mp3');
    this.load('wrong', '/sounds/wrong.mp3');
    this.load('tick', '/sounds/tick.mp3');
    this.load('game-over', '/sounds/game-over.mp3');
    this.load('bgm', '/sounds/rush-bgm.mp3', true);
  }

  private load(name: string, path: string, loop = false) {
    if (this.sounds[name]) return;
    try {
      const audio = new Audio(path);
      audio.loop = loop;
      audio.preload = 'auto';
      this.sounds[name] = audio;
    } catch (e) {
      console.error(`Failed to load sound ${name}:`, e);
    }
  }

  play(name: string, isMuted: boolean, volume = 1) {
    const sound = this.sounds[name];
    if (isMuted || !sound) return;

    if (!sound.paused && name !== 'bgm') {
      const clone = sound.cloneNode() as HTMLAudioElement;
      clone.volume = volume;
      clone.play().catch(() => {});
    } else {
      sound.volume = volume;
      sound.play().catch(() => {});
    }
  }

  playBGM(isMuted: boolean) {
    const bgm = this.sounds['bgm'];
    if (!bgm) return;
    
    this.bgmStarted = true;
    if (isMuted) return;

    if (bgm.paused) {
      bgm.volume = 0.4;
      bgm.play().catch(() => {
        // Keep bgmStarted = true so setMute(false) or other triggers can try again
      });
    }
  }

  stopBGM() {
    const bgm = this.sounds['bgm'];
    if (bgm) {
      bgm.pause();
      bgm.currentTime = 0;
      this.bgmStarted = false;
    }
  }

  playTick(isMuted: boolean, isLowTime: boolean) {
    this.play('tick', isMuted, isLowTime ? 0.8 : 0.4);
  }

  setMute(isMuted: boolean) {
    Object.values(this.sounds).forEach(sound => {
      if (isMuted) {
        sound.pause();
      }
    });
    
    if (!isMuted && this.bgmStarted) {
      this.playBGM(false);
    }
  }
}

export const audioManager = new AudioManager();
