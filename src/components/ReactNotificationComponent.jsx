import { Avatar } from 'antd';
import moment from 'moment';
import 'moment/locale/vi';
import React from 'react';
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const ReactNotificationComponent = ({ title, body }) => {
    toast(<Display />,
        {
            autoClose: 50000, position: "top-right", hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
        });
    let dataTitle = title.split("|");
    let dataBody = body.split("|");
    let date = moment(dataBody[1]).format("YYYYMMDD H:mm");
    function Display() {
        return (
            <a href={"/" + dataBody[2]} style={{textDecoration: "none"}}>
                <div style={{ width: '280px !important', fontWeight: 550, fontSize: 18, marginBottom: 7, color: '#11324D' }}><Avatar src={dataTitle[0]} alt='' />&nbsp;{dataTitle[1]}</div>
                <div style={{ width: '280px !important', marginBottom: 5, color: 'black' }}>{dataBody[0]}</div>
                <div style={{ width: '280px !important', color: '#9D9D9D' }}> {moment(date, "YYYYMMDD H:mm").fromNow()}  </div>
            </a>
        );
    }
    return (
        <>
            <ToastContainer />
        </>
    );
};

export default ReactNotificationComponent;