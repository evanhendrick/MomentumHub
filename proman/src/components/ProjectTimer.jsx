import React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchProjects,
  projectTimerStart,
  projectTimerStop,
} from "../app/slices/projectSlice";
import { GiAlarmClock } from "react-icons/gi";

export const ProjectTimer = (props) => {
  const dispatch = useDispatch();

  const currentBoard = useSelector((state) => {
    return state.storeBoards.currBoard;
  });
  const boardProjects = useSelector((state) => {
    return state.storeProjects.projects;
  });

  let timeEntryId = null;
  if (props.proj.activeTimer) {
    timeEntryId = props.proj.activeTimer;
  }
  let timeEntryData = null;
  if (props.proj.timeEntryData) {
    timeEntryData = props.proj.timeEntryData;
  }
  let clockedIn = props.proj.isClockedIn;

  const clockInOrOut = () => {
    if (clockedIn == false) {
      startTimer();
    } else if (clockedIn == true) {
      stopTimer();
    } else {
      alert("I think clockInOrOut function is broken...?");
    }
  };

  const startTimer = async () => {
    await dispatch(
      projectTimerStart({
        projName: props.proj.name,
        projId: props.proj._id,
        toggleId: props.proj.toggleProjectId,
      })
    );
    dispatch(fetchProjects(currentBoard._id));
  };

  const stopTimer = async () => {
    if (!timeEntryId) {
      alert("There is no active timer to stop");
    } else {
      await dispatch(
        projectTimerStop({
          projName: props.proj.name,
          projId: props.proj._id,
          timeEntryId,
        })
      );
      dispatch(fetchProjects(currentBoard._id));
    }
  };

  return (
    <div className="container mt-4">
      <div className="card p-4 shadow-sm">
        <div className="d-flex align-items-center mb-3">
          {clockedIn ? (
            <button
              className="btn btn-warning me-3"
              onClick={() => {
                clockInOrOut();
              }}
            >
              <GiAlarmClock size="24px" className="me-2" /> Clock out
            </button>
          ) : (
            <button
              className="btn btn-primary me-3"
              onClick={() => {
                clockInOrOut();
              }}
            >
              <GiAlarmClock size="24px" className="me-2" /> Clock in
            </button>
          )}
          {clockedIn ? (
            <span className="badge bg-success">Clocked In</span>
          ) : (
            <span className="badge bg-secondary">Clocked Out</span>
          )}
        </div>

        <div>
          {timeEntryData ? (
            <div className="mb-1">
              <strong>Clocked in at:</strong>{" "}
              {new Date(timeEntryData.start).toLocaleString()}
            </div>
          ) : null}
          {timeEntryData ? (
            <div className="mb-1">
              <strong>Clocked out at:</strong>{" "}
              {new Date(timeEntryData.stop).toLocaleString()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
