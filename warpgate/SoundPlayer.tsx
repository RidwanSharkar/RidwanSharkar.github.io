import React, { useRef, useState, useEffect } from 'react';
import styles from './SoundPlayer.module.css';

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().catch((error) => {
        console.error('Failed to auto-play audio:', error);
      });
    }
  }, []);

  const toggleMute = () => {
    if (!audioRef.current) return;

    audioRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  return (
    <div className={styles.audioPlayer}>
      <button onClick={toggleMute} className={styles.playButton}>
        {isMuted ? '🔇' : '🔊'} {/* Mute/Unmute icons */}
      </button>
      <audio src={src} ref={audioRef} autoPlay />
    </div>
  );
};

export default AudioPlayer;
