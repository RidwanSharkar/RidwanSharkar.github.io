import React, { useRef, useState, useEffect } from 'react';
import styles from './SoundPlayer.module.css';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(true); // Start with muted as true
  const [volume, setVolume] = useState(0.5); // Default volume at 50%

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume; // Set initial volume
      audioRef.current.muted = isMuted; // Set initial mute state
      audioRef.current.play().catch((error) => {
        console.error('Failed to auto-play audio:', error);
      });
    }
  }, [volume, isMuted]);

  const toggleMute = () => {
    if (!audioRef.current) return;
    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
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
      <button onClick={toggleMute} className={styles.playButton}>
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
      <audio src={src} ref={audioRef} autoPlay loop />
    </div>
  );
};

export default AudioPlayer;
