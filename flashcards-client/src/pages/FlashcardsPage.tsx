import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { flashcardsApi } from '../api/flashcards';
import { FlashcardForm } from '../components/FlashcardForm';
import { useAuth } from '../hooks/useAuth';
import { Flashcard } from '../types';

export const FlashcardsPage = () => {
  const { folderId } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFlashcards = async () => {
      try {
        const response = await flashcardsApi.getFlashcards(Number(folderId));
        setFlashcards(response.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load flashcards: ' + (err.message || 'Unknown error'));
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [folderId, user, navigate]);

  const handleCreateFlashcard = async (data: { question: string; answer: string }) => {
    try {
      const response = await flashcardsApi.createFlashcard(Number(folderId), data);
      setFlashcards([...flashcards, response.data]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to create flashcard: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteFlashcard = async (flashcardId: number) => {
    try {
      await flashcardsApi.deleteFlashcard(Number(folderId), flashcardId);
      setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete flashcard: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => navigate('/folders')}
            className="buttonPrimary"
          >
            Back to Folders
          </button>
        </div>
        <button
          onClick={() => {
            logout();
            navigate('/login');
          }}
          className="buttonPrimary"
        >
          Logout
        </button>
      </div>
      <h1 className='title-flashcard'>Flashcards</h1>
      {error && <div className="error">{error}</div>}
      <FlashcardForm onSubmit={handleCreateFlashcard} />
      <div className="flashcard-list">
        {flashcards.map((flashcard) => (
          <div key={flashcard.id} className="flashcard-card">
            <div className="question">{flashcard.question}</div>
            <div className="answer">{flashcard.answer}</div>
            <button className='delete-button' onClick={() => handleDeleteFlashcard(flashcard.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};