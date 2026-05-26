import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import { TodoItem } from './TodoItem';
import { TodoInput } from './TodoInput';
import type { ColumnId } from '../types';
import { useTodos } from '../hooks/useTodos';

export function TodoList() {
  const {
    board,
    searchFilter,
    addTodo,
    deleteTodo,
    editTodo,
    handleDragEnd,
  } = useTodos();

  const columns: {
    id: ColumnId;
    title: string;
    color: string;
    border: string;
  }[] = [
    {
      id: 'todo',
      title: 'To Do',
      color: 'bg-slate-100',
      border: 'border-slate-300',
    },
    {
      id: 'inProgress',
      title: 'In Progress',
      color: 'bg-blue-50',
      border: 'border-blue-200',
    },
    {
      id: 'completed',
      title: 'Completed',
      color: 'bg-emerald-50',
      border: 'border-emerald-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 via-white to-indigo-50 px-4 py-8">
      <div className="max-w-7xl mx-auto">
        
        {/* HEADER */}
        <header className="mb-10 text-center">
          <h1 className="text-5xl font-black text-slate-900 tracking-tight">
            Todo Workspace new
          </h1>

          <p className="text-slate-500 mt-3 text-lg">
            Organize your workflow beautifully
          </p>
        </header>

        {/* INPUT */}
        <div className="max-w-3xl mx-auto mb-10">
          <TodoInput onAdd={addTodo} />
        </div>

        {/* BOARD */}
        <DragDropContext onDragEnd={handleDragEnd}>
          <div className="flex flex-col lg:flex-row gap-6 mt-8">
            {columns.map((column) => {
              const filteredTasks = board[column.id].filter((t) =>
                t.title
                  .toLowerCase()
                  .includes(searchFilter.toLowerCase())
              );

              return (
                <div
                  key={column.id}
                  className={`flex-1 rounded-3xl border ${column.border} bg-white shadow-xl overflow-hidden`}
                >
                  {/* COLUMN HEADER */}
                  <div
                    className={`px-5 py-4 border-b ${column.border} ${column.color}`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h2 className="text-lg font-bold text-slate-800">
                          {column.title}
                        </h2>

                        <p className="text-sm text-slate-500 mt-1">
                          {filteredTasks.length} Tasks
                        </p>
                      </div>

                      <div className="h-10 w-10 rounded-2xl bg-white shadow-sm flex items-center justify-center text-sm font-bold text-slate-700">
                        {filteredTasks.length}
                      </div>
                    </div>
                  </div>

                  {/* COLUMN BODY --*/}
                  <Droppable droppableId={column.id}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.droppableProps}
                        className={`p-4 min-h-[600px] transition-colors duration-200 ${
                          snapshot.isDraggingOver
                            ? 'bg-slate-50'
                            : ''
                        }`}
                      >
                        {/* EMPTY STATE */}
                        {filteredTasks.length === 0 && (
                          <div className="h-[520px] border-2 border-dashed border-slate-200 rounded-2xl flex flex-col items-center justify-center text-center">
                            <div className="h-16 w-16 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold">
                              +
                            </div>

                            <h3 className="mt-5 text-lg font-semibold text-slate-700">
                              No Tasks Yet
                            </h3>

                            <p className="text-sm text-slate-400 mt-2 px-6">
                              Add a task or drag one here.
                            </p>
                          </div>
                        )}

                        {/* TASKS */}
                        <div className="space-y-4">
                          {filteredTasks.map((todo, index) => (
                            <TodoItem
                              key={todo.id}
                              todo={todo}
                              index={index}
                              columnId={column.id}
                              onDelete={() =>
                                deleteTodo(column.id, todo.id)
                              }
                              onEdit={(
                                newTitle,
                                newPriority
                              ) =>
                                editTodo(
                                  column.id,
                                  todo.id,
                                  newTitle,
                                  newPriority
                                )
                              }
                            />
                          ))}
                        </div>

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
    </div>
  );
}