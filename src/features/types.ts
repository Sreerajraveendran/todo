// src/features/todos/types.ts

// 1. Define the valid column names
export type ColumnId = 'todo' | 'inProgress' | 'completed';

// 2. Define the Todo object
export interface Todo {
  id: string;
  title: string;
  completed: boolean; 
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}

// 3. Define the shape of the entire board
export type BoardState = {
  [key in ColumnId]: Todo[];
};