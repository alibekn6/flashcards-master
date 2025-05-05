import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { flashcardsApi } from "../api/flashcards";
import { FlashcardForm } from "../components/FlashcardForm";
import { useAuth } from "../hooks/useAuth";
import { Flashcard } from "../types";
import { PieChart, Pie, Tooltip, ResponsiveContainer } from "recharts";

export const FlashcardsPage = () => {
  const { folderId } = useParams();
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [aiLoading, setAiLoading] = useState(false);
  const [topic, setTopic] = useState("");
  const [questionCount, setQuestionCount] = useState(5);
  const [progress, setProgress] = useState<{
    totalCount: number;
    answeredCount: number;
    knownCount: number;
    unknownCount: number;
  } | null>(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchFlashcards = async () => {
      try {
        const response = await flashcardsApi.getFlashcards(Number(folderId));
        setFlashcards(response.data);
      } catch (err: any) {
        console.error(err);
        setError(
          "Failed to load flashcards: " + (err.message || "Unknown error")
        );
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchFlashcards();
  }, [folderId, user, navigate]);

  const fetchProgress = async () => {
    try {
      const response = await flashcardsApi.getProgress(Number(folderId));
      setProgress(response.data);
    } catch (err) {
      console.error("Failed to load progress", err);
    }
  };

  fetchProgress();

  const handleCreateFlashcard = async (data: {
    question: string;
    answer: string;
  }) => {
    try {
      const response = await flashcardsApi.createFlashcard(
        Number(folderId),
        data
      );
      setFlashcards([...flashcards, response.data]);
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to create flashcard: " + (err.message || "Unknown error")
      );
    }
  };

  const handleGenerateFlashcards = async () => {
    if (!topic) {
      setError("Please enter a topic");
      return;
    }
    if (questionCount < 1 || questionCount > 20) {
      setError("Question count must be between 1 and 20");
      return;
    }

    setAiLoading(true);
    setError("");
    try {
      const response = await flashcardsApi.generateFlashcards(
        Number(folderId),
        {
          topic,
          count: questionCount,
        }
      );

      // Access the data property from the response
      const newFlashcards = response.data || [];

      // Update state with new flashcards
      setFlashcards((prev) => [...prev, ...newFlashcards]);
      setTopic("");
      setQuestionCount(5);
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to generate flashcards: " + (err.message || "Unknown error")
      );
    } finally {
      setAiLoading(false);
    }
  };

  const handleDeleteFlashcard = async (flashcardId: number) => {
    try {
      await flashcardsApi.deleteFlashcard(Number(folderId), flashcardId);
      setFlashcards(flashcards.filter((card) => card.id !== flashcardId));
    } catch (err: any) {
      console.error(err);
      setError(
        "Failed to delete flashcard: " + (err.message || "Unknown error")
      );
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <div>
          <button
            onClick={() => navigate("/folders")}
            className="buttonPrimary px-4 py-2 rounded mr-2"
          >
            Back to Folders
          </button>
          {flashcards.length > 0 && (
            <button
              onClick={() => navigate(`/folders/${folderId}/flashcards/test`)}
              className="buttonPrimary px-4 py-2 rounded"
            >
              Start Test
            </button>
          )}
        </div>
        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="delete-button px-4 py-2 rounded"
        >
          Logout
        </button>
      </div>
      <h1 className="title-flashcard">Flashcards</h1>

      <div className="bg-white border rounded-lg p-6 shadow-md max-w-xl mx-auto my-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">
          ✨ Generate Flashcards with AI
        </h2>

        {error && <div className="text-red-600 mb-3 text-sm">{error}</div>}

        <div className="space-y-6">
          <div>
            <label
              htmlFor="topic"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Topic
            </label>
            <input
              type="text"
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., World War II, Python Lists"
              className="w-full p-3 border rounded"
            />
          </div>

          <div>
            <label
              htmlFor="count"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Number of flashcards
            </label>
            <select
              id="count"
              value={questionCount}
              onChange={(e) => setQuestionCount(Number(e.target.value))}
              className="w-full p-3 border rounded bg-white"
            >
              {[...Array(20)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleGenerateFlashcards}
            disabled={aiLoading}
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded hover:bg-indigo-700 transition"
          >
            {aiLoading ? (
              <span className="flex items-center justify-center">
                <svg
                  className="animate-spin mr-2 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Generating...
              </span>
            ) : (
              "Generate Flashcards"
            )}
          </button>
        </div>
      </div>

      {progress && (
        <div className="my-6 p-4 border rounded bg-white shadow-md max-w-md mx-auto">
          <h2 className="text-lg font-semibold mb-4">Your Progress</h2>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie
                dataKey="value"
                data={[
                  {
                    name: "Known",
                    value: progress.knownCount,
                    fill: "#10b981",
                  },
                  {
                    name: "Don't Know",
                    value: progress.unknownCount,
                    fill: "#ef4444",
                  },
                  {
                    name: "Unanswered",
                    value:
                      progress.totalCount -
                      (progress.knownCount + progress.unknownCount),
                    fill: "#9ca3af",
                  },
                ]}
                outerRadius={80}
                label
              />
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <p className="text-sm text-gray-600 mt-4 text-center">
            {progress.answeredCount} / {progress.totalCount} flashcards answered
          </p>
        </div>
      )}

      {error && <div className="error">{error}</div>}
      <FlashcardForm onSubmit={handleCreateFlashcard} />
      <div className="flashcard-list mt-4">
        {flashcards.length > 0 ? (
          flashcards.map((flashcard) => (
            <div key={flashcard.id} className="flashcard-card">
              <div className="question">{flashcard.question}</div>
              <div className="answer">{flashcard.answer}</div>
              <button
                onClick={() => handleDeleteFlashcard(flashcard.id)}
                className="delete-button px-2 py-1 rounded"
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <p>No flashcards available. Add some above!</p>
        )}
      </div>
    </div>
  );
};
