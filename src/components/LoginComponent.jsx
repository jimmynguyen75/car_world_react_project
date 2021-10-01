import { message } from 'antd';
import React, { useState } from 'react';
import login from '../images/login.png';
import AccountService from '../services/AccountService';

function LoginComponent() {

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [incorrect, setIncorrect] = useState("none");

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
        setTimeout(() => {
            message.loading({ content: 'Đang tải...', duration: 2 });
        }, 10)
        AccountService.login(username, password)
            .then(() => {
                console.log("Tên đăng nhập: " + username);
                console.log("Mật khẩu: " + password);
                console.log(AccountService.getCurrentUser().RoleId);
                if (AccountService.getCurrentUser().RoleId === 1) {
                    setTimeout(() => {
                        message.success({ content: 'Đăng nhập thành công', duration: 2 });
                    }, 1000);
                    setTimeout(() => { window.location.href = "/" }, 2000)
                } else {
                    setTimeout(() => {
                        message.success({ content: 'Đăng nhập thành công', duration: 2 });
                    }, 1000);
                    setTimeout(() => { window.location.href = "/" }, 2000)
                }
            })
            .catch((error) => {
                setPassword("")
                setIncorrect("")
                console.log(error)
                setTimeout(() => {
                    message.error("Đăng nhập không thành công")
                }, 1000)
            })
    }

    return (
        <div>
            <div className="login-page bg-light">
                <div className="container">
                    <div className="row">
                        <div className="col-lg-10 offset-lg-1">
                            <h3 className="mb-3">Car World</h3>
                            <div className="bg-white shadow rounded">
                                <div className="row">
                                    <div className="col-md-7 pe-0">
                                        <div className="form-left h-100 py-5 px-5">
                                            <form className="row g-4" onSubmit={handleLogin}>
                                                <div className="col-12">
                                                    <label style={{ marginBottom: 5 }}>Tên đăng nhập<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <div className="input-group-text"><i className="bi bi-person-fill"></i></div>
                                                        <input
                                                            type="text"
                                                            onChange={onChangeUsername}
                                                            value={username}
                                                            name="username"
                                                            className="form-control"
                                                            placeholder="Nhập tên đăng nhập"
                                                            required></input>
                                                    </div>
                                                </div>
                                                <div className="col-12">
                                                    <label style={{ marginBottom: 5 }}>Mật khẩu<span className="text-danger">*</span></label>
                                                    <div className="input-group">
                                                        <div className="input-group-text"><i className="bi bi-lock-fill"></i></div>
                                                        <input
                                                            type="password"
                                                            onChange={onChangePassword}
                                                            value={password}
                                                            name="password"
                                                            className="form-control"
                                                            placeholder="Nhập mật khẩu"
                                                            required></input>
                                                    </div>
                                                </div>
                                                <div className="col-8">
                                                    <label style={{ display: incorrect, padding: 10, color: "white", borderRadius: 10, background: "#FF7171" }}>Tài khoản hoặc mật khẩu không đúng</label>
                                                </div>
                                                <div className="col-4">
                                                    <button type="submit" className="btn px-4 text-white float-end mt-2" style={{ backgroundColor: '#FF7643' }}>Đăng nhập</button>
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
                            <p className="text-end text-secondary mt-3">Trong lịch sử thế giới, không ai tự rửa xe mình thuê bao giờ hết</p>
                        </div>
                    </div>
                </div>
            </div >
        </div >
    )
}

export default LoginComponent
