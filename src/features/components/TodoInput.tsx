import { useState } from 'react';
import { Plus } from 'lucide-react';

interface TodoInputProps {
  onAdd: (title: string, priority: 'low' | 'medium' | 'high') => void;
}

export function TodoInput({ onAdd }: TodoInputProps) {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<'low' | 'medium' | 'high'>('medium');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    onAdd(title, priority);
    setTitle('');
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6">
      <div className="flex gap-3 items-center">
        <input 
          type="text" 
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="What needs to be done?"
          className="flex-1 bg-transparent border-none focus:ring-0 text-lg placeholder:text-slate-400 outline-none"
        />
        <select 
          value={priority} 
          onChange={(e) => setPriority(e.target.value as 'low' | 'medium' | 'high')}
          className="text-xs font-medium uppercase tracking-wider bg-slate-100 p-2 border-none rounded-lg focus:ring-0 cursor-pointer outline-none"
        >
          <option value="low">Low</option>
          <option value="medium">Medium</option>
          <option value="high">High</option>
        </select>
        <button type="submit" className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 transition-colors">
          <Plus size={20} />
        </button>
      </div>
    </form>
  );
}