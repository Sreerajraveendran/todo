import { useState } from 'react';
import { Draggable } from '@hello-pangea/dnd';
import { Trash2, Flag, GripVertical, Pencil, Check, X } from 'lucide-react';
import clsx from 'clsx';
import type { ColumnId  , Todo } from '../types';

interface TodoItemProps {
  todo: Todo;
  index: number;
  columnId: ColumnId;
  onDelete: () => void;
  onEdit: (title: string, priority: 'low' | 'medium' | 'high') => void;
}

export function TodoItem({ todo, index, columnId, onDelete, onEdit }: TodoItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(todo.title);
  const [editPriority, setEditPriority] = useState(todo.priority);

  const handleSave = () => {
    if (editTitle.trim()) {
      onEdit(editTitle, editPriority);
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditTitle(todo.title);
    setEditPriority(todo.priority);
    setIsEditing(false);
  };

  const priorityColors = {
    low: 'text-blue-600 bg-blue-100/80',
    medium: 'text-amber-600 bg-amber-100/80',
    high: 'text-rose-600 bg-rose-100/80'
  };

  // Dynamic colors based on the current column state!
  const stateColors = {
    todo: 'bg-white border-slate-200',
    inProgress: 'bg-blue-50 border-blue-200',
    completed: 'bg-emerald-50 border-emerald-200 opacity-90'
  };

  return (
    <Draggable draggableId={todo.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={clsx(
            "p-4 mb-3 rounded-xl border transition-all flex justify-between items-center shadow-sm",
            stateColors[columnId], // Applies the column color
            snapshot.isDragging && "shadow-xl scale-[1.02] z-50 ring-2 ring-indigo-500 border-transparent"
          )}
        >
          {isEditing ? (
            /* EDIT MODE UI */
            <div className="flex-1 flex gap-2 items-center w-full">
              <input 
                type="text" 
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
                autoFocus
                className="flex-1 px-2 py-1 text-sm border rounded outline-none focus:ring-2 focus:ring-indigo-400"
              />
              <select 
                value={editPriority}
                onChange={(e) => setEditPriority(e.target.value as 'low'|'medium'|'high')}
                className="text-xs p-1 border rounded outline-none"
              >
                <option value="low">Low</option>
                <option value="medium">Med</option>
                <option value="high">High</option>
              </select>
              <button onClick={handleSave} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded">
                <Check size={16} />
              </button>
              <button onClick={handleCancel} className="p-1 text-rose-600 hover:bg-rose-100 rounded">
                <X size={16} />
              </button>
            </div>
          ) : (
            /* VIEW MODE UI */
            <>
              <div className="flex items-center gap-3 overflow-hidden">
                <div {...provided.dragHandleProps} className="text-slate-400 hover:text-slate-600 cursor-grab shrink-0">
                  <GripVertical size={20} />
                </div>
                
                  <div className="flex flex-col break-words">
                    <span
                    className={clsx(
                    "text-sm font-medium text-slate-800 whitespace-normal break-words",
                    columnId === 'completed' && "line-through text-slate-500"
                    )}
>                    {todo.title}
                  </span>
                  <span className="text-xs text-slate-400">
                    {new Date(todo.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0 ml-2">
                <span className={clsx("px-2 py-1 rounded text-[10px] font-bold uppercase tracking-wider mr-1", priorityColors[todo.priority])}>
                  <Flag size={10} className="inline mr-1" />{todo.priority}
                </span>
                <button
                  aria-label="edit-task"
                  onClick={() => setIsEditing(true)}
                  className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors"
                > 
                <Pencil size={16} />
                </button>
                <button onClick={onDelete} aria-label="delete-task" className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors">
                  <Trash2 size={16} />
                </button>
              </div>
            </>
          )}
        </div>
      )}
    </Draggable>
  );
}