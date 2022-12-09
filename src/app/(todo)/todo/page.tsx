import { getCurrentUser } from "~/server/common/get-server-auth-session";
import * as todoApi from "../api";
import AddTodo from "./add-todo";
import { ListTodos } from "./list-todos";

const getAuthorTodos = async (): Promise<todoApi.TodoSerialize[]> => {
  const user = await getCurrentUser();
  return user?.id ? await todoApi.getAuthorTodos(user.id) : [];
};

const TodoPage = async () => {
  const todos = await getAuthorTodos();
  return (
    <div className="mx-auto flex max-w-md flex-col">
      <h1 className="py-4 text-3xl">Todo List</h1>
      <AddTodo />
      <ListTodos todos={todos} />
    </div>
  );
};

export default TodoPage;
