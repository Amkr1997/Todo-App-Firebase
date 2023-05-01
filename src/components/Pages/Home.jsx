import React, { Fragment, useEffect, useState } from "react";
import classes from "./css/Home.module.css";
import NavBar from "../Layouts/NavBar";
import { AiOutlinePlus } from "react-icons/ai";
import { MdDeleteForever } from "react-icons/md";
import { useAuth } from "../../firebaseConfig/auth";
import Loader from "../Layouts/Loader";
import { useNavigate } from "react-router-dom";
import {
  collection,
  addDoc,
  getDocs,
  where,
  query,
  deleteDoc,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "../../firebaseConfig/config";

//const arr = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16];

const Home = () => {
  const { authUser, isLoading, signOut } = useAuth();

  const [todo, setTodo] = useState("");
  const [todos, setTodos] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    if (!isLoading && !authUser) {
      navigate("/login");
    }

    if (!!authUser) {
      fetchTodoHandler(authUser.uid);
    }
  }, [authUser, isLoading]);

  const addTodoHandler = async () => {
    try {
      const docReference = await addDoc(collection(db, "todos"), {
        completed: false,
        content: todo,
        owner: authUser.uid,
      });
      //  console.log(`document written with ID : ${docReference.id}`);

      fetchTodoHandler(authUser.uid);
      setTodo("");
    } catch (error) {
      console.error(error);
    }
  };

  const deleteTodoHandler = async (docId) => {
    try {
      await deleteDoc(doc(db, "todos", docId));
      fetchTodoHandler(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchTodoHandler = async (uid) => {
    const q = query(collection(db, "todos"), where("owner", "==", uid));
    const querySnapShot = await getDocs(q);

    let data = [];

    querySnapShot.forEach((doc) => {
      //  console.log(doc.id, "=>", doc.data());
      data.push({ ...doc.data(), id: doc.id });
    });

    setTodos(data);
  };

  const markCompleteHandler = async (event, docId) => {
    try {
      const docReference = doc(db, "todos", docId);
      await updateDoc(docReference, {
        completed: event.target.checked,
      });
      fetchTodoHandler(authUser.uid);
    } catch (error) {
      console.error(error);
    }
  };

  const keyUp = async (event) => {
    if (event.key === "Enter" && todo.length > 0) {
      addTodoHandler();
    }
  };

  return !authUser ? (
    <Loader />
  ) : (
    <Fragment>
      <div className={classes.container}>
        <div className={classes.header}>
          <NavBar signout={signOut} />
        </div>
        <div className={classes.main}>
          <div className={classes.mainElements}>
            <div className={classes.headings}>
              <span className={classes.headingLogo}>📝</span>
              <h1 className={classes.mainHeading}>ToooDoooS</h1>
            </div>
            <div className={classes.type}>
              <input
                type="text"
                placeholder={`👋 Hello user, Write your toodos!`}
                autoFocus
                value={todo}
                className={classes.input}
                onChange={(e) => {
                  setTodo(e.target.value);
                }}
                onKeyUp={keyUp}
              />
              <button className={classes.addButton} onClick={addTodoHandler}>
                <AiOutlinePlus className={classes.addButtonDesign} />
              </button>
            </div>
          </div>

          <div className={classes.todoShowcase}>
            {todos.length > 0 &&
              todos.map((todo) => (
                <div key={todo.id} className={classes.todos}>
                  <div className={classes.todo}>
                    <input
                      id={`todo-${todo.id}`}
                      type="checkbox"
                      className={classes.inputCheck}
                      checked={todo.completed}
                      onChange={(e) => {
                        markCompleteHandler(e, todo.id);
                      }}
                    />
                    <label
                      htmlFor={`todo-${todo.id}`}
                      className={`${classes.todoContent} ${
                        todo.completed ? classes.lineThrough : ""
                      }`}
                    >
                      {todo.content}
                    </label>
                  </div>
                  <div className={classes.deleteBtn}>
                    <MdDeleteForever
                      className={classes.deleteBtnDesign}
                      onClick={() => deleteTodoHandler(todo.id)}
                    />
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default Home;
