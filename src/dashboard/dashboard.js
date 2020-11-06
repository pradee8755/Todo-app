import React, { useState, useEffect } from "react";
import './dashboard.css';
import todoLogo from '../images/png/todoLogo.png';
import { AgGridColumn, AgGridReact } from 'ag-grid-react';
import 'ag-grid-community/dist/styles/ag-grid.css';
import 'ag-grid-community/dist/styles/ag-theme-alpine.css';
import { Link } from "react-router-dom";
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Dashboard() {
    const details = useSelector((state) => state.userDetails);
    const usersTodo = useSelector((state) => state.usersTodo);
    const usersTodoList = useSelector((state) => state.usersTodoList);
    const createdTodo = useSelector((state) => state.createdTodo);
    const updatedTodo = useSelector((state) => state.updatedTodo);
    const completedTodo = useSelector((state) => state.completedTodo);
    const [snackbarDes, setsnackbarDes] = useState({});
    const [open, setOpen] = useState(false);
    const login = { todo: "", priority: "" };
    const [loginDetails, setLoginDetails] = useState(login);
    const [rowDetails, setRowDetails] = useState({});
    const [changedTodoDes, setchangedTodoDes] = useState({ newTodo: "" });
    const dispatch = useDispatch();
    let userDetails = details;
    const [newTodo, setNewTodo] = useState(false);
    const [rowData, setRowData] = useState(userDetails && userDetails.role == "user" ? userDetails.todos : usersTodoList);


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
        if (usersTodo && userDetails.role !== 'user') {
            let arr = [];
            usersTodo.forEach((obj, i) => {
                obj.todo.forEach((value, index) => {
                    value["userName"] = obj.userName;
                    value["userId"] = obj.userId;
                });
                arr.push(...obj.todo);
            });
            console.log("list");
            setRowData(arr);
            dispatch({ type: "USERSTODOLIST", usersTodoList: arr })
        }
    }, [usersTodo]);
    useEffect(() => {
        if (createdTodo) {
            setRowData([...usersTodoList, createdTodo])
        }
    }, [createdTodo]);
    useEffect(() => {
        if (updatedTodo) {
            rowData.forEach((todo, i) => {
                if (todo.todoId == updatedTodo.todoId) {
                    usersTodoList.splice(i, 1);
                };
            });
            setRowData([...usersTodoList, updatedTodo])
        }
    }, [updatedTodo]);
    useEffect(() => {
        if (completedTodo) {
            rowData.forEach((todo, i) => {
                if (todo.todoId == updatedTodo.todoId) {
                    usersTodoList.splice(i, 1);
                };
            });
            setRowData([...usersTodoList, completedTodo])
        }
    }, [completedTodo]);
    const logout = () => {
        dispatch({ type: "USERDETAILS", userDetails: [] });
        dispatch({ type: "ONSUBSCRIBE", usersTodo: [] });
        dispatch({ type: "USERSTODOLIST", usersTodoList: [] });
        dispatch({ type: "CREATEDTODO", createdTodo: [] });
        dispatch({ type: "UPDATEDTODO", updatedTodo: [] });
        dispatch({ type: "COMPLETEDTODO", completedTodo: [] });
    }
    const addTodo = () => {
        newTodo ? setNewTodo(false) : setNewTodo(true);
    }
    const handleSubmit = (e) => {
        if (loginDetails.priority == "low" || loginDetails.priority == "high" || loginDetails.priority == "medium") {
            let todo = {
                "todoDescription": loginDetails.todo,
                "mailId": userDetails.mailId,
                "priority": loginDetails.priority,
                "id": userDetails.id
            };
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userDetails.token
                }
            };
            axios.post(`http://localhost:3000/createTodo`, JSON.stringify(todo), config).then(function (response) {
                console.log("response", response.data);
                setRowData(response.data.todos);
                handleToast({ status: "", message: `New Todo Created`, type: "success" });
                setLoginDetails(login);
            }).catch(function (error) {
                handleToast({ status: "", message: `Something went wrong Please try again`, type: "error" });
                console.log("error", error);
            });
        } else {
            handleToast({ status: "", message: `Invalid Priority`, type: "error" });
        }
        e.preventDefault();
    }
    const handleChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setLoginDetails({
            ...loginDetails,
            [name]: value
        });
    }
    const changeTodo = (e) => {
        const value = e.target.value;
        setchangedTodoDes({
            "newTodo": value
        })
    }

    const updateDetails = (e) => {
        e.preventDefault();
        if (rowDetails.todoId && changedTodoDes.newTodo != '' && rowDetails.todo !== changedTodoDes.newTodo) {
            let todo = {
                "id": userDetails.id,
                "todo":
                {
                    "todoId": rowDetails.todoId,
                    "updatedTodo": changedTodoDes.newTodo,
                    "desc": rowDetails.todo,
                    "priority": rowDetails.priority,
                    "createdDate": rowDetails.createdDate,
                    "status": rowDetails.status
                }
            };
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userDetails.token
                }
            };
            axios.put(`http://localhost:3000/updateTodo`, JSON.stringify(todo), config).then(function (response) {
                console.log("response", response.data);
                setRowData(response.data.todos);
                handleToast({ status: "", message: `Todo Updated`, type: "success" });
                setchangedTodoDes({
                    "newTodo": ""
                });
                // setLoginDetails(login);
            }).catch(function (error) {
                handleToast({ status: "", message: `Something went wrong Please try again`, type: "error" });
                console.log("error", error);
            });
        } else {

        }
    }

    const setTodoDesc = (e) => {
        if (e.status == 'completed') {
            setchangedTodoDes({
                "newTodo": ""
            });
            console.log("cant update status")
            return;
        }
        setRowDetails(e)
        setchangedTodoDes({
            "newTodo": e.todo
        });
    }

    const compltedTodo = (e) => {
        e.preventDefault();
        if (rowDetails.todoId) {
            let todo = {
                "id": userDetails.id,
                "mailId": userDetails.mailId,
                "todoId": rowDetails.todoId
            };
            let config = {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": userDetails.token
                }
            };
            axios.put(`http://localhost:3000/completedTodo`, JSON.stringify(todo), config).then(function (response) {
                console.log("response", response.data);
                setRowData(response.data.todos);
                handleToast({ status: "", message: `Moved To Completed`, type: "success" });
                setchangedTodoDes({
                    "newTodo": ""
                });
                // setLoginDetails(login);
            }).catch(function (error) {
                handleToast({ status: "", message: `Something went wrong Please try again`, type: "error" });
                console.log("error", error);
            });
        }
    }
    return (
        <div className="dashContainer">
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity={snackbarDes.type}>
                    {snackbarDes.message}
                </Alert>
            </Snackbar>
            <div className="header layout horizontal justified">
                <div className="logoDiv layout horizontal center-center">
                    <img className="logo" alt="todoLogo" src={todoLogo} />
                </div>
                <div className="logoutBtn layout horizontal center-center">
                    <Link className="logoutTxt" to="/" onClick={logout}>Logout</Link>
                </div>
            </div>
            <div className="DashBody layout horizontal">
                <div className="todoBody layout horizontal center-center">
                    <div className="listBody">

                        <div className="list">
                            <div className="ag-theme-alpine" style={{ height: 400, width: 750 }}>
                                <AgGridReact onRowClicked={(e) => setTodoDesc(e.data)}
                                    rowData={rowData}>
                                    <AgGridColumn field="todo" sortable={true}></AgGridColumn>
                                    <AgGridColumn field="priority" sortable={true}></AgGridColumn>
                                    <AgGridColumn field="status" sortable={true}></AgGridColumn>
                                    {userDetails && userDetails.role !== 'user' ? <AgGridColumn field="userName" sortable={true}></AgGridColumn> : <AgGridColumn></AgGridColumn>}
                                </AgGridReact>
                            </div>
                        </div>
                    </div>
                </div>
                {userDetails && userDetails.role == 'user' ?
                    <div className="todoSec layout horizontal center-center">
                        <div className="completeBtn layout horizontal">
                            <div className="layout vertical">
                                <form className="todoForm" onSubmit={handleSubmit} >
                                    <div className="form-group">
                                        <label>Todo</label>
                                        <input name="todo" type="text" required value={loginDetails.todo} onChange={handleChange} className="form-control" id="emailImput" placeholder="Develop Test cases" />
                                    </div>
                                    <div className="form-group">
                                        <label>Priority</label>
                                        <input name="priority" type="text" required value={loginDetails.priority} onChange={handleChange} className="form-control" id="passImput" placeholder="Low or High or medium" />
                                    </div>
                                    <input type="submit" value="create" className="btn btn-primary" />
                                </form>
                                <div className="emptySpace"></div>
                                <div className="layout horizontal">
                                    <form className="todoForm" onSubmit={updateDetails} >
                                        <div className="form-group">
                                            <label>Update Todo</label>
                                            <input name="newTodo" type="text" required value={changedTodoDes.newTodo} onChange={changeTodo} className="form-control" id="emailImput" placeholder="Develop Test cases" />
                                        </div>
                                        <input type="submit" value="Update" className="btn btn-primary" />
                                    </form>
                                    <div className="compleBtn" >
                                        <input type="submit" onClick={compltedTodo} value="Complete" className="btn btn-primary" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div> : ''}
            </div>
            <div className="footer"></div>
        </div>
    );
}

export default Dashboard;
