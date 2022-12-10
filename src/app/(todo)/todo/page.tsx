import AddTodo from "./add-todo";
import { ListTodos } from "./list-todos";

const TodoPage = async () => {
  return (
    <div className="mx-auto flex max-w-md flex-col">
      <h1 className="py-4 text-3xl">Todo List</h1>
      <AddTodo />
      <ListTodos />
    </div>
  );
};

export default TodoPage;
