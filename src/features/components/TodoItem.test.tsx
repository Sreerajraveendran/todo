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
    createdAt: new Date().toISOString()
  };

  it('renders the todo details correctly', () => {
    // Added the required columnId and onEdit props
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
    
    // There are now two buttons in view mode: Edit [0] and Delete [1]
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[1]); // Click the Trash button
    
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
    
    // 1. Click the Edit (Pencil) button
    const buttons = screen.getAllByRole('button');
    fireEvent.click(buttons[0]);
    
    // 2. Find the input field and change the text
    const input = screen.getByRole('textbox');
    expect(input).toHaveValue('Fix critical bug');
    fireEvent.change(input, { target: { value: 'Fix minor bug' } });

    // 3. Click the Save (Check) button (which is the first button in edit mode)
    const editModeButtons = screen.getAllByRole('button');
    fireEvent.click(editModeButtons[0]);

    // 4. Verify the onEdit function was called with the new data
    expect(mockOnEdit).toHaveBeenCalledWith('Fix minor bug', 'high');
  });
});