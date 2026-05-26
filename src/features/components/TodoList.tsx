import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import type { ColumnId } from '../types';
import { useTodos } from '../hooks/useTodos';

export function TodoList() {
 const { board, searchFilter,  addTodo, deleteTodo, editTodo, handleDragEnd } = useTodos();

  const columns: { id: ColumnId; title: string }[] = [
    { id: 'todo', title: 'To Do' },
    { id: 'inProgress', title: 'In Progress' },
    { id: 'completed', title: 'Completed' }
  ];

  return (
    <div className="max-w-6xl mx-auto p-1 py-5">
      <header className="mb-8 text-center">
        <h1 className="text-3xl font-bold text-slate-900">Todo Workspace</h1>
      </header>

      <div className="max-w-2xl mx-auto">
         <TodoInput onAdd={addTodo} />
      </div>

      <DragDropContext onDragEnd={handleDragEnd}>
        <div className="flex flex-col md:flex-row gap-6 mt-8 overflow-x-auto pb-4 snap-x">
          {columns.map(column => {
            const filteredTasks = board[column.id].filter(t => 
              t.title.toLowerCase().includes(searchFilter.toLowerCase())
            );

            return (
              <div key={column.id} className="bg-slate-100/50 rounded-2xl p-4 flex flex-col h-[600px]">
                <h2 className="font-bold text-slate-700 mb-4 flex justify-between items-center">
                  {column.title}
                  <span className="bg-slate-200 text-slate-600 text-xs px-2 py-1 rounded-full">
                    {filteredTasks.length}
                  </span>
                </h2>

                <Droppable droppableId={column.id}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      className={`flex-1 overflow-y-auto rounded-xl transition-colors ${
                        snapshot.isDraggingOver ? 'bg-slate-200/50' : ''
                      }`}
                    >

                    {filteredTasks.map((todo, index) => (
                        <TodoItem 
                          key={todo.id} 
                          todo={todo} 
                          index={index} 
                          columnId={column.id} // Passing down the state color
                          onDelete={() => deleteTodo(column.id, todo.id)} 
                          onEdit={(newTitle, newPriority) => editTodo(column.id, todo.id, newTitle, newPriority)} // Passing down the edit function
  />
                    ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
}