import { useState, useRef, useEffect } from 'react';

const AudioPlayer = ({ audioSrc, title, duration }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const audioRef = useRef(null);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    const audio = audioRef.current;
    if (audio && audio.duration) {
      const currentProgress = (audio.currentTime / audio.duration) * 100;
      setProgress(currentProgress);
    }
  };

  const handleEnded = () => {
    setIsPlaying(false);
    setProgress(0);
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('ended', handleEnded);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('ended', handleEnded);
    };
  }, []);

  return (
    <div className="card shadow border-0 p-4 mx-auto" style={{ maxWidth: '600px' }}>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5 className="mb-0 text-truncate">{title}</h5>
        <small className="text-muted">{duration}</small>
      </div>

      <audio ref={audioRef} src={audioSrc} preload="metadata" />

      <div className="d-flex align-items-center gap-3">
        <button
          onClick={togglePlay}
          className="btn btn-primary rounded-circle d-flex align-items-center justify-content-center"
          style={{ width: '48px', height: '48px' }}
          aria-label={isPlaying ? 'Pause' : 'Play'}
        >
          {isPlaying ? (
            <i className="bi bi-pause-fill fs-4"></i>
          ) : (
            <i className="bi bi-play-fill fs-4"></i>
          )}
        </button>

        <div className="flex-grow-1">
          <div className="progress" style={{ height: '6px' }}>
            <div
              className="progress-bar bg-primary"
              role="progressbar"
              style={{ width: `${progress}%` }}
              aria-valuenow={progress}
              aria-valuemin="0"
              aria-valuemax="100"
            ></div>
          </div>
        </div>

        <a
          href={audioSrc}
          download
          className="btn btn-outline-secondary btn-sm"
          title="Download Audio"
        >
          <i className="bi bi-download"></i>
        </a>
      </div>
    </div>
  );
};

export default AudioPlayer;
