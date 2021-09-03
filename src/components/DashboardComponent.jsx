import React, { useState, useEffect } from 'react';
import { Avatar, Spin } from 'antd';
import { Bar } from '@ant-design/charts';
import { UserOutlined } from '@ant-design/icons';
import UserService from '../services/UserService';
import { useTranslation } from 'react-i18next';

function DashboardComponent() {

    const [totalUsers, setTotalUsers] = useState(null);
    const { t, i18n } = useTranslation();

    useEffect(() => {
        UserService
            .getTotalUsers()
            .then(res => {
                console.log(res)
                setTotalUsers(res.data.data.length)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    const data = [
        {
            year: '1951 年',
            value: 8,
        },
        {
            year: '1952 年',
            value: 2,
        },
        {
            year: '1956 年',
            value: 1,
        },
        {
            year: '1957 年',
            value: 28,
        },
        {
            year: '1958 年',
            value: 8,
        },
    ];

    const config = {
        data: data,
        xField: 'value',
        yField: 'year',
        seriesField: 'year',
        legend: { position: 'top-left' },
        label: {
            position: 'right',
            offset: 4,
        },
    }

    return (
        <div class="container">
            <div class="row" style={{marginLeft: 1, marginRight: 1, marginBottom: 20, padding: "30px 10px 30px 10px", backgroundColor: "white", borderRadius: 15 }} >
                <div class="col col-lg-1">
                    <div>
                        <Avatar style={{ backgroundColor: '#FFD000' }} size={80} icon={<UserOutlined />} />
                    </div>
                </div>
                <div class="col col-lg-3">
                    <div style={{ color: '#646464' }}>{t('Total Users.1')}</div>
                    <Spin
                        size="small"
                        spinning={totalUsers == null ? true : false}
                    >
                        <div style={{ fontWeight: 700, fontSize: 32 }}>
                            {totalUsers}
                            <span style={{ fontSize: 18, fontWeight: 400, color: '#646464' }}> {t('People.1')}</span>
                        </div>
                    </Spin>
                </div>
                <div class="col col-lg-1">
                </div>
                <div class="col col-lg-3"></div>
                <div class="col col-lg-1">
                </div>
                <div class="col col-lg-3"></div>
            </div>
            <div class="row">
                <div class="col">
                    <Bar {...config} style={{ padding: 20, backgroundColor: "white", borderRadius: 15 }} />
                    <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 600 }}>{t('Total of Contests and Events.1')}</div>
                </div>
                <div class="col">
                    <Bar {...config} style={{ padding: 20, backgroundColor: "white", borderRadius: 15 }} />
                    <div style={{ textAlign: 'center', paddingBottom: 30, paddingTop: 5, fontWeight: 600 }}>{t('Total of Exchange Cars and Accessories.1')}</div>
                </div>
            </div>
        </div>
    )
}

export default DashboardComponent;