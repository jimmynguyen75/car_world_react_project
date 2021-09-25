import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import React from 'react';
import { useHistory } from "react-router-dom";
import './styles.less';

function ManagePostsComponent() {

    const history = useHistory();
    const createModal = () => {
        history.push("/quan-ly/tao-bai-dang");
    }

    return (
        <div>
            <Button type="primary" shape="round" onClick={createModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2 }}>Tạo bài đăng</span></Button>
        </div>
    )
}

export default ManagePostsComponent;