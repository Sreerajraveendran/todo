import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { TodoInput } from './TodoInput';

// ... rest of your test code

describe('TodoInput Component', () => {
  it('does not call onAdd if input is empty', () => {
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const button = screen.getByRole('button');
    fireEvent.click(button);
    
    expect(mockOnAdd).not.toHaveBeenCalled();
  });

  it('calls onAdd with title and priority when submitted', () => {
    const mockOnAdd = vi.fn();
    render(<TodoInput onAdd={mockOnAdd} />);
    
    const input = screen.getByPlaceholderText('What needs to be done?');
    const select = screen.getByRole('combobox');
    const button = screen.getByRole('button');
    
    fireEvent.change(input, { target: { value: 'Write unit tests' } });
    fireEvent.change(select, { target: { value: 'high' } });
    fireEvent.click(button);
    
    expect(mockOnAdd).toHaveBeenCalledWith('Write unit tests', 'high');
    // Ensure input is cleared after submission
    expect(input).toHaveValue('');
  });
});