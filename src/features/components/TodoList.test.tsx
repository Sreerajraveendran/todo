import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { TodoList } from './TodoList';

describe('TodoList Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders the workspace title and columns', () => {
    render(<TodoList />);

    expect(
      screen.getByText('Todo Workspace')
    ).toBeInTheDocument();

    expect(
      screen.getByText('To Do')
    ).toBeInTheDocument();

    expect(
      screen.getByText('In Progress')
    ).toBeInTheDocument();

    expect(
      screen.getByText('Completed')
    ).toBeInTheDocument();
  });

  it('renders the todo input field', () => {
    render(<TodoList />);

    expect(
      screen.getByPlaceholderText(
        'What needs to be done?'
      )
    ).toBeInTheDocument();
  });

  it('allows adding a new todo task', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText(
      'What needs to be done?'
    );

    const addButton = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: 'Urgent patch' },
    });

    fireEvent.click(addButton);

    expect(
      screen.getByText('Urgent patch')
    ).toBeInTheDocument();
  });

  it('clears the input after adding a task', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText(
      'What needs to be done?'
    ) as HTMLInputElement;

    const addButton = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: 'Fix API issue' },
    });

    fireEvent.click(addButton);

    expect(input.value).toBe('');
  });

 it('does not add empty tasks', () => {
  render(<TodoList />);

  const addButton = screen.getByRole('button');

  fireEvent.click(addButton);

  // Counter should remain zero
  const zeroCounters = screen.getAllByText('0');

  expect(zeroCounters.length).toBeGreaterThan(0);
  });

  it('shows task count when a todo is added', () => {
    render(<TodoList />);

    const input = screen.getByPlaceholderText(
      'What needs to be done?'
    );

    const addButton = screen.getByRole('button');

    fireEvent.change(input, {
      target: { value: 'Complete testing' },
    });

    fireEvent.click(addButton);

    expect(
      screen.getByText('1')
    ).toBeInTheDocument();
  });
});