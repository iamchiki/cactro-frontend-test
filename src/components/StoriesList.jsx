import { useRef } from "react";
import styles from "./StoriesList.module.css";

function StoriesList({ stories, onStoryClick }) {
  const scrollRef = useRef(null);

  return (
    <div className={styles.container}>
      <div className={styles.scrollContainer} ref={scrollRef}>
        {stories.map((story, index) => (
          <div
            key={story.id}
            className={styles.storyItem}
            onClick={() => onStoryClick(index)}>
            <div className={styles.storyRing}>
              <img
                src={story.avatar}
                alt={story.username}
                className={styles.avatar}
              />
            </div>
            <span className={styles.username}>{story.username}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StoriesList;
