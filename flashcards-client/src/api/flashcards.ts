import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const flashcardsApi = {
  getFlashcards(folderId: number) {
    return api.get(`/folders/${folderId}/flashcards`);
  },

  createFlashcard(folderId: number, data: { question: string; answer: string }) {
    return api.post(`/folders/${folderId}/flashcards`, data);
  },

  updateFlashcard(folderId: number, flashcardId: number, data: { question?: string; answer?: string }) {
    return api.put(`/folders/${folderId}/flashcards/${flashcardId}`, data);
  },

  deleteFlashcard(folderId: number, flashcardId: number) {
    return api.delete(`/folders/${folderId}/flashcards/${flashcardId}`);
  },
};