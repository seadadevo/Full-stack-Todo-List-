import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import axiosInstance from "../config/axios.config";
import useCustomQuery from "../hooks/useCustomQuery";
import { ITodo } from "../interfaces";
import { onGenerateTodos } from "../utils/functions";
import TodoSkeleton from "./TodoSkeleton";
import Button from "./ui/Button";
import Input from "./ui/Input";
import Modal from "./ui/Modal";
import Textarea from "./ui/Textarea";

const TodoList = () => {
  const storageKey = "loggedInUser";
  const userDataString = localStorage.getItem(storageKey);
  const userData = userDataString ? JSON.parse(userDataString) : null;
  const [isOpenConfirmModal, setIsOpenConfirmModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [isOpenAddModel, setIsOpenAddModel] = useState(false);
  const [queryVersion, setQueryVersion] = useState(1);
  const [todoToEdit, setTodoToEdit] = useState<ITodo>({
    id: 0,
    title: "",
    description: "",
  });
  const [todoToAdd, setTodoToAdd] = useState({
    title: "",
    description: "",
  });

  //   !Handlers (h-t)
  const { isLoading, data } = useCustomQuery({
    queryKey: ["todoList", `${queryVersion}`],
    url: "/users/me?populate=todos",
    config: {
      headers: {
        Authorization: `Bearer ${userData.jwt}`,
      },
    },
  });

  // ! Add Model Handlers
  const onCloseAddModel = () => {
    setTodoToAdd({
      title: "",
      description: "",
    });
    setIsOpenAddModel(false);
  };

  const onOpenAddModel = () => {
    setIsOpenAddModel(true);
  };
  const onChangeAddHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;

    setTodoToAdd({
      ...todoToAdd,
      [name]: value,
    });
  };

  const onSumitAddHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { title, description } = todoToAdd;
    try {
      const { status } = await axiosInstance.post(
        `/todos`,
        {
          data: { title, description, user:[userData.user.id] },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status === 200 || status === 201) {
        onCloseAddModel();
        setQueryVersion((prev) => prev + 1);
        
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  // ! Edit Model Handlers
  const onCloseEditModel = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenEdit(false);
  };

  const onOpenEditModel = (todo: ITodo) => {
    setIsOpenEdit(true);
    setTodoToEdit(todo);
  };

  const onChangeEditHandler = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { value, name } = e.target;

    setTodoToEdit({
      ...todoToEdit,
      [name]: value,
    });
  };

  const onSumitEditHandler = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsUpdating(true);
    const { id, title, description } = todoToEdit;
    try {
      const { status } = await axiosInstance.put(
        `/todos/${id}`,
        {
          data: { title, description },
        },
        {
          headers: {
            Authorization: `Bearer ${userData.jwt}`,
          },
        }
      );

      if (status === 200) {
        onCloseEditModel();
        setQueryVersion((prev) => prev + 1);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };
  // ! Remove Model Handlers
  const closeConfirmModal = () => {
    setTodoToEdit({
      id: 0,
      title: "",
      description: "",
    });
    setIsOpenConfirmModal(false);
    console.log("hello");
  };

  const openConfirmModal = (todo: ITodo) => {
    setTodoToEdit(todo);
    setIsOpenConfirmModal(true);
  };
  const onSubmitRemoveTodo = async () => {
    setIsUpdating(true);
    const { id } = todoToEdit;
    try {
      const { status } = await axiosInstance.delete(`/todos/${id}`, {
        headers: {
          Authorization: `Bearer ${userData.jwt}`,
        },
      });

      if (status === 200) {
        closeConfirmModal();
        setQueryVersion((prev) => prev + 1);
     }
    } catch (error) {
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  };

  if (isLoading)
    return (
      <div className="space-y-1">
        {Array.from({ length: 3 }, (_, idx) => (
          <TodoSkeleton key={idx} />
        ))}
      </div>
    );

  return (
    <div className="space-y-1">
      <div className="w-fit mx-auto my-10">
        {isLoading ? (
          <div className="flex items-center space-x-2">
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
            <div className="w-32 h-9 bg-gray-300 rounded-md dark:bg-gray-400"></div>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <Button size={"sm"} onClick={onOpenAddModel}>
              Post new todo
            </Button>
            <Button variant={"outline"} size={"sm"} onClick={onGenerateTodos}>
              Generate todos
            </Button>
          </div>
        )}
      </div>
      {data.todos.length ? (
        data.todos.map((todo: ITodo) => (
          <div
            key={todo.id}
            className="flex items-center justify-between hover:bg-gray-100 duration-300 p-3 rounded-md even:bg-gray-100"
          >
            <p className="w-md font-semibold">{todo.title}</p>
            <div className="flex items-center justify-end w-md space-x-3">
              <Button size={"sm"} onClick={() => onOpenEditModel(todo)}>
                Edit{" "}
              </Button>
              <Button
                variant={"danger"}
                size={"sm"}
                onClick={() => openConfirmModal(todo)}
              >
                Remove
              </Button>
            </div>
          </div>
        ))
      ) : (
        <p>No todos found</p>
      )}
      {/* ! Add Todo Model */}
      <Modal
        isOpen={isOpenAddModel}
        closeModal={onCloseAddModel}
        title="Add a new todo"
      >
        <form className="space-y-3" onSubmit={onSumitAddHandler}>
          <Input
            name="title"
            value={todoToAdd.title}
            onChange={onChangeAddHandler}
          />
          <Textarea
            name="description"
            value={todoToAdd.description}
            onChange={onChangeAddHandler}
          />
          <div className="flex items-center space-x-2">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              ADD
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseAddModel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* ! Edit Todo Model */}
      <Modal
        isOpen={isOpenEdit}
        closeModal={onCloseEditModel}
        title="Edit this todo"
      >
        <form className="space-y-3" onSubmit={onSumitEditHandler}>
          <Input
            name="title"
            value={todoToEdit.title}
            onChange={onChangeEditHandler}
          />
          <Textarea
            name="description"
            value={todoToEdit.description}
            onChange={onChangeEditHandler}
          />
          <div className="flex items-center space-x-2">
            <Button
              className="bg-indigo-700 hover:bg-indigo-800"
              isLoading={isUpdating}
            >
              Update
            </Button>
            <Button type="button" variant={"cancel"} onClick={onCloseEditModel}>
              Cancel
            </Button>
          </div>
        </form>
      </Modal>
      {/* ! Remove Todo Model */}
      <Modal
        isOpen={isOpenConfirmModal}
        closeModal={closeConfirmModal}
        title="Are you sure you want to remove this Todo from your Store?"
        description="Deleting this Todo will remove it permanently from your inventory. Any associated data, sales history, and other related information will also be deleted. Please make sure this is the intended action."
      >
        <div className="flex items-center space-x-3">
          <Button
            variant={"danger"}
            size={"sm"}
            isLoading={isUpdating}
            onClick={onSubmitRemoveTodo}
          >
            Yes, remove
          </Button>
          <Button
            type="button"
            variant={"cancel"}
            size={"sm"}
            onClick={closeConfirmModal}
          >
            Cancel
          </Button>
        </div>
      </Modal>
    </div>
  );
};

export default TodoList;
