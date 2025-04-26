import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flashcardsApi } from "../api/flashcards";

import styles from "../styles/flashcards-test.module.css";

interface Flashcard {
  id: number;
  folder_id: number;
  question: string;
  answer: string;
}

export const FlashcardsTestPage: React.FC = () => {
  const { folderId } = useParams<{ folderId: string }>();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const navigate = useNavigate();
  const [progress, setProgress] = useState<{ know: number; dontKnow: number }>({
    know: 0,
    dontKnow: 0,
  });
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFlashcards = async () => {
      try {
        setLoading(true);
        const response = await flashcardsApi.getFlashcards(Number(folderId));
        setFlashcards(response.data);
      } catch (err) {
        setError("Failed to load flashcards. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [folderId]);

  const handleFlip = () => {
    setIsFlipped(!isFlipped);
  };

  const handleNextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setIsFlipped(false);
    } else {
      setShowResults(true); // Show results when reaching the last card
    }
  };

  const handleKnow = () => {
    setProgress((prev) => ({ ...prev, know: prev.know + 1 }));
    handleNextCard();
  };

  const handleDontKnow = () => {
    setProgress((prev) => ({ ...prev, dontKnow: prev.dontKnow + 1 }));
    handleNextCard();
  };

  const handleRestart = () => {
    setCurrentCardIndex(0);
    setIsFlipped(false);
    setProgress({ know: 0, dontKnow: 0 });
    setShowResults(false);
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;
  if (flashcards.length === 0) return <div>No flashcards found.</div>;

  const currentCard = flashcards[currentCardIndex];

  return (
    <div className={styles.container}>
      {showResults ? (
        <div className={styles.results}>
        <button
          onClick={() => navigate(`/folders/${folderId}/flashcards`)}
          className={styles.testFlashcardButton}
        >
          Back to Flashcards
        </button>
          <h2>Test Results</h2>
          <p>Total Cards: {flashcards.length}</p>
          <p>You know: {progress.know}</p>
          <p>You don't know: {progress.dontKnow}</p>
          <button className={styles.button} onClick={handleRestart}>
            Restart Test
          </button>
        </div>
      ) : (
        <>
          <div className={styles.progress}>
            Card {currentCardIndex + 1} of {flashcards.length}
          </div>
          <div
            className={`${styles.card} ${isFlipped ? styles.flipped : ""}`}
            onClick={handleFlip}
          >
            <div className={styles.cardInner}>
              <div className={styles.cardFront}>
                <h2>Question</h2>
                <p>{currentCard.question}</p>
              </div>
              <div className={styles.cardBack}>
                <h2>Answer</h2>
                <p>{currentCard.answer}</p>
              </div>
            </div>
          </div>
          <div className={styles.actions}>
            <button className={styles.knowButton} onClick={handleKnow}>
              Know
            </button>
            <button className={styles.dontKnowButton} onClick={handleDontKnow}>
              Don't Know
            </button>
            <button className={styles.button} onClick={handleNextCard}>
              Skip
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default FlashcardsTestPage;
