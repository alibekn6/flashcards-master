import { useState } from 'react';

export const FolderForm = ({ onSubmit }: {
  onSubmit: (name: string) => void;
}) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name);
      setName('');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="folder-form">
      <input
        type="text"
        placeholder="Folder name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        required
      />
      <button type="submit" className='createFolderButton'>Create Folder</button>
    </form>
  );
};