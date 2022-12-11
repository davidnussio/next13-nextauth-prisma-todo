import AddTodo from "./add-todo";
import { ListTodos } from "./list-todos";

const TodoPage = async () => {
  return (
    <div className="mx-auto flex max-w-xl flex-col rounded p-4 shadow-2xl shadow-white/20">
      <h1 className="py-4 text-3xl">Todo List</h1>
      <AddTodo />
      <ListTodos />
    </div>
  );
};

export default TodoPage;
