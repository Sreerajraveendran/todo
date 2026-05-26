import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { TodoItem } from './TodoItem';
import type { Todo } from '../types';

// Helper function to wrap Draggable components in a fake DND environment for testing
const renderWithDnd = (ui: React.ReactElement) => {
  return render(
    <DragDropContext onDragEnd={() => {}}>
      <Droppable droppableId="test-droppable">
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {ui}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

describe('TodoItem Component', () => {
  const mockTodo: Todo = {
    id: '1',
    title: 'Fix critical bug',
    completed: false,
    priority: 'high',
    createdAt: new Date().toISOString(),
  };

  it('renders the todo details correctly', () => {
    renderWithDnd(
      <TodoItem
        todo={mockTodo}
        index={0}
        columnId="todo"
        onDelete={vi.fn()}
        onEdit={vi.fn()}
      />
    );

    expect(screen.getByText('Fix critical bug')).toBeInTheDocument();
    expect(screen.getByText('high')).toBeInTheDocument();
  });

  it('calls onDelete when the trash button is clicked', () => {
    const mockOnDelete = vi.fn();

    renderWithDnd(
      <TodoItem
        todo={mockTodo}
        index={0}
        columnId="todo"
        onDelete={mockOnDelete}
        onEdit={vi.fn()}
      />
    );

    // buttons[0] -> drag handle
    // buttons[1] -> edit button
    // buttons[2] -> delete button
    const buttons = screen.getAllByRole('button');

    fireEvent.click(buttons[2]);

    expect(mockOnDelete).toHaveBeenCalledTimes(1);
  });

  it('enters edit mode and calls onEdit when saved', () => {
    const mockOnEdit = vi.fn();

    renderWithDnd(
      <TodoItem
        todo={mockTodo}
        index={0}
        columnId="todo"
        onDelete={vi.fn()}
        onEdit={mockOnEdit}
      />
    );

    // buttons[0] -> drag handle
    // buttons[1] -> edit button
    // buttons[2] -> delete button
    const editButton = screen.getByLabelText('edit-task');

    fireEvent.click(editButton);

    // Verify textbox appears
    const input = screen.getByRole('textbox');

    expect(input).toHaveValue('Fix critical bug');

    // Change value
    fireEvent.change(input, {
      target: { value: 'Fix minor bug' },
    });

    // In edit mode:
    // buttons[0] -> save
    // buttons[1] -> cancel
    const editModeButtons = screen.getAllByRole('button');

    // Click save
    fireEvent.click(editModeButtons[0]);

    // Verify edit callback
    expect(mockOnEdit).toHaveBeenCalledWith(
      'Fix minor bug',
      'high'
    );
  });
});