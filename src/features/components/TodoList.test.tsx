import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach,vi } from 'vitest';
import { TodoList } from './TodoList';

describe('TodoList Integration', () => {
  beforeEach(() => {
    localStorage.clear();
    // Mock Framer Motion to prevent animation issues in test environment
    vi.mock('framer-motion', () => ({
      motion: { div: 'div' },
      AnimatePresence: ({ children }: any) => children,
    }));
  });

  it('renders empty state initially', () => {
    render(<TodoList />);
    expect(screen.getByText('No tasks found.')).toBeInTheDocument();
  });

  it('allows adding a task and then filtering it via search', () => {
    render(<TodoList />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const button = screen.getByRole('button'); // Add button
    
    // 1. Add a task
    fireEvent.change(input, { target: { value: 'Urgent patch' } });
    fireEvent.click(button);
    
    expect(screen.getByText('Urgent patch')).toBeInTheDocument();
    expect(screen.queryByText('No tasks found.')).not.toBeInTheDocument();

    // 2. Search for something else (task should disappear)
    const searchInput = screen.getByPlaceholderText('Search tasks...');
    fireEvent.change(searchInput, { target: { value: 'Backend feature' } });
    
    expect(screen.queryByText('Urgent patch')).not.toBeInTheDocument();
    
    // 3. Search for the task (task should reappear)
    fireEvent.change(searchInput, { target: { value: 'patch' } });
    expect(screen.getByText('Urgent patch')).toBeInTheDocument();
  });
});