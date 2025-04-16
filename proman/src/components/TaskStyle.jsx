import React from "react";
import { useSelector } from "react-redux";
import _ from "lodash";

export const TaskStyle = () => {
  const tasks = useSelector((state) => {
    return state.storeTasks.tasks;
  });

  if (!_.isEmpty(tasks)) {
    return (
      <div>
        <div>This is our Task Style</div>
        <div>
          TaskStyle calls current task state, returns Link for Home (parent
          component), Renders task lists...
        </div>
        <div>
          {tasks.map((task) => {
            return (
              <li onClick={() => {}} key={task._id}>
                {task.name}
              </li>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <div>No current tasks for this project</div>;
  }
};
