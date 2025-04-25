import { useState } from 'react';

export const FlashcardForm = ({ onSubmit }: {
  onSubmit: (data: { question: string; answer: string }) => void;
}) => {
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (question.trim() && answer.trim()) {
      onSubmit({ question, answer });
      setQuestion('');
      setAnswer('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flashcard-form">
      <input
        type="text"
        placeholder="Question"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        required
      />
      <textarea
        placeholder="Answer"
        value={answer}
        onChange={(e) => setAnswer(e.target.value)}
        required
      />
      <button type="submit" className='buttonPrimary'>Add Flashcard</button>
    </form>
  );
};