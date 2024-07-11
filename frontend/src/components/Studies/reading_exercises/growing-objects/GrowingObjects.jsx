import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, Button, Slider, IconButton, Box, Switch, FormControlLabel, Select, MenuItem } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import useSound from 'use-sound';
import clickSound from '../../../../assets/sound/beep.mp3'; // Ensure you have the correct path to the sound file
import './GrowingObjects.css';

const GrowingObjects = () => {
  const [layers, setLayers] = useState(1);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(60); // Duration in seconds
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [shape, setShape] = useState('hexagon');
  const [play] = useSound(clickSound);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const speedLevels = [1000, 900, 600, 300, 100]; // Speed in milliseconds

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setLayers(prevLayers => {
          play();
          if (isDeleting) {
            if (prevLayers >= 9) {
              return 1; // Reset layers if they reach the boundary
            }
            return prevLayers + 1;
          } else {
            return prevLayers >= 9 ? 1 : prevLayers + 1;
          }
        });
      }, speedLevels[speed - 1]);

      timerRef.current = setInterval(() => {
        setTimeLeft(prevTime => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, play, isDeleting]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setTimeLeft(duration);
    }
  }, [timeLeft, duration]);

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
  };

  const handleDurationChange = (event, newValue) => {
    setDuration(newValue);
    setTimeLeft(newValue);
  };

  const handleStartStop = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setLayers(1);
    setTimeLeft(duration);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const renderLayers = () => {
    let shapes = [];
    for (let i = 0; i < layers; i++) {
      let points;
      switch (shape) {
        case 'hexagon':
          points = isDeleting ? hexagonPoints(20 + (layers - 1) * 20, 200, 200) : hexagonPoints(20 + i * 20, 200, 200);
          break;
        case 'square':
          points = isDeleting ? squarePoints(40 + (layers - 1) * 40, 200, 200) : squarePoints(40 + i * 40, 200, 200);
          break;
        case 'ellipse':
          points = isDeleting ? ellipsePoints(20 + (layers - 1) * 20, 10 + (layers - 1) * 10, 200, 200) : ellipsePoints(20 + i * 20, 10 + i * 10, 200, 200);
          break;
        case 'circle':
          points = isDeleting ? circlePoints(20 + (layers - 1) * 20, 200, 200) : circlePoints(20 + i * 20, 200, 200);
          break;
        case 'rectangle':
          points = isDeleting ? rectanglePoints(40 + (layers - 1) * 40, 20 + (layers - 1) * 20, 200, 200) : rectanglePoints(40 + i * 40, 20 + i * 20, 200, 200);
          break;
        default:
          points = isDeleting ? hexagonPoints(20 + (layers - 1) * 20, 200, 200) : hexagonPoints(20 + i * 20, 200, 200);
      }
      shapes.push(
        <polygon
          key={i}
          points={points}
          className="hexagon-layer"
        />
      );
    }
    return shapes;
  };
  
  // Hexagon Points
  const hexagonPoints = (radius, cx, cy) => {
    let points = [];
    for (let i = 0; i < 6; i++) {
      const angle = (Math.PI / 3) * i;
      points.push([cx + radius * Math.cos(angle), cy + radius * Math.sin(angle)]);
    }
    return points.map(point => point.join(',')).join(' ');
  };
  
  // Square Points
  const squarePoints = (size, cx, cy) => {
    const halfSize = size / 2;
    return [
      [cx - halfSize, cy - halfSize],
      [cx + halfSize, cy - halfSize],
      [cx + halfSize, cy + halfSize],
      [cx - halfSize, cy + halfSize],
    ].map(point => point.join(',')).join(' ');
  };
  
  // Ellipse Points
  const ellipsePoints = (rx, ry, cx, cy) => {
    let points = [];
    for (let i = 0; i < 360; i += 10) {
      const angle = (Math.PI / 180) * i;
      points.push([cx + rx * Math.cos(angle), cy + ry * Math.sin(angle)]);
    }
    return points.map(point => point.join(',')).join(' ');
  };
  
  // Circle Points
  const circlePoints = (r, cx, cy) => ellipsePoints(r, r, cx, cy);
  
  // Rectangle Points
  const rectanglePoints = (width, height, cx, cy) => {
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    return [
      [cx - halfWidth, cy - halfHeight],
      [cx + halfWidth, cy - halfHeight],
      [cx + halfWidth, cy + halfHeight],
      [cx - halfWidth, cy + halfHeight],
    ].map(point => point.join(',')).join(' ');
  };
  

  return (
    <Container>
      <Box className="growing-hexagon-container">
        <svg width="400" height="400">
          <circle cx="200" cy="200" r="5" fill="gray" />
          {renderLayers()}
        </svg>
      </Box>
      <Box mt={2}>
        <Typography variant="h6">Kalan Süre: {timeLeft}s</Typography>
      </Box>
      <Box mt={2}>
        <IconButton onClick={handleStartStop} color="primary">
          {isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
        </IconButton>
        <IconButton onClick={handleReset} color="secondary">
          <RefreshIcon />
        </IconButton>
        <IconButton onClick={toggleSettings} color="default">
          <SettingsIcon />
        </IconButton>
      </Box>
      {settingsOpen && (
        <Box mt={2}>
          <Typography gutterBottom>Hız Seviyesi</Typography>
          <Slider value={speed} onChange={handleSpeedChange} min={1} max={5} step={1} disabled={isPlaying} />
          <Typography gutterBottom>Süre (saniye): {duration}</Typography>
          <Slider value={duration} onChange={handleDurationChange} min={10} max={300} step={10} disabled={isPlaying} />
          <FormControlLabel
            control={<Switch checked={isDeleting} onChange={(e) => setIsDeleting(e.target.checked)} disabled={isPlaying} />}
            label="Silinerek"
          />
          <Typography gutterBottom>Şekil</Typography>
          <Select value={shape} onChange={(e) => setShape(e.target.value)} disabled={isPlaying}>
            <MenuItem value="hexagon">Altıgen</MenuItem>
            <MenuItem value="square">Kare</MenuItem>
            <MenuItem value="ellipse">Elips</MenuItem>
            <MenuItem value="circle">Daire</MenuItem>
            <MenuItem value="rectangle">Dikdörtgen</MenuItem>
          </Select>
          <IconButton onClick={toggleSettings} color="default">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default GrowingObjects;
