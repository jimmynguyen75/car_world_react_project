import { Bar, Pie } from '@ant-design/charts';
import { UserOutlined } from '@ant-design/icons';
import { Avatar, Col, Row } from 'antd';
import React, { useEffect, useState } from 'react';
import { AnalyticsDashboard, PageViewsPerPathChart, SessionsByDateChart, SessionsByHourChart, SessionsBySourceChart, SessionsGeoChart } from 'react-analytics-charts';
import AccessoryService from '../services/AccessoryService';
import AccountService from '../services/AccountService';
import BrandService from '../services/BrandService';
import CarService from '../services/CarService';
import PostService from '../services/PostService';
function DashboardComponent() {
    const [users, setUsers] = useState({ user: [], admin: [], manager: [] });
    const [brands, setBrands] = useState({ car: [], accessory: [] });
    const [carAccessory, setCarAccessory] = useState({ car: [], accessory: [] });
    const [posts, setPosts] = useState({ car: [], accessory: [], event: [], contest: [] });
    const [visible, setVisible] = useState("none")
    setTimeout(() => {
        setVisible(true)
    }, 1500)
    //user
    useEffect(() => {
        const fetchData = async () => {
            let admin = []
            let manager = []
            const user = await AccountService.getAllUser();
            const repo = await AccountService.getAdminAndManger();
            repo.data.forEach((data) => {
                if (data.RoleId === 1) {
                    admin.push(data)
                }
                if (data.RoleId === 2) {
                    manager.push(data)
                }
            })
            setUsers({ user: user.data, admin: admin, manager: manager })
        }
        fetchData()
    }, [])
    //brand
    useEffect(() => {
        const fetchData = async () => {
            const car = await BrandService.getAllBrand()
            const accessory = await BrandService.getAllAccessoriesBrand()
            setBrands({ car: car.data, accessory: accessory.data })
        }
        fetchData()
    }, [])
    //car accessory
    useEffect(() => {
        const fetchData = async () => {
            const car = await CarService.getCars()
            const accessory = await AccessoryService.getAccessories()
            setCarAccessory({ car: car.data, accessory: accessory.data })
        }
        fetchData()
    }, [])
    //post 
    useEffect(() => {
        const fetchData = async () => {
            const car = await PostService.getPostByType(1)
            const accessory = await PostService.getPostByType(2)
            const event = await PostService.getPostByType(3)
            const contest = await PostService.getPostByType(4)
            setPosts({ car: car.data, accessory: accessory.data, event: event.data, contest: contest.data })
        }
        fetchData()
    }, [])
    const accountData = [
        {
            name: 'Người dùng',
            value: users.user.length,
        },
        {
            name: 'Quản trị',
            value: users.admin.length,
        },
        {
            name: 'Quản lý',
            value: users.manager.length,
        }
    ];
    const carAccessoryData = [
        {
            name: 'Xe',
            value: carAccessory.car.length,
        },
        {
            name: 'Phụ kiện',
            value: carAccessory.accessory.length,
        }
    ];
    const brandData = [
        {
            name: 'Hiệu xe',
            value: brands.car.length,
        },
        {
            name: 'Hiệu phụ kiện',
            value: brands.accessory.length,
        }
    ];
    const postData = [
        {
            type: 'Xe',
            value: posts.car.length,
        },
        {
            type: 'Phụ kiện',
            value: posts.accessory.length,
        },
        {
            type: 'Sự kiện',
            value: posts.event.length,
        },
        {
            type: 'Cuộc thi',
            value: posts.contest.length,
        }
    ];
    const configAccount = {
        data: accountData,
        xField: 'value',
        yField: 'name',
        seriesField: 'name',
        legend: { position: 'top-left' },
        label: {
            position: 'right',
            offset: 4,
        },
    }
    const configCarAccessory = {
        data: carAccessoryData,
        xField: 'value',
        yField: 'name',
        seriesField: 'name',
        legend: { position: 'top-left' },
        label: {
            position: 'right',
            offset: 4,
        },
    }
    const configBrand = {
        data: brandData,
        xField: 'value',
        yField: 'name',
        seriesField: 'name',
        legend: { position: 'top-left' },
        label: {
            position: 'right',
            offset: 4,
        },
    }
    const configPost = {
        appendPadding: 10,
        data: postData,
        angleField: 'value',
        colorField: 'type',
        radius: 0.9,
        label: {
            type: 'inner',
            offset: '-30%',
            content: function content(_ref) {
                var percent = _ref.percent;
                return ''.concat((percent * 100).toFixed(0), '%');
            },
            style: {
                fontSize: 14,
                textAlign: 'center',
            },
        },
        interactions: [{ type: 'element-active' }],
    };
    console.log("user: ", users)
    return (
        <div className="container mw-100">
            <AnalyticsDashboard
                authOptions={{ clientId: "648894443742-e86e0d35dekp1ljmcc3e0anap53b34ug.apps.googleusercontent.com" }}
                renderCharts={(gapi, viewId) => {
                    const chartStyles = {
                        margin: "15px",
                        maxWidth: 400,
                    };
                    return (
                        <div style={{ display: "flex", flexWrap: "wrap" }}>
                            <SessionsByDateChart
                                gapi={gapi}
                                viewId={viewId}
                                style={chartStyles}
                                showPageViews
                                showUsers
                            />
                            <SessionsGeoChart
                                gapi={gapi}
                                viewId={viewId}
                                style={chartStyles}
                                showPageViews
                                options={{ width: 400 }}
                            />
                            <SessionsBySourceChart
                                gapi={gapi}
                                viewId={viewId}
                                style={chartStyles}
                            />
                            <SessionsByHourChart gapi={gapi} viewId={viewId} style={chartStyles} />
                            <PageViewsPerPathChart
                                gapi={gapi}
                                viewId={viewId}
                                style={{ margin: "15px" }}
                            />
                        </div>
                    );
                }}
            />
            <Row gutter={15} style={{ marginBottom: 20, padding: "30px 10px 30px 10px", backgroundColor: "white", borderRadius: 15 }}>
                <Col span={8}>
                    <Row gutter={5}>
                        <Avatar size={100} icon={<UserOutlined />} />
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                            <div ><br /> <div> Người dùng</div></div>
                        </div>
                    </Row>
                </Col>
                <Col span={8}>
                    <Row gutter={5}>
                        <Avatar size={100} icon={<UserOutlined />} />
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                            <div ><br /> <div> Người dùng</div></div>
                        </div>
                    </Row>
                </Col>
                <Col span={8}>
                    <Row gutter={5}>
                        <Avatar size={100} icon={<UserOutlined />} />
                        <div style={{ display: 'flex', alignItems: 'center', marginLeft: 20 }}>
                            <div ><br /> <div> Người dùng</div></div>
                        </div>
                    </Row>
                </Col>
            </Row>
            <Row gutter={15} style={{ marginLeft: '-15px', marginRight: '-15px', marginBottom: 20, display: visible }}>
                <Col span={12}>
                    <Pie {...configPost} style={{ padding: 20, backgroundColor: 'white', borderRadius: 15, height: 250 }} />
                </Col>
                <Col span={12}>
                    <Pie {...configPost} style={{ padding: 20, backgroundColor: 'white', borderRadius: 15, height: 250 }} />
                </Col>
            </Row>
            <Row gutter={15} style={{ marginLeft: '-15px', marginRight: '-15px' }}>
                <Col span={8}>
                    <Bar {...configAccount} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                    <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Tổng số tài khoản</div>
                </Col>
                <Col span={8}>
                    <Bar {...configCarAccessory} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                    <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Tổng số xe và phụ kiện</div>
                </Col>
                <Col span={8}>
                    <Bar {...configBrand} style={{ padding: 20, backgroundColor: "white", borderRadius: 15, height: 250 }} />
                    <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 500, fontSize: 14 }}>Tổng số thương hiệu</div>
                </Col>
            </Row>
        </div>

    )
}

export default DashboardComponent;