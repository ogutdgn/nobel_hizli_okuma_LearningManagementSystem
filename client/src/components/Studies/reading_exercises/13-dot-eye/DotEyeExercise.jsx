import React, { useState, useEffect, useRef } from "react";
import { Container, Typography, Button, Slider, IconButton, Box } from "@mui/material";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';
import RefreshIcon from '@mui/icons-material/Refresh';
import SettingsIcon from '@mui/icons-material/Settings';
import CloseIcon from '@mui/icons-material/Close';
import useSound from 'use-sound';
import clickSound from '../../../../assets/sound/beep.mp3'; // "tık" ses dosyasını buraya ekleyin
import './DotEyeExercise.css'; // Stil dosyasını oluşturun

const DotEyeExercise = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [duration, setDuration] = useState(60); // Süreyi saniye olarak ayarlayın
  const [currentDot, setCurrentDot] = useState(0);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [timeLeft, setTimeLeft] = useState(duration);
  const [play] = useSound(clickSound);

  const intervalRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (isPlaying) {
      intervalRef.current = setInterval(() => {
        setCurrentDot(prevDot => (prevDot + 1) % 13);
        play();
      }, 1000 / speed);

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
  }, [isPlaying, speed, play]);

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
    setCurrentDot(0);
    setTimeLeft(duration);
  };

  const toggleSettings = () => {
    setSettingsOpen(!settingsOpen);
  };

  const dotCoordinates = [
    { top: '48%', left: '48%' }, // 0
    { top: '13%', left: '48%' }, // 1
    { top: '66%', left: '18%' }, // 2
    { top: '66%', left: '78%' }, // 3
    { top: '30%', left: '18%' }, // 4
    { top: '83%', left: '48%' }, // 5
    { top: '30%', left: '78%' }, // 6
    { top: '48%', left: '13%' }, // 7
    { top: '78%', left: '66%' }, // 8
    { top: '18%', left: '66%' }, // 9
    { top: '78%', left: '30%' }, // 10
    { top: '18%', left: '30%' }, // 11
    { top: '48%', left: '83%' }, // 12
  ];

  // const dotCoordinates = [
  //   { top: '50%', left: '50%' }, // 0
  //   { top: '25%', left: '15%' }, // 1
  //   { top: '12%', left: '50%' }, // 2
  //   { top: '25%', left: '85%' }, // 3
  //   { top: '50%', left: '90%' }, // 4
  //   { top: '75%', left: '85%' }, // 5
  //   { top: '90%', left: '50%' }, // 6
  //   { top: '75%', left: '15%' }, // 7
  //   { top: '50%', left: '10%' }, // 8
  //   { top: '15%', left: '32%' }, // 9
  //   { top: '15%', left: '68%' }, // 10
  //   { top: '85%', left: '65%' }, // 11
  //   { top: '85%', left: '35%' }, // 12
  // ];

  return (
    <Container>
      {/* <Typography variant="h4" gutterBottom>13 Nokta Göz Egzersizi</Typography> */}
      <Box className="dot-eye-exercise">
        {dotCoordinates.map((coord, index) => (
          <div
            key={index}
            className={`dot ${currentDot === index ? 'active' : ''}`}
            style={{ top: coord.top, left: coord.left }}
          >
            {index}
          </div>
        ))}
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
          <Typography gutterBottom>Hız</Typography>
          <Slider value={speed} onChange={handleSpeedChange} min={0.1} max={5} step={0.1} />
          <Typography gutterBottom>Süre (saniye): {duration}</Typography>
          <Slider value={duration} onChange={handleDurationChange} min={10} max={300} step={10} />
          <IconButton onClick={toggleSettings} color="default">
            <CloseIcon />
          </IconButton>
        </Box>
      )}
    </Container>
  );
};

export default DotEyeExercise;
