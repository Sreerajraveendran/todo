import { useState, useEffect } from 'react';
import type { DropResult } from '@hello-pangea/dnd'; 
import type { BoardState, ColumnId, Todo } from '../types';

const initialBoard: BoardState = {
  todo: [],
  inProgress: [],
  completed: []
};

export function useTodos() {
  const [board, setBoard] = useState<BoardState>(() => {
    const saved = localStorage.getItem('kanban-board');
    return saved ? JSON.parse(saved) : initialBoard;
  });

  const [searchFilter, setSearchFilter] = useState('');

  useEffect(() => {
    localStorage.setItem('kanban-board', JSON.stringify(board));
  }, [board]);

  const addTodo = (title: string, priority: 'low' | 'medium' | 'high') => {
    const newTodo: Todo = {
      id: crypto.randomUUID(),
      title,
      priority,
      completed: false, 
      createdAt: new Date().toISOString()
    };
    
    setBoard((prev: BoardState) => ({
      ...prev,
      todo: [newTodo, ...prev.todo]
    }));
  };

  const deleteTodo = (columnId: ColumnId, taskId: string) => {
    setBoard((prev: BoardState) => ({
      ...prev,
      [columnId]: prev[columnId].filter(t => t.id !== taskId)
    }));
  };

  // NEW: Edit feature logic
  const editTodo = (columnId: ColumnId, taskId: string, newTitle: string, newPriority: 'low' | 'medium' | 'high') => {
    setBoard((prev: BoardState) => ({
      ...prev,
      [columnId]: prev[columnId].map(t => 
        t.id === taskId ? { ...t, title: newTitle, priority: newPriority } : t
      )
    }));
  };

  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const sourceCol = source.droppableId as ColumnId;
    const destCol = destination.droppableId as ColumnId;

    setBoard((prev: BoardState) => {
      const sourceItems = Array.from(prev[sourceCol]);
      const destItems = sourceCol === destCol ? sourceItems : Array.from(prev[destCol]);
      
      const [movedTask] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, movedTask);

      return { ...prev, [sourceCol]: sourceItems, [destCol]: destItems };
    });
  };

  return { board, searchFilter, setSearchFilter, addTodo, deleteTodo, editTodo, handleDragEnd };
}