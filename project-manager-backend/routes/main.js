require("dotenv").config();

const TOGGLE_API_KEY = process.env.TOGGLE_API_KEY;
const WORKSPACE_ID = process.env.WORKSPACE_ID;

const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const bodyParser = require("body-parser");
const jwt = require("jwt-simple");
const axios = require("axios");

const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

const User = require("../models/user");
const Board = require("../models/board");
const Project = require("../models/project");
const Task = require("../models/task");
const project = require("../models/project");
const { hashPassword } = require("../utils/hash.js");
const { validatePassword } = require("../utils/validate.js");

router.use(passport.initialize());

passport.use(
  "login",
  new LocalStrategy(async (username, password, done) => {
    const user = await User.findOne({ username: username });

    if (!user) {
      return done(null, false, { message: "Username invalid" });
    }
    const isValidPassword = validatePassword(password, user.salt);

    if (isValidPassword === user.hash) {
      console.log("user validated!");
      return done(null, user);
    } else {
      return done(null, false, { message: "Password incorrect" });
    }
  })
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.JWT_SECRET,
};

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, (payload, done) => {
    User.findById(payload.sub).then((user) => {
      if (user) {
        return done(null, user);
      } else {
        return done(error, false);
      }
    });
  })
);

const tokenForUser = (user) => {
  const payload = {
    sub: user._id,
    iat: Math.round(Date.now() / 1000),
    exp: Math.round(Date.now() / 1000 + 5 * 60 * 60),
  };

  // move into .env
  return jwt.encode(payload, process.env.JWT_SECRET);
};

const requireSignin = (request, response, next) => {
  passport.authenticate("login", (err, user, info) => {
    if (err) return next(err);

    if (!user) return response.status(401).json({ error: info.message });

    request.user = user;
    next();
  })(request, response, next);
};
const requireAuth = passport.authenticate("jwt", { session: false });

router.post("/signin", requireSignin, (request, response, next) => {
  response.status(200).json({
    user: request.user,
    token: tokenForUser(request.user),
  });
});

router.post("/signup", async (request, response) => {
  let foundUser = await User.findOne({ username: request.body.username });

  if (foundUser) {
    const returnFailure = {
      message: "Username already exists",
    };
    return response.send(returnFailure);
  }

  try {
    let user = new User();
    user.username = request.body.username;

    const userPassword = hashPassword(request.body.password);
    user.salt = userPassword.salt;
    user.hash = userPassword.hash;

    await user.save();
    response.send("new user saved!");
  } catch (err) {
    console.error("Signup error:", err);
    response.status(500).json({ error: "Failed to create user" });
  }
});

router.post("/save-data", async (request, response) => {
  const body = request.body;
  let user = await User.findById(body.userId);
  let board = new Board();

  board.name = body.name;
  board.user = user;
  board.dueDate = body.date;

  await board.save();

  response.send("new board saved!");
});

router.get("/boards", requireAuth, async (request, response) => {
  let board = await Board.find({ user: request.query.userId }).populate(
    "projects"
  );

  response.send(board);
});

router.get("/boards/:board", async (request, response) => {
  const boardId = request.params;
  let currBoard = await Board.find({ _id: boardId.board });
  response.send(currBoard);
});

router.put("/board/:board", async (request, response) => {
  const body = request.body;
  let boardId = request.body.board.beingUpdated._id;
  let board = await Board.findById(boardId);
  board.name = body.board.editedText;

  await board.save();

  let allBoards = await Board.find();

  response.send(allBoards);
});

router.get("/boards/:board/projects", async (request, response) => {
  const body = request.body;
  const params = request.params;

  let board = await Board.find({ _id: params.board });
  const currBoard = board[0];
  let currProjects = await Project.find({ board: params.board }).populate(
    "tasks"
  );

  response.send(currProjects);
});

