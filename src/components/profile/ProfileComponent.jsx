import { UserOutlined } from '@ant-design/icons';
import { Avatar, Button, Form, Input, Popover, Spin, message } from 'antd';
import React, { useEffect, useState } from 'react';
import { useStorage } from '../../hook/useStorage';
import AccountService from '../../services/AccountService';
import './style.css';
function ProfileComponent() {
    const currentUser = AccountService.getCurrentUser();
    const [form] = Form.useForm();
    const [data, setData] = useState(null);
    const [fullname, setFullname] = useState(null);
    const [email, setEmail] = useState(null);
    const [image, setImage] = useState(null);
    const [file, setFile] = useState(null);
    const { url } = useStorage(file)
    useEffect(() => {
        AccountService
            .getUserById(currentUser.Id)
            .then(res => {
                form.setFieldsValue({
                    fullname: res.data.FullName,
                    role: res.data.RoleId === 1 ? "Quản trị" : null || res.data.RoleId === 2 ? "Quản lý" : null || res.data.RoleId === 3 ? "Người dùng" : null,
                    roleId: res.data.RoleId,
                    email: res.data.Email,
                    password: res.data.Password,
                    username: res.data.Username,
                    phone: res.data.Phone,
                    address: res.data.Address,
                    image: res.data.Image,
                    status: res.data.Status,
                    createdDate: res.data.CreatedDate,
                })
                setData(res.data)
                setFullname(res.data.FullName)
                setEmail(res.data.Email)
                setImage(res.data.Image)
            })
            .catch(err => {
                console.log(err);
            })
    }, [currentUser.Id, form])
    const onFinish = (values) => {
        AccountService.updateProfile(currentUser.Id, values)
            .then(() => {
                setTimeout(() => { message.success("Cập nhật thành công") }, 100)
                setTimeout(() => { window.location.reload() }, 1000)
            })
            .catch(err => {
                message.error("Lỗi server, cập nhật không thành công")
                console.log(err)
            })
        console.log(values)
    }
    const content = (
        <div>
            <p>Nhấn vào cập nhật ảnh bên dưới để đổi</p>
        </div>
    );
    const changeImage = (e) => {
        setFile(e.target.files[0])
    }
    form.setFieldsValue({
        image: image
    })
    useEffect(() => {
        setImage(url)
    }, [url])
    return (
        <Spin size="large" spinning={data == null ? true : false}>
            <div className="container bg-white mb-5 mw-100" style={{ borderRadius: 15, border: '1px solid #F4DFD0' }}>
                <Form
                    onFinish={onFinish}
                    form={form}
                    layout="vertical"
                >
                    <Form.Item name="roleId" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="image" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="status" hidden={true}>
                        <Input />
                    </Form.Item>
                    <Form.Item name="createdDate" hidden={true}>
                        <Input />
                    </Form.Item>
                    <div className="row">
                        <div className="col-2"></div>
                        <div className="col-md-3" style={{ borderRight: "1px solid #E8EAE6" }}>
                            <div className="d-flex flex-column align-items-center text-center p-3 py-5">
                                <Popover content={content} key="idd" title="Thay ảnh" >
                                    <button type="button" form="btnFile" className="buttonWithoutCSS mt-5"  >
                                        <Avatar size={170} width="150px" alt="" icon={<UserOutlined />} src={image} />
                                    </button>
                                </Popover>
                                <span className="font-weight-bold mt-2">{fullname}</span>
                                <span className="text-black-50">{email}</span>
                                <label className="upload" htmlFor="upload-photo"><i className="fas fa-plus-circle fa-1x"><span style={{ marginLeft: 3 }}>Cập nhật ảnh</span></i></label>
                                <input accept="image/png, image/jpeg, image/jpg" type="file" onChange={changeImage} name="photo" id="upload-photo" />
                                <span> </span>
                            </div>
                        </div>
                        <div className="col-md-5">
                            <div className="p-3 py-5">
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                    <h4 className="text-right">Thông Tin Cá Nhân</h4>
                                </div>
                                <div className="row mt-2">
                                    <div className="col-md-8" >
                                        <Form.Item name="fullname" label="Họ và tên" rules={[{ required: true, message: "Họ và tên không được bỏ trống" }]}>
                                            <Input placeholder="Nhập họ và tên"></Input>
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-4">
                                        <Form.Item name="role" label="Vai trò">
                                            <Input placeholder="vai trò" disabled style={{ backgroundColor: '#FEFBF3', color: '#316B83' }} />
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="row" >
                                    <div className="col-md-6">
                                        <label className="labels">Email</label>
                                        <Form.Item
                                            name="email"
                                            rules={[{ type: "email", message: "Nhập đúng định dạng @" }]}
                                        >
                                            <Input placeholder="Nhập email"></Input>
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <label className="labels">Số điện thoại</label>
                                        <Form.Item name="phone" rules={[{ pattern: new RegExp(/^[0-9]+$/), message: "Nhập đúng định dạng số" }]}>
                                            <Input placeholder="Nhập số điện thoại"></Input>
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-12">
                                        <label className="labels">Địa chỉ</label>
                                        <Form.Item name="address">
                                            <Input placeholder="Nhập địa chỉ"></Input>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="row">
                                    <div className="col-md-6">
                                        <Form.Item name="username" label="Tên đăng nhập">
                                            <Input disabled style={{ backgroundColor: '#FEFBF3', color: '#316B83' }} />
                                        </Form.Item>
                                    </div>
                                    <div className="col-md-6">
                                        <Form.Item name="password" label="Mật khẩu" rules={[{ required: true, message: "Mật khẩu không được bỏ trống" }]}>
                                            <Input.Password placeholder="Nhập password"></Input.Password>
                                        </Form.Item>
                                    </div>
                                </div>
                                <div className="mt-2 text-center">
                                    <Form.Item>
                                        <Button htmlType="submit" type="primary">Xong</Button>
                                    </Form.Item>
                                </div>
                            </div></div>
                        <div className="col-2"></div>
                    </div>
                </Form>
            </div>
        </Spin>
    )
}

export default ProfileComponent;