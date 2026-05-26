import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import type { DropResult } from '@hello-pangea/dnd';import { useTodos } from './useTodos';

describe('useTodos Kanban Hook', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock randomUUID for consistent test data
    let counter = 0;
    Object.defineProperty(window, 'crypto', {
      value: { randomUUID: () => `test-uuid-${counter++}` },
      configurable: true
    });
  });

  it('should initialize with an empty board', () => {
    const { result } = renderHook(() => useTodos());
    expect(result.current.board.todo).toEqual([]);
    expect(result.current.board.inProgress).toEqual([]);
    expect(result.current.board.completed).toEqual([]);
  });

  it('should add a new todo strictly to the "todo" column', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Kanban Task', 'high');
    });

    // It should exist in 'todo', but NOT in the others
    expect(result.current.board.todo).toHaveLength(1);
    expect(result.current.board.inProgress).toHaveLength(0);
    expect(result.current.board.todo[0].title).toBe('Kanban Task');
    expect(result.current.board.todo[0].priority).toBe('high');
  });

  it('should delete a todo from a specific column', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Task to delete', 'medium');
    });
    
    const taskId = result.current.board.todo[0].id;
    
    act(() => {
      // Must provide the columnId now
      result.current.deleteTodo('todo', taskId);
    });

    expect(result.current.board.todo).toHaveLength(0);
  });

  it('should move a task between columns when dragged and dropped', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Move me', 'low');
    });

    // Simulate the exact object @hello-pangea/dnd creates when dropping
    const mockDropResult = {
      source: { droppableId: 'todo', index: 0 },
      destination: { droppableId: 'inProgress', index: 0 },
      draggableId: result.current.board.todo[0].id,
      type: 'DEFAULT',
      mode: 'FLUID',
      reason: 'DROP'
    } as DropResult;

    act(() => {
      result.current.handleDragEnd(mockDropResult);
    });

    // The task should have left 'todo' and entered 'inProgress'
    expect(result.current.board.todo).toHaveLength(0);
    expect(result.current.board.inProgress).toHaveLength(1);
    expect(result.current.board.inProgress[0].title).toBe('Move me');
  });

  it('should reorder tasks within the same column', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('First Task', 'low');
      result.current.addTodo('Second Task', 'high'); 
      // Note: Because hook does [newTodo, ...prev], 'Second Task' is at index 0.
    });

    const mockDropResult = {
      source: { droppableId: 'todo', index: 0 }, // Grabbing 'Second Task'
      destination: { droppableId: 'todo', index: 1 }, // Moving it below 'First Task'
      draggableId: result.current.board.todo[0].id,
    } as DropResult;

    act(() => {
      result.current.handleDragEnd(mockDropResult);
    });

    expect(result.current.board.todo).toHaveLength(2);
    // After reordering, 'First Task' should now be at index 0
    expect(result.current.board.todo[0].title).toBe('First Task');
    expect(result.current.board.todo[1].title).toBe('Second Task');
  });

  it('should not break if dropped outside a valid column', () => {
    const { result } = renderHook(() => useTodos());
    
    act(() => {
      result.current.addTodo('Safe task', 'low');
    });

    const mockDropResult = {
      source: { droppableId: 'todo', index: 0 },
      destination: null, // Dropped outside
      draggableId: 'some-id',
    } as unknown as DropResult;

    act(() => {
      result.current.handleDragEnd(mockDropResult);
    });

    // Data should remain untouched
    expect(result.current.board.todo).toHaveLength(1);
  });
});