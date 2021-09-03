import React from 'react'
import { Modal, Button, message } from 'antd';
import { PlusCircleOutlined } from '@ant-design/icons';
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import './styles.less';
import { useTranslation } from 'react-i18next';

function CreateCarModalComponent() {
    const App = () => {
        const [visible, setVisible] = React.useState(false);
        const [confirmLoading, setConfirmLoading] = React.useState(false);
        const [visibleSuccess, setSuccess] = React.useState(false);
        const { t, i18n } = useTranslation();

        const success = () => {
            setSuccess(false);
            message.success(t('Created Car Successfully.1'), 2);
        };
        const showModal = () => {
            setVisible(true);
        };
        const handleOk = () => {
            setConfirmLoading(true);
            setTimeout(() => {
                setVisible(false);
                setConfirmLoading(false);
            }, 2000);
            setTimeout(() => {
                success();
                setSuccess(true);
            }, 2000)
        };
        const handleCancel = () => {
            console.log('Clicked cancel button');
            setVisible(false);
        };
        return (
            <>
                <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 35 }} icon={<PlusCircleOutlined />}>{t('Create Car.1')}</Button>
                <Modal
                    title={t('Create a new Car.1')}
                    visible={visible}
                    onOk={handleOk}
                    confirmLoading={confirmLoading}
                    onCancel={handleCancel}
                    width={1000}
                >
                    <CreateCarBodyModalComponent />
                </Modal>
            </>
        );
    };

    return (
        <div>
            <App />
        </div>
    )
}

export default CreateCarModalComponent;
