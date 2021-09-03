import React, { useState, useEffect } from 'react';
import login from '../images/login.png';
import { useHistory } from "react-router-dom";
import AccountService from '../services/AccountService';

function LoginComponent() {

    const history = useHistory();
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    }

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    }

    const handleLogin = (e) => {
        e.preventDefault();

        AccountService.login(username, password)
            .then(() => {
                history.push("/admin");
                window.location.reload();
            })
            .catch(err => {
                console.log(err)
            })
    }

    return (
        <div>
            <div className="login-page bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <h3 className="mb-3">Login Now</h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-7 pe-0">
                                        <div className="form-left h-100 py-5 px-5">
                                            <form className="row g-4" onSubmit={handleLogin}>
                                                <div className="col-12">
                                                    <label>Username<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <div className="input-group-text"><i className="bi bi-person-fill"></i></div>
                                                        <input
                                                            type="text"
                                                            onChange={onChangeUsername}
                                                            value={username}
                                                            name="username"
                                                            className="form-control"
                                                            placeholder="Enter Username"
                                                            required></input>
                                                    </div>
                                                </div>

                                                <div className="col-12">
                                                    <label>Password<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <div className="input-group-text"><i className="bi bi-lock-fill"></i></div>
                                                        <input
                                                            type="text"
                                                            onChange={onChangePassword}
                                                            value={password}
                                                            name="password"
                                                            className="form-control"
                                                            placeholder="Enter Password"
                                                            required></input>
                                                    </div>
                                                </div>

                                                <div className="col-sm-6">
                                                    <div className="form-check">
                                                        <input className="form-check-input" type="checkbox" id="inlineFormCheck"></input>
                                                        <label className="form-check-label" >Remember me</label>
                                                    </div>
                                                </div>

                                                {/* <div className="col-sm-6">
                                                    <a href="#" className="float-end text-primary">Forgot Password?</a>
                                                </div> */}

                                                <div className="col-12">
                                                    <button type="submit" className="btn px-4 text-white float-end mt-4" style={{ backgroundColor: '#FF7643' }}>Login</button>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                    <div className="col-md-5 ps-0 d-none d-md-block">
                                        <div className="form-right h-100 text-white text-center" style={{
                                            backgroundColor: '#FF7643'
                                        }}>
                                            <img src={login} className="photo" alt="logging..." />
                                            {/* <i className="bi bi-bootstrap"></i>
                                            <h2 className="fs-1">Welcome To Car World</h2> */}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <p className="text-end text-secondary mt-3">In the history of the world, no one has ever washed a rented car</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LoginComponent
