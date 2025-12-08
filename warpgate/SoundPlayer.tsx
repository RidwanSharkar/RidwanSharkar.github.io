import React, { useRef, useState } from 'react';
import styles from './SoundPlayer.module.css';

interface Track {
  id: number;
  name: string;
  src: string;
}

const tracks: Track[] = [
  { id: 1, name: "⚛", src: "/audio/BrownNoise.MP3" },
  { id: 2, name: "⚘", src: "/audio/Fireplace.MP3" }, 
  { id: 3, name: "☮", src: "/audio/Weightless.MP3" }, 
  { id: 4, name: "⚜", src: "/audio/BinauralBeats.MP3" }, 
  { id: 5, name: "࿈", src: "/audio/RainCafe.MP3" }, 
  { id: 6, name: "⚜", src: "/audio/AmBackingTracks.MP3" }, 
  { id: 7, name: "☮ ", src: "/audio/Track9.MP3" }, 
  { id: 8, name: "☮", src: "/audio/DeepOm1.MP3" }, 
  { id: 9, name: "☮", src: "/audio/DeepOm2.MP3" }, 
  { id: 10, name: "࿈", src: "/audio/40HzTone.MP3" }, 
  { id: 11, name: "☣︎", src: "/audio/528PureTone.MP3" },
  { id: 12, name: "☮", src: "/audio/GuidedMeditation.MP3" }, 
];                  // ✧ ☮ ☸ ♨ ☯ ❃ ✾ ♝ ♗ ⚜ ☼ ⚜ 𖡨 ꗈ 𖣨 ❃

interface AudioPlayerProps {
  src: string;
}

const VISIBLE_TRACKS = 5;

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState<Track>({ id: 0, name: "Custom Track", src });
  const [trackOffset, setTrackOffset] = useState(0);

  const visibleTracks = tracks.slice(trackOffset, trackOffset + VISIBLE_TRACKS);
  const canGoLeft = trackOffset > 0;
  const canGoRight = trackOffset + VISIBLE_TRACKS < tracks.length;

  const handlePrevTracks = () => {
    setTrackOffset(Math.max(0, trackOffset - 1));
  };

  const handleNextTracks = () => {
    setTrackOffset(Math.min(tracks.length - VISIBLE_TRACKS, trackOffset + 1));
  };

  // Sync audio element volume when component mounts
  React.useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
      audioRef.current.muted = isMuted;
    }
  }, [isMuted, volume]);

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch((error) => {
          console.error('Failed to play audio:', error);
        });
      }
      setIsPlaying(!isPlaying);
    }
  };

  const selectTrack = (track: Track) => {
    setCurrentTrack(track);
    setIsPlaying(false);
    if (audioRef.current) {
      audioRef.current.load();
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
    }
  };

  return (
    <div className={styles.audioContainer}>
      <div className={styles.trackButtonsContainer}>
        <button 
          className={`${styles.navArrow} ${!canGoLeft ? styles.navArrowDisabled : ''}`}
          onClick={handlePrevTracks}
          disabled={!canGoLeft}
        >
          ‹
        </button>
        <div className={styles.trackButtons}>
          {visibleTracks.map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className={`${styles.trackButton} ${currentTrack.id === track.id ? styles.activeTrack : ''}`}
            >
              {track.name}
            </button>
          ))}
        </div>
        <button 
          className={`${styles.navArrow} ${!canGoRight ? styles.navArrowDisabled : ''}`}
          onClick={handleNextTracks}
          disabled={!canGoRight}
        >
          ›
        </button>
      </div>
      <div className={styles.audioPlayer}>
        <button onClick={togglePlayPause} className={styles.playPauseButton}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={toggleMute} className={styles.muteButton}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          className={styles.volumeSlider}
        />
        <audio ref={audioRef} src={currentTrack.src} controls={false} loop />
      </div>
    </div>
  );
};

export default AudioPlayer;
