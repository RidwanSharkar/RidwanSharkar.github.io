import React, { useRef, useState } from 'react';
import styles from './SoundPlayer.module.css';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Start with muted as true
  const [volume, setVolume] = useState(0.5); // Default volume at 50%

  const handleUserInteraction = () => {
    if (audioRef.current) {
      audioRef.current.muted = false; // Unmute audio
      audioRef.current.volume = volume; // Set volume to current level
      audioRef.current.play().catch((error) => {
        console.error('Failed to play audio:', error);
      });
      setIsMuted(false); // Update mute state
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
    <div className={styles.audioPlayer}>
      <button onClick={handleUserInteraction} className={styles.playButton}>
        {isMuted ? '🔇' : '🔊'}
      </button>
      <div className={styles.volumeControl}>
        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
        />
      </div>
      <audio src={src} ref={audioRef} />
    </div>
  );
};

export default AudioPlayer;
