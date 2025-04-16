import "./App.css";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchBoards } from "./app/slices/boardSlice";
import BoardsView from "./components/BoardsView";
import { CreateBoard } from "./components/CreateBoard";
import _ from "lodash";
import { useNavigate } from "react-router-dom";
import { Header } from "./components/Header";

export default function App() {
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const boards = useSelector((state) => {
    return state.storeBoards.boards;
  });

  useEffect(() => {
    const currentToken = localStorage.getItem("token");

    const localUser = JSON.parse(localStorage.getItem("currentUser"));

    if (_.isEmpty(localUser)) {
      navigate("/");
    }
    if (currentToken) {
      dispatch(fetchBoards(localUser._id));
    }
    if (_.isEmpty(localUser)) {
      console.log("no current user :(");
    }
  }, [dispatch]);

  if (!_.isEmpty(boards)) {
    return (
      <div className="container">
        <Header />
        <CreateBoard />
        <div>
          <BoardsView />
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <Header />
        <CreateBoard />
        <div className="mt-3 alert alert-warning">You have no boards yet</div>
      </div>
    );
  }
}
