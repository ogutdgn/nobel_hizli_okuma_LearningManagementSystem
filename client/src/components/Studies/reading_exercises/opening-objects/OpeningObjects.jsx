import React, { useState, useEffect, useRef } from 'react';
import { Container, Typography, IconButton, Box, Slider, Switch, FormControlLabel, FormControl, FormLabel, RadioGroup, Radio } from '@mui/material';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import { Icon } from '@iconify/react';
import bookIcon from '@iconify/icons-mdi/book';
import laptopIcon from '@iconify/icons-mdi/laptop';
import earthIcon from '@iconify/icons-mdi/earth';
import cashIcon from '@iconify/icons-mdi/cash';
import leafIcon from '@iconify/icons-mdi/leaf';
import carIcon from '@iconify/icons-mdi/car';
import birdIcon from '@iconify/icons-mdi/bird';
import './OpeningObjects.css';

const imageSet = [
  { name: 'Kitap', icon: bookIcon },
  { name: 'Bilgisayar', icon: laptopIcon },
  { name: 'Dünya', icon: earthIcon },
  { name: 'Para', icon: cashIcon },
  { name: 'Yaprak', icon: leafIcon },
  { name: 'Araba', icon: carIcon },
  { name: 'Kutu', icon: birdIcon },

];

const generateImages = (count) => {
  const shuffled = [...imageSet].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count).map((img, index) => ({ ...img, key: index }));
};

const OpeningObjects = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(60); // Duration in seconds
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [imageCount, setImageCount] = useState(4);
  const [images, setImages] = useState(generateImages(imageCount));
  const [currentImageIndex, setCurrentImageIndex] = useState(-1);
  const [orientation, setOrientation] = useState('vertical');

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  const speedLevels = [500, 400, 300, 200, 100]; // Speed in milliseconds

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentImageIndex((prevIndex) => {
          if (prevIndex === images.length - 1) {
            setImages(generateImages(imageCount));
            return 0;
          } else {
            return prevIndex + 1;
          }
        });
      }, speedLevels[speed - 1]);

      timerRef.current = setInterval(() => {
        setTimeLeft((prevTime) => prevTime - 1);
      }, 1000);
    } else {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    }
    return () => {
      clearInterval(intervalRef.current);
      clearInterval(timerRef.current);
    };
  }, [isPlaying, speed, imageCount]);

  useEffect(() => {
    if (timeLeft <= 0) {
      setIsPlaying(false);
      setTimeLeft(duration);
      setCurrentImageIndex(-1);
    }
  }, [timeLeft, duration]);

  const handleSpeedChange = (event, newValue) => {
    setSpeed(newValue);
  };

  const handleDurationChange = (event, newValue) => {
    setDuration(newValue);
    setTimeLeft(newValue);
  };

  const handleImageCountChange = (event, newValue) => {
    setImageCount(newValue);
    setImages(generateImages(newValue));
  };

  const handleStartStop = () => {
    setIsPlaying(!isPlaying);
  };

  const handleReset = () => {
    setIsPlaying(false);
    setCurrentImageIndex(-1);
    setTimeLeft(duration);
    setImages(generateImages(imageCount));
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const handleOrientationChange = (event) => {
    setOrientation(event.target.value);
  };

  return (
    <Container>
      <div style={{ width: '100%' }}>
        <Box className={`objects-container ${orientation}`}>
          {images.map((img, index) => (
            <div style={{ backgroundColor: "grey" }}>
              <Box key={img.key} className={`image-box ${index <= currentImageIndex ? 'visible' : ''}`}>
                <Icon icon={img.icon} style={{ fontSize: '48px', margin: '10px' }} />
                {/* <Typography variant="body1">{img.name}</Typography> */}
              </Box>
            </div>
          ))}
        </Box>
      </div>
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
          <Typography gutterBottom>Nesne Sayısı: {imageCount}</Typography>
          <Slider value={imageCount} onChange={handleImageCountChange} min={3} max={7} step={1} disabled={isPlaying} />
          <FormControl component="fieldset" disabled={isPlaying}>
            <FormLabel component="legend">Yön</FormLabel>
            <RadioGroup row value={orientation} onChange={handleOrientationChange}>
              <FormControlLabel value="vertical" control={<Radio />} label="Dikey" />
              <FormControlLabel value="horizontal" control={<Radio />} label="Yatay" />
            </RadioGroup>
          </FormControl>
          <IconButton onClick={toggleSettings} color="default">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default OpeningObjects;
