import React from 'react';
import styles from './SoundPlayer.module.css';

interface TimeWarpProps {
  value: number;
  onChange: (value: number) => void;
}

const TimeWarp: React.FC<TimeWarpProps> = ({ value, onChange }) => {
  // Map normalized slider [0, 2] to non-linear timeScale [0.2, 5.0]
  // 0.0 -> 0.2x
  // 1.0 -> 1.0x (Middle)
  // 2.0 -> 5.0x
  const mapSliderToTimeScale = (s: number) => {
    if (s <= 1) {
      return 0.2 + s * 0.8; // Linear from 0.2 to 1.0
    } else {
      return 1.0 + (s - 1) * 4.0; // Linear from 1.0 to 5.0
    }
  };

  const mapTimeScaleToSlider = (t: number) => {
    if (t <= 1) {
      return (t - 0.2) / 0.8;
    } else {
      return 1.0 + (t - 1.0) / 4.0;
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const s = parseFloat(e.target.value);
    onChange(mapSliderToTimeScale(s));
  };

  return (
    <div style={{ width: '190px', display: 'flex', alignItems: 'center' }}>
      <div className={styles.audioPlayer} style={{ 
        background: 'linear-gradient(135deg, #00d2ff, #007bbd)', 
        boxShadow: '0 0 15px rgba(0, 210, 255, 0.3)', 
        padding: '3px 12px',
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: '0px'
      }}>
        <div className={styles.volumeSliderContainer} style={{ flex: 1, margin: 0 }}>
          <input
            type="range"
            min="0"
            max="2"
            step="0.001"
            value={mapTimeScaleToSlider(value)}
            onChange={handleChange}
            className={styles.volumeSlider}
            title={`Warp Factor: ${value.toFixed(2)}x`}
          />
        </div>
        <span style={{ 
          color: 'white', 
          fontSize: '12px', 
          fontWeight: 'bold', 
          minWidth: '37px', 
          textAlign: 'right', 
          fontFamily: 'Orbitron, sans-serif', 
          letterSpacing: '1px',
          textShadow: '0 0 8px rgba(255, 255, 255, 0.4)'
        }}>
            {value.toFixed(1)}x
        </span>
      </div>
    </div>
  );
};

export default TimeWarp;
