import { ExclamationCircleOutlined, PlusCircleOutlined } from '@ant-design/icons';
import { Button, Modal, Row } from 'antd';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import './styles.less';

function CreateCarModalComponent() {
    const App = () => {
        const history = useHistory();
        const [modalConfirm, setModalConfirm] = useState(false);
        const [visible, setVisible] = React.useState(false);
        const [loadingButton, setLoadingButton] = React.useState(false)

        const showModal = () => {
            setVisible(true);
        };
        const handleOk = () => {
            setLoadingButton(true);
            setTimeout(() => {
                setModalConfirm(false)
            }, 1000);
            setTimeout(() => {
                setLoadingButton(false);
            }, 1000)
        };
        const handleCancel = () => {
            console.log('Clicked cancel button');
            setVisible(false);
            history.push('/quan-ly/xe')
        };
        return (
            <>
                <Modal
                    title={<span style={{ fontSize: 18, fontWeight: 600 }}>Xác nhận</span>}
                    centered
                    icon={<ExclamationCircleOutlined />}
                    visible={modalConfirm}
                    onCancel={() => setModalConfirm(false)}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={() => setModalConfirm(false)}>Hủy </Button>
                            <Button form="myForm" loading={loadingButton} onClick={handleOk} type="primary" key="submit" htmlType="submit">Có</Button>
                        </Row>
                    ]}
                ><span style={{ fontSize: '16px', fontWeight: 400 }}>Bạn có muốn đăng chiếc xe này không?</span>
                </Modal>
                <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo xe</span></Button>
                <Modal
                    title='Tạo xe mới'
                    visible={visible}
                    onCancel={handleCancel}
                    width={1000}
                    footer={[
                        <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                            <Button onClick={handleCancel}>
                                Hủy
                            </Button>
                            <Button type="primary" onClick={() => setModalConfirm(true)}>
                                Hoàn tất
                            </Button>
                        </Row>
                    ]}
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
