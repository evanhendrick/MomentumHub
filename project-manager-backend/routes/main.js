const mongoose = require("mongoose");
const router = require("express").Router();
const passport = require("passport");
const bodyParser = require('body-parser')
const jwt = require('jwt-simple')

const LocalStrategy = require("passport-local").Strategy;
const JwtStrategy = require('passport-jwt').Strategy
const ExtractJwt = require('passport-jwt').ExtractJwt

const User = require("../models/user");
const Board = require("../models/board");
const Project = require("../models/project");
const Task = require("../models/task");

router.use(passport.initialize());

passport.use(
  "login",
  new LocalStrategy( async(username, password, done) => {
    console.log("LocalStrategy", username, password);
    const user = await User.findOne({username: username})
    console.log("local strategy validation", user)

    if (!user) {
      console.log("username not found...")
      return done(null, false, {message: "Username not found"})
    } else if(user && user.password !== password) {
      // check their password
      console.log("passwords do not match")
      return done(null, false, {message: "Password incorrect"})
    } else {
      console.log("User found!", user)
      return done(null, user);
    }
  })
);

const jwtOptions = {
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: "bananas"
}

passport.use(
  "jwt",
  new JwtStrategy(jwtOptions, (payload, done) => {
    // console.log("JWT STRATEGY")
    // console.log("jwt strategy payload", payload.sub)
    User.findById(payload.sub).then((user) => {
      if(user){
        return done(null, user)
      } else {
        return done(error, false)
      }
    })
  })
)

const tokenForUser = (user) => {

  console.log("token for user", user)
  
    const payload = {
      sub: user._id,
      iat: Math.round(Date.now()/1000),
      exp: Math.round(Date.now()/1000+5*60*60)
    }

    // console.log("payload before jwt encoding", payload)

  return jwt.encode(payload, "bananas")
}

// const requireSignin = passport.authenticate("login", {session:false})
const requireSignin = (request, response, next) => {
  passport.authenticate("login", (err, user, info) => {

    console.log("Passport.authenticate", err, user, info)
    if(err) return next(err)
    
      //returns incorrect username || password depending on LocalStrategy
    if(!user) return response.status(401).json({error: info.message})

    request.user = user
    next()
  }) (request, response, next)
}
const requireAuth = passport.authenticate('jwt', {session:false})

router.post("/signin", requireSignin, (request, response, next) => {
  // console.log('request user>>', request.user)
  response.send(
    {
      token: tokenForUser(request.user)
    }
  )
})

router.get("/protected", requireAuth, (request, response) => {
  console.log("request for protected access received", request.headers.authorization)
  const protectedData = {
    userData: "important protected data",
    userId: request.user._id
  }
  response.send(protectedData)
})

router.post("/signup", async (request, response) => {
  console.log("signup request received", request.body);
  let user = new User();
  user.username = request.body.username;
  user.password = request.body.password;

  console.log("new user:", user);
  user.save();

  response.end();
});

// route#1
router.post("/save-data", async (request, response) => {
  const body = request.body;
  console.log("board save-data request body", body);
  let board = new Board();

  board.name = body.name;
  console.log("new board saved!", board);

  await board.save();

  response.send("new board saved!");
});


// route#2
router.get("/boards", requireAuth, async (request, response) => {
  let board = await Board.find();

  console.log(" GET /boards");

  response.send(board);
});

// route 3
router.get("/boards/:board", async (request, response) => {
  const boardId = request.params;
  console.log("Getting current board", boardId);
  let currBoard = await Board.find({ _id: boardId.board });
  // going to need an id here
  // const boardId = request.body.
  // let board = Board.find({_id: })
  response.send(currBoard);
});

// route 4
router.put("/board/:board", async (request, response) => {
  const body = request.body;
  let boardId = request.body.board.beingUpdated._id;
  let board = await Board.findById(boardId);
  board.name = body.board.editedText;

  await board.save();

  let allBoards = await Board.find();

  response.send(allBoards);
});

//route 5
//get projects for particular board
router.get("/boards/:board/projects", async (request, response) => {
  const body = request.body;
  const params = request.params;

  let board = await Board.find({ _id: params.board });
  const currBoard = board[0];
  let currProjects = await Project.find({ board: params.board }).populate(
    "tasks"
  );

  // also I need to adjust the mongoose schema for projects
  // adjust the async thunk that refers to the endpoint below
  response.send(currProjects);
});

// route #
// router.get("/projects", async (request, response) => {
//   console.log("request received");
//   let projects = await Project.find({});

//   // need to send back each project with its respective tasks
//   projects.forEach( async (proj) => {
//     let thisTasks = await Task.find({ project: proj._id})

//   })
//   response.send(projects);
// });

// route 6
router.post("/board/:board/projects", async (request, response) => {
  console.log("backend boards projects post endpoint", request.params);
  const params = request.params;
  const body = request.body;
  let board = await Board.find({ _id: params.board });
  // console.log("if found board", board)
  console.log("project properties", body);

  let newProject = new Project();

  newProject.name = body.name;
  newProject.board = params.board;

  // console.log('board.projects >>', board[0].projects)

  await board[0].projects.push(newProject);

  // params to find board
  // body to post new Project to it

  newProject.save();
  board[0].save();
  response.send("board's projects found");
});

// update projects
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

router.post("/project", (request, response) => {
  const params = request.body;
  // console.log("request params for project post route", params)

  let project = new Project();

  project.name = params.name;
  project.complete = false;
  project.board = project.save();
  // console.log("fetch request received")
  // response.send("Welcome to the boards page")
  response.json(project);
});

// return tasks here instead
router.get("/projects/:project", async (request, response) => {
  console.log("/projects/:project", request.params);
  let currentProject = await Project.find({ _id: request.params.project });

  let projTasks = await Task.find({ project: request.params.project });

  console.log("ProjectTasks", projTasks);

  let retObject = {
    project: currentProject,
    tasks: projTasks,
  };
  console.log("backend current project >>", retObject);

  response.send(retObject);
});

router.get("/projects/:project/tasks", async (request, response) => {
  const projectId = request.params.project;
  // get current project > then find tasks for that project
  // const objectId = new mongoose.Types.ObjectId(projectId)
  console.log("object id: ", projectId);

  let tasks = await Task.find({ project: projectId });
  console.log("tasks endpoint", tasks, request.params);

  response.send(tasks);
});

router.post("/projects/:project/tasks", async (request, response) => {
  console.log("Requst params", request.params);
  console.log("request body", request.body);
  let project = await Project.findById(request.params.project);

  console.log(project);

  let newTask = new Task();

  newTask.name = request.body.name;
  newTask.completed = request.body.completed;
  newTask.project = request.body.project;

  project.tasks.push(newTask);

  console.log("project with tasks saved", project);
  // do I have to save the project after I push it?

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

module.exports = router;
