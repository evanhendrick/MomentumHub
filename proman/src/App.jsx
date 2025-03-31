// import styled from "styled-components";
import "./App.css";
import { useEffect, } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoards } from "./app/slices/boardSlice";
import BoardsView from "./components/BoardsView";
import { CreateBoard } from "./components/CreateBoard";
import _ from "lodash"
// import { BoardDetail } from "./components/BoardStyle"; not sure it I need to use this yet

export default function App() {
  // const [currBoard, setCurrBoard] = useState({});

  const dispatch = useDispatch();
  const boards = useSelector((state) => {
    return state.storeBoards.boards;
  });

  useEffect(() => {
    dispatch(fetchBoards());
  }, [dispatch]);

  if (!_.isEmpty(boards)) {
    return (
      <div className="container">
        <div className="row">header</div>
        <CreateBoard />
        <div>
          <div className="row">User's Boards: </div>
          <BoardsView />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <CreateBoard />
        <div>You have no boards yet</div>
      </div>
    );
  }
}


// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
    
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
