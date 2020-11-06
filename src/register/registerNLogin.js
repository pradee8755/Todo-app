import React, { useState, useEffect } from "react";
import axios from 'axios';
import "../css-flex.css";
import "./registerNLogin.css";
import wall from "../images/png/todo.jpg";
import { useSelector, useDispatch } from 'react-redux';
import { BrowserRouter as Router, Switch, Route, Redirect } from 'react-router-dom';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { makeStyles } from '@material-ui/core/styles';

function Register() {
    const details = useSelector((state) => state.userDetails);
    const dispatch = useDispatch();
    const [open, setOpen] = useState(false);
    const login = { email: "", password: "" };
    const register = { name: "", rePass: "", password: "", email: "" };
    const [snackbarDes, setsnackbarDes] = useState({});
    const [loginDetails, setLoginDetails] = useState(login);
    const [filledDetails, setDetails] = useState(register);
    const [type, setType] = useState("login");
    // useEffect(() => {
    //     if (details && details.userDetails) {
    //         return;
    //     }
    // }, [details]);
    useEffect(() => {
        // dispatch({ type: "USERDETAILS", userDetails: [] });
        // dispatch({ type: "ONSUBSCRIBE", usersTodo: [] });
    });

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
    const handleChange = (e, ele) => {
        if (!ele) {
            console.log("event", e);
            const target = e.target;
            // const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            const value = target.value;
            type == "login" ?
                setLoginDetails({
                    ...loginDetails,
                    [name]: value
                }) : setDetails({
                    ...filledDetails,
                    [name]: value
                })
            console.log('Change detected. State updated' + name + ' = ' + ele);
        } else {
            setType(ele);
            setLoginDetails({ ...login });
            setDetails({ ...register });
        }
    }
    const handleToast = (toast) => {
        setsnackbarDes(toast);
        setOpen(true);
    };
    const handleClose = (event, reason) => {
        if (reason === 'clickaway') {
            return;
        }

        setOpen(false);
    };
    const handleSubmit = (e) => {
        e.preventDefault();
        if (type == 'register' && filledDetails.password !== filledDetails.rePass) {
            handleToast({ status: "", message: "Passwords don't match", type: "warning" });
            return;
        } else {
            let ele = type == 'register' ?
                {
                    url: "register",
                    details: {
                        mailId: e.target.email.value,
                        name: e.target.name.value,
                        password: e.target.password.value,
                        role: "user"
                    }
                } :
                {
                    url: "login",
                    details: {
                        mailId: e.target.email.value,
                        password: e.target.password.value,
                    }
                };
            var config = {
                headers: {
                    "Content-Type": "application/json",
                }
            };

            axios.post(`http://localhost:3000/${ele.url}`, JSON.stringify(ele.details), config).then(function (response) {
                console.log("response", response);
                setLoginDetails(login);
                setDetails(register);
                if (ele.url == 'login') {
                    dispatch({ type: "USERDETAILS", userDetails: response.data });
                    handleToast({ status: response.status, message: "Login successful", type: "success" });
                    // localStorage.setItem("userDetails", JSON.stringify(response.data));
                    setDetails(register);
                } else {
                    handleToast({ status: response.data.status, message: response.data.message, type: "success" })
                    console.log(response.data.status, response.data.message);
                }
            }).catch(function (error) {
                handleToast({ status: '', message: "Invalid Email or password", type: "error" })
                console.log("error", error);
            });
        }
    }


    return (
        <div className="constainer layout vertical">
            <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
                <Alert severity={snackbarDes.type}>
                    {snackbarDes.message}
                </Alert>
            </Snackbar>
            <Route>
                {details && details.name ? <Redirect to="/dashboard" /> : ''}
            </Route>
            <div className="body layout horizontal">
                <img className="wall layout horizontal center-center" src={wall}></img>
                <div className="form layout vertical justified">
                    <div className="buttonType layout horizontal center-center end">
                        <div className="buttons layout horizontal justified">
                            <input type="submit" value="Login" className="btn btn-primary" onClick={(e) => handleChange(e, "login")} />
                            <input type="submit" value="Register" className="btn btn-primary" onClick={(e) => handleChange(e, "register")} />
                        </div>
                    </div>
                    <div className="formInput layout vertical center">
                        {type == 'login' ?
                            <form className="todoForm" onSubmit={handleSubmit} >
                                <div className="form-group">
                                    <label >Email</label>
                                    <input name="email" type="email" required value={loginDetails.email} onChange={handleChange} className="form-control" id="emailImput" placeholder="email@domain.com" />
                                </div>
                                <div className="form-group">
                                    <label for="passImput">Password</label>
                                    <input name="password" type="password" required value={loginDetails.password} onChange={handleChange} className="form-control" id="passImput" placeholder="Password" />
                                </div>
                                <input type="submit" value="Submit" className="btn btn-primary" />
                            </form> :
                            <form className="todoForm" onSubmit={handleSubmit} >
                                <div className="form-group">
                                    <label for="nameImput">Name</label>
                                    <input type="text" name="name" required value={filledDetails.name} onChange={handleChange} className="form-control" id="nameImput" placeholder="Name" />
                                </div>
                                <div className="form-group">
                                    <label for="emailImput">Email</label>
                                    <input name="email" type="email" required value={filledDetails.email} onChange={handleChange} className="form-control" id="emailImput" placeholder="email@domain.com" />
                                </div>
                                <div className="form-group">
                                    <label for="passImput">Password</label>
                                    <input name="password" type="password" required value={filledDetails.password} onChange={handleChange} className="form-control" id="passImput" placeholder="Password" />
                                </div>
                                <div className="form-group">
                                    <label for="rePassImput">Re-Password</label>
                                    <input name="rePass" type="password" required value={filledDetails.rePass} onChange={handleChange} className="form-control" id="rePassImput" placeholder="Re-Password" />
                                </div>
                                <input type="submit" value="Submit" className="btn btn-primary" />
                            </form>}
                    </div>
                </div>
            </div>
            <div className="footer layout horizontal center-center"></div>
        </div >

    )
}

export default Register;
