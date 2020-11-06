import React, { useState, useEffect } from 'react';
import './App.css';
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Register from './register/registerNLogin';
import Dashboard from './dashboard/dashboard';
import socketIOClient from "socket.io-client";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';
const ENDPOINT = "http://localhost:3000";

function App() {
  const dispatch = useDispatch();
  const details = useSelector((state) => state.userDetails);
  const usersTodo = useSelector((state) => state.usersTodo);
  const [snackbarDes, setsnackbarDes] = useState({});
  const usersTodoList = useSelector((state) => state.usersTodoList);
  const [userLogin, setuserLogin] = useState(details);
  const [open, setOpen] = useState(false);
  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }
  const useStyles = makeStyles((theme) => ({
    root: {
      width: '100%',
      '& > * + *': {
        marginTop: theme.spacing(2),
      },
    },
  }));
  const classes = useStyles();
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleToast = (toast) => {
    setsnackbarDes(toast);
    setOpen(true);
  };
  useEffect(() => {
    const socket = socketIOClient(ENDPOINT);
    socket.emit("testing", "hello");
    socket.on("usersTodos", data => {
      console.log("usersTodos", data);
      dispatch({ type: "ONSUBSCRIBE", usersTodo: data })
    });
    socket.on("onUsrCreate", data => {
      console.log("onUsrCreate", data);
      if (details && details.role == 'admin') {
        let obj = { ...data.todo, ...data.userObj };
        dispatch({ type: "CREATEDTODO", createdTodo: obj });
        handleToast({ status: "", message: `${data.userObj.userName} Created New Todo "${data.todo.todo}"`, type: "success" });
      }
    });
    socket.on("onUsrUpdate", data => {
      console.log("connected", data);
      if (details && details.role == 'admin') {
        let obj = { ...data.todo, ...data.userObj };
        dispatch({ type: "UPDATEDTODO", updatedTodo: obj });
        handleToast({ status: "", message: `${data.userObj.userName} Updated "${data.todo.todo}"`, type: "success" });
      }
    });
    socket.on("onUsrComplete", data => {
      console.log("connected", data);
      if (details && details.role == 'admin') {
        let obj = { ...data.todo, ...data.userObj };
        dispatch({ type: "COMPLETEDTODO", completedTodo: obj });
        handleToast({ status: "", message: `${data.userObj.userName} Completed "${data.todo.todo}"`, type: "success" });
      }
    });
  });
  return (
    <div>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert severity={snackbarDes.type}>
          {snackbarDes.message}
        </Alert>
      </Snackbar>
      <Router>
        <Switch>
          <Route path="/" exact component={Register} />
          {details.length == 0 ? <Redirect to="/" /> : ''}
          <Route path="/dashboard" exact component={Dashboard} />
        </Switch>
      </Router>
    </div>

  );
}

export default App;