router.post("/board/:board/projects", async (request, response) => {
  const params = request.params;
  const body = request.body;
  let board = await Board.find({ _id: params.board });

  try {
    const toggleRes = await axios.post(
      `https://api.track.toggl.com/api/v9/workspaces/${WORKSPACE_ID}/projects`,
      {
        active: true,
        name: body.name,
        wid: WORKSPACE_ID,
        is_private: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: TOGGLE_API_KEY,
          password: "api_token",
        },
      }
    );

    const toggleProjectId = toggleRes.data.id;

    let newProject = new Project();

    newProject.name = body.name;
    newProject.board = params.board;
    newProject.toggleProjectId = toggleProjectId;
    newProject.toggleData = toggleRes.data;
    newProject.isClockedIn = false;

    await board[0].projects.push(newProject);

    await newProject.save();
    await board[0].save();
    response.send("board's projects found");
  } catch (err) {
    console.error(
      "Failed to create Toggl project:",
      err.response?.data || err.message
    );
    response.status(500).json({ error: "Failed to create Toggl project" });
  }
});

router.put("/projects/:project", async (request, response) => {
  let project = await Project.findById(request.params.project);
  project.name = request.body.text;
  project.save();

  response.end();
});

router.put("/tasks/:task", async (request, response) => {
  let task = await Task.findById(request.body.taskId);
  task.name = request.body.text;
  task.save();

  response.end();
});

router.get("/projects/:project", async (request, response) => {
  let currentProject = await Project.find({ _id: request.params.project });

  let projTasks = await Task.find({ project: request.params.project });

  let retObject = {
    project: currentProject,
    tasks: projTasks,
  };

  response.send(retObject);
});

router.get("/projects/:project/tasks", async (request, response) => {
  const projectId = request.params.project;

  let tasks = await Task.find({ project: projectId });

  response.send(tasks);
});

router.post("/projects/:project/tasks", async (request, response) => {
  let project = await Project.findById(request.params.project);

  let newTask = new Task();

  newTask.name = request.body.name;
  newTask.completed = request.body.completed;
  newTask.project = request.body.project;

  project.tasks.push(newTask);

  project.save();
  newTask.save();
  response.send(project);
});

router.delete("/boards/:board", async (request, response) => {
  let boardId = request.params.board;

  let delBoard = await Board.findByIdAndDelete(boardId);
  let delProj = await Project.deleteMany({ board: boardId });

  response.end();
});

router.delete("/projects/:project", async (request, response) => {
  let projId = request.params.project;
  let delProj = await Project.findByIdAndDelete(projId);
  let delTasks = await Task.deleteMany({ project: projId });
  response.end();
});

router.delete("/tasks/:task", async (request, response) => {
  let taskId = request.params.task;
  let task = await Task.findByIdAndDelete(taskId);
  response.end();
});

router.post("/start", async (request, response) => {
  try {
    const res = await axios.post(
      "https://api.track.toggl.com/api/v9/time_entries",
      {
        description: `Started working on project: ${request.body.projName}`,
        created_with: "Momentum Hub io",
        duration: -1,
        start: new Date().toISOString(),
        wid: parseInt(WORKSPACE_ID),
        project_id: parseInt(request.body.toggleId),
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: TOGGLE_API_KEY,
          password: "api_token",
        },
      }
    );

    let project = await Project.findById(request.body.projId);
    project.activeTimer = res.data.id;
    project.isClockedIn = true;
    await project.save();

    response.status(200).json({
      message: `Timer started for ${request.body.projName}`,
      togglEntry: res.data,
    });
  } catch (err) {
    console.error("Failed to start timer:", err.response?.data || err.message);
    response.status(500).json({ error: "Failed to start timer" });
  }
});

router.patch("/stop", async (request, response) => {
  const timeEntryId = request.body.timeEntryId;
  try {
    const res = await axios.patch(
      `https://api.track.toggl.com/api/v9/workspaces/${WORKSPACE_ID}/time_entries/${timeEntryId}/stop`,
      "",
      {
        auth: {
          username: TOGGLE_API_KEY,
          password: "api_token",
        },
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    let project = await Project.findById(request.body.projId);

    project.timeEntryData = res.data;
    project.activeTimer = null;
    project.isClockedIn = false;
    await project.save();

    response.status(200).json({
      message: "stop timer request fulfilled",
      stopTimeEntry: res.data,
    });
  } catch (err) {
    console.error("Failed to stop timer:", err.response?.data || err.message);
    response.status(500).json({ error: "Failed to stop timer" });
  }
});

module.exports = router;
