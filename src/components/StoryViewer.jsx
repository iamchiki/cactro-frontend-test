import { useState, useEffect, useRef } from "react";
import styles from "./StoryViewer.module.css";

function StoryViewer({ stories, currentIndex, onClose, onNext, onPrev }) {
  const [progress, setProgress] = useState(0);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const currentStory = stories[currentIndex];
  const STORY_DURATION = 5000; // 5 seconds
  const PROGRESS_INTERVAL = 50; // Update progress every 50ms

  // Reset when story changes
  useEffect(() => {
    setImageLoaded(false);
    setProgress(0);
    setIsPaused(false);

    // Clear any existing timers
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [currentIndex]);

  // Start timer when image loads and not paused
  useEffect(() => {
    if (!imageLoaded || isPaused) {
      // Clear timers when paused or image not loaded
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      return;
    }

    // Reset progress
    setProgress(0);

    // Start progress animation
    const startTime = Date.now();

    intervalRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;
      const newProgress = (elapsed / STORY_DURATION) * 100;

      if (newProgress >= 100) {
        setProgress(100);
        clearInterval(intervalRef.current);
        // Move to next story after a brief delay
        timeoutRef.current = setTimeout(() => {
          onNext();
        }, 100);
      } else {
        setProgress(newProgress);
      }
    }, PROGRESS_INTERVAL);

    // Cleanup function
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [imageLoaded, isPaused, currentIndex, onNext]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleTouchStart = (e) => {
    e.preventDefault();

    setIsPaused(true);
  };

  const handleTouchEnd = () => {
    // e.preventDefault();

    setIsPaused(false);
  };

  const handleLeftTap = () => {
    if (currentIndex > 0) {
      onPrev();
    }
  };

  const handleRightTap = () => {
    onNext();
  };

  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowLeft") {
      handleLeftTap();
    } else if (e.key === "ArrowRight") {
      handleRightTap();
    }
  };

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [currentIndex]);

  return (
    <div className={styles.overlay}>
      <div className={styles.container}>
        {/* Progress bars */}
        <div className={styles.progressContainer}>
          {stories.map((_, index) => (
            <div key={index} className={styles.progressBar}>
              <div
                className={styles.progressFill}
                style={{
                  width:
                    index < currentIndex
                      ? "100%"
                      : index === currentIndex
                      ? `${progress}%`
                      : "0%",
                }}
              />
            </div>
          ))}
        </div>

        {/* Header */}
        <div className={styles.header}>
          <div className={styles.userInfo}>
            <img
              src={currentStory.avatar || "/placeholder.svg"}
              alt={currentStory.username}
              className={styles.headerAvatar}
            />
            <span className={styles.headerUsername}>
              {currentStory.username}
            </span>
          </div>
          <button className={styles.closeButton} onClick={onClose}>
            ×
          </button>
        </div>

        {/* Story content */}
        <div className={styles.content}>
          {!imageLoaded && (
            <div className={styles.loading}>
              <div className={styles.spinner}></div>
            </div>
          )}

          <img
            src={currentStory.image || "/placeholder.svg"}
            alt={`Story by ${currentStory.username}`}
            className={styles.storyImage}
            onLoad={handleImageLoad}
            onError={() => {
              console.log("Image failed to load, treating as loaded");
              setImageLoaded(true);
            }}
            style={{ opacity: imageLoaded ? 1 : 0 }}
          />

          {/* Navigation areas */}
          <div
            className={`${styles.navArea} ${styles.navLeft}`}
            onClick={handleLeftTap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
              <path d="M13.293 7.293 8.586 12l4.707 4.707 1.414-1.414L11.414 12l3.293-3.293-1.414-1.414z" />
            </svg>
          </div>
          <div
            className={`${styles.navArea} ${styles.navRight}`}
            onClick={handleRightTap}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
            onMouseDown={handleTouchStart}
            onMouseUp={handleTouchEnd}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="#fff">
              <path d="M12 2a10 10 0 1 0 10 10A10.011 10.011 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8.009 8.009 0 0 1-8 8z" />
              <path d="M9.293 8.707 12.586 12l-3.293 3.293 1.414 1.414L15.414 12l-4.707-4.707-1.414 1.414z" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StoryViewer;
