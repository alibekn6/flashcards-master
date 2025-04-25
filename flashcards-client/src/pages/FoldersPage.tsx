import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { foldersApi } from '../api/folders';
import { FolderForm } from '../components/FolderForm';
import { useAuth } from '../hooks/useAuth';
import { Folder } from '../types';

export const FoldersPage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchFolders = async () => {
      try {
        const response = await foldersApi.getFolders();
        setFolders(response.data);
      } catch (err: any) {
        console.error(err);
        setError('Failed to load folders: ' + (err.message || 'Unknown error'));
        navigate('/login');
      } finally {
        setLoading(false);
      }
    };
    fetchFolders();
  }, [user, navigate]);

  const handleCreateFolder = async (name: string) => {
    try {
      const response = await foldersApi.createFolder(name);
      setFolders([...folders, response.data]);
    } catch (err: any) {
      console.error(err);
      setError('Failed to create folder: ' + (err.message || 'Unknown error'));
    }
  };

  const handleDeleteFolder = async (id: number) => {
    try {
      await foldersApi.deleteFolder(id);
      setFolders(folders.filter((folder) => folder.id !== id));
    } catch (err: any) {
      console.error(err);
      setError('Failed to delete folder: ' + (err.message || 'Unknown error'));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container">
      <div className="flex justify-between items-center mb-4">
        <h1>Your library</h1>
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
      {error && <div className="error">{error}</div>}
      <FolderForm onSubmit={handleCreateFolder} />
      <div className="folder-list">
        {folders.map((folder) => (
          <div key={folder.id} className="folder-card">
            <h3 onClick={() => navigate(`/folders/${folder.id}/flashcards`)}>
              {folder.name}
            </h3>
            <button className='delete-button' onClick={() => handleDeleteFolder(folder.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};