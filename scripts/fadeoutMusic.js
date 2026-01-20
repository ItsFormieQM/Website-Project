function fadeOutAudio(audio, duration = 1200) {
  const step = 50;
  const volumeStep = audio.volume / (duration / step);

  const fade = setInterval(() => {
    if (audio.volume > volumeStep) {
      audio.volume -= volumeStep;
    } else {
      audio.volume = 0;
      audio.pause();
      clearInterval(fade);
    }
  }, step);
}
