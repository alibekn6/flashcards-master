import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flashcardsApi } from '../api/flashcards';
import { useAuth } from '../hooks/useAuth';
import { Flashcard } from '../types';
import styles from '../styles/flashcards-test.module.css';

export const FlashcardsTestPage = () => {
  const { folderId } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [currentCard, setCurrentCard] = useState<Flashcard | null>(null);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFlashcards = async () => {
      try {
        const response = await flashcardsApi.getFlashcards(Number(folderId));
        setFlashcards(response.data);
        if (response.data.length > 0) {
          setCurrentCard(getRandomCard(response.data));
        }
      } catch (err: any) {
        console.error('Fetch flashcards error:', err);
        setError('Failed to load flashcards: ' + (err.message || 'Unknown error'));
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [folderId, user, navigate]);

  const getRandomCard = (cards: Flashcard[]): Flashcard => {
    const randomIndex = Math.floor(Math.random() * cards.length);
    return cards[randomIndex];
  };

  const handleNextCard = () => {
    if (flashcards.length > 0) {
      const newCard = getRandomCard(flashcards);
      console.log('New card selected:', {
        questionLength: newCard.question.length,
        answerLength: newCard.answer.length,
      });
      setCurrentCard(newCard);
      setIsFlipped(false);
    }
  };

  const handleFlip = () => {
    console.log('Flipping card, isFlipped:', !isFlipped);
    setIsFlipped(!isFlipped);
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className={styles.testFlashcardContainer}>
      <div className={styles.testFlashcardHeader}>
        <button
          onClick={() => navigate(`/folders/${folderId}/flashcards`)}
          className={styles.testFlashcardButton}
        >
          Back to Flashcards
        </button>
      </div>
      <h1 className={styles.testFlashcardTitle}>Test Your Flashcards</h1>
      {error && <div className={styles.testFlashcardError}>{error}</div>}
      <div className={styles.testFlashcardSection}>
        {currentCard ? (
          <div className={styles.testFlashcardWrapper}>
            <div
              className={`${styles.testFlashcardCard} ${isFlipped ? styles.flipped : ''}`}
              onClick={handleFlip}
            >
              <div className={styles.testFlashcardInner}>
                <div className={styles.testFlashcardFront}>
                  <h3>Question</h3>
                  <p>{currentCard.question}</p>
                </div>
                <div className={styles.testFlashcardBack}>
                  <h3>Answer</h3>
                  <p>{currentCard.answer}</p>
                </div>
              </div>
            </div>
            <button
              onClick={handleNextCard}
              className={`${styles.testFlashcardButton} ${styles.next}`}
            >
              Next Card
            </button>
          </div>
        ) : (
          <p>No flashcards available. Go back to add some!</p>
        )}
      </div>
    </div>
  );
};