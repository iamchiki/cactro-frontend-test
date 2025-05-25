import { useState, useEffect } from "react";
import StoriesList from "./components/StoriesList";
import StoryViewer from "./components/StoryViewer";
import styles from "./App.module.css";

function App() {
  const [stories, setStories] = useState([]);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchStories();
  }, []);

  const fetchStories = async () => {
    try {
      setLoading(true);

      const response = await fetch("/stories.json");
      const data = await response.json();
      setStories(data.stories);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const openStory = (index) => {
    setCurrentStoryIndex(index);
  };

  const closeStory = () => {
    setCurrentStoryIndex(null);
  };

  const nextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    } else {
      closeStory();
    }
  };

  const prevStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading stories...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>Stories</h1>
      </div>

      <StoriesList stories={stories} onStoryClick={openStory} />

      {currentStoryIndex !== null && (
        <StoryViewer
          stories={stories}
          currentIndex={currentStoryIndex}
          onClose={closeStory}
          onNext={nextStory}
          onPrev={prevStory}
        />
      )}
    </div>
  );
}

export default App;
