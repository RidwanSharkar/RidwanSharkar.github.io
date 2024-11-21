import React, { useRef, useState } from 'react';
import styles from './SoundPlayer.module.css';

interface Track {
  id: number;
  name: string;
  src: string;
}

const tracks: Track[] = [
  { id: 1, name: "⌬", src: "/audio/track1.MP3" },
  { id: 2, name: "❅", src: "/audio/track2.MP3" },
  { id: 3, name: "☸", src: "/audio/track3.MP3" },
  { id: 4, name: "⚘", src: "/audio/track4.MP3" }, // ❃
  { id: 5, name: "✾", src: "/audio/track5.MP3" },
  { id: 6, name: "⤛ ", src: "/audio/track6.MP3" },
  { id: 7, name: "𖤍", src: "/audio/track7.MP3" }, //  ✧ ☮ ☸ ♨ ☯ ❃ ✾ ♝ ♗ ⚜ ☼ ⚜ 𖡨
  { id: 8, name: "⤜", src: "/audio/track8.MP3" }, // ꗈ 𖣨 
];

interface AudioPlayerProps {
  src: string;
}

const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [volume, setVolume] = useState(0.5);
  const [currentTrack, setCurrentTrack] = useState<Track>({ id: 0, name: "Custom Track", src });

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
        <div className={styles.trackButtons}>
          {tracks.slice(0, 5).map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className={`${styles.trackButton} ${currentTrack.id === track.id ? styles.activeTrack : ''}`}
            >
              {track.name}
            </button>
          ))}
        </div>
        <div className={styles.trackButtons}>
          {tracks.slice(5).map((track) => (
            <button
              key={track.id}
              onClick={() => selectTrack(track)}
              className={`${styles.trackButton} ${currentTrack.id === track.id ? styles.activeTrack : ''}`}
            >
              {track.name}
            </button>
          ))}
        </div>
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
        <audio ref={audioRef} src={currentTrack.src} controls={false} />
      </div>
    </div>
  );
};

export default AudioPlayer;
