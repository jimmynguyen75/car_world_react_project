import React from 'react'
import { PlusCircleOutlined } from '@ant-design/icons';
import { Button } from 'antd';
import { useHistory } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import './styles.less';

function ManagePostsComponent() {

    const { t, i18n } = useTranslation();
    const history = useHistory();
    const createModal = () => {
        history.push('/create/post');
    }

    return (
        <div>
            <Button type="primary" shape="round" onClick={createModal} className="createButton" style={{ height: 35 }} icon={<PlusCircleOutlined />}>{t('Create Post.1')}</Button>
        </div>
    )
}

export default ManagePostsComponent;