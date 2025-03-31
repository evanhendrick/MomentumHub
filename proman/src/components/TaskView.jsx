import React from "react";
import { useState,  } from "react";
import {  useDispatch } from "react-redux";
import { postTask, updateTask } from "../app/slices/taskSlice";
// import { fetchTasks } from "../app/slices/projectSlice";
import {  deleteTask } from "../app/slices/taskSlice";
import { fetchProjects } from "../app/slices/projectSlice";
import { TaskStyle } from "./TaskStyle";
import _ from "lodash";
import { FaTrashCan } from "react-icons/fa6";
// import e from "express";
// useEffect, useSelector,fetchTasks,

export const TaskView = (props) => {
  const dispatch = useDispatch()
  const [taskText, setTaskText] = useState("");
  
  // we'll make the editing mode occur when you click onto a task
  const [editingMode, setEditingMode] = useState(false)
  const [editedText, setEditedText] = useState("")
  const [beingEdited, setBeingEdited] = useState(null)
  // beingEdited

  // const projectTasks = useSelector((state) => {
  //   return state.storeProjects.projects
  // })

  const handleAddTask = async () => {
    await dispatch(postTask({projId:props.proj._id, taskName:taskText}))
    await dispatch(fetchProjects(props.proj.board))
    setTaskText('')
  };

  const handleDeleteTask = async (taskId) => {
    await dispatch(deleteTask(taskId))
    await dispatch(fetchProjects(props.proj.board))
  }

  const handleEditTask = (task) => {
    console.log("Editing a task!", task)
    setEditedText(task.name)
    setBeingEdited(task)
    setEditingMode(true)
  }

  const handleUpdateTask = async () => {
    console.log("Now we have edited the task", beingEdited)
    // need to update the task which needs a updateRequest
    //take our editedText and submit that to the thunk request
    await dispatch(updateTask({taskId: beingEdited._id, text: editedText}))
    setEditingMode(false)
    await dispatch(fetchProjects(props.proj.board))
  }

  const tasksArray = props.proj.tasks;

  // const renderEditingMode = () => {
  //   <div>
  //     Currently in updating mode
  //     <input
  //     type="text"
  //     value={editedText}
  //     onChange={(e) => setEditedText(e.target.value)}
  //     ></input>
  //     <button
  //     onClick={() => {handleUpdateTask()}}
  //     >Update Task</button>
  //   </div>
  // }

  if(editingMode === true){
    // return renderEditingMode()
    console.log("hendling an edit")
    return (
      <div>
        <input
        type="text"
        value={editedText}
        onChange={(e) => {setEditedText(e.target.value)}}
        ></input>
        <button
        onClick={() => {handleUpdateTask()}}
        >Submit</button>
      </div>
    )
  }

  if (_.isEmpty(tasksArray)) {
    return (
      <div>
        <div>
          <input 
          type="text" 
          placeholder="set new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          ></input>
          <button
          onClick={() => {handleAddTask()}}
          >Add Task</button>
        </div>
        <div>no tasks</div>
      </div>
    );
  } else {
    return (
      <div>
        <div>
          <input 
          type="text" 
          placeholder="set new task"
          value={taskText}
          onChange={(e) => setTaskText(e.target.value)}
          ></input>
          <button
          onClick={() => {handleAddTask()}}
          >Add Task</button>
        </div>
        {tasksArray.map((task) => {
          return (
            <div key={task._id}>
              <div>
                <input type="checkbox"></input>
                <span onClick={() => handleEditTask(task)}>{task.name}</span>
                <button
                onClick={() => {handleDeleteTask(task._id)}}
                >
                  <FaTrashCan />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
};