import React from 'react'
import { Select, Divider, Input, Row, Button, Modal } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CreateAttributesComponent from './CreateAttributesComponent';
import { PlusCircleOutlined } from '@ant-design/icons';

function ManageAttributesComponent() {
    const [visible, setVisible] = React.useState(false);
    const { Option } = Select;
    let index = 0;
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    const showModal = () => {
        setVisible(true);
    };
    class App extends React.Component {
        state = {
            items: ['Xe xăng', 'Xe dầu', 'Xe điện'],
            name: '',
        };

        onNameChange = event => {
            this.setState({
                name: event.target.value,
            });
        };

        addItem = () => {
            console.log('addItem');
            const { items, name } = this.state;
            this.setState({
                items: [...items, name || `New item ${index++}`],
                name: '',
            });
        };

        render() {
            const { items, name } = this.state;
            return (
                <Select
                    style={{ width: 240 }}
                    placeholder="Chọn loại động cơ"
                    dropdownRender={menu => (
                        <div>
                            {menu}
                            <Divider style={{ margin: '4px 0' }} />
                            <div style={{ display: 'flex', flexWrap: 'nowrap', padding: 8 }}>
                                <Input style={{ flex: 'auto' }} value={name} onChange={this.onNameChange} />
                                <a
                                    style={{ flex: 'none', padding: '8px', display: 'block', cursor: 'pointer' }}
                                    onClick={this.addItem}
                                >
                                    <PlusOutlined /> Thêm động cơ
                                </a>
                            </div>
                        </div>
                    )}
                >
                    {items.map(item => (
                        <Option key={item}>
                            <Row>
                                <div>{item}</div>
                                {/* <div onClick={() => console.log("xoa: ", item)}>Xóa</div> */}
                            </Row>
                        </Option>
                    ))}
                </Select>
            );
        }
    }
    return (
        <>
            <Modal
                destroyOnClose={true}
                title='Tạo thuộc tính'
                visible={visible}
                onCancel={handleCancel}
                width={600}
                footer={[
                    <Row style={{ float: 'right', paddingBottom: 30, marginRight: 8 }}>
                        <Button onClick={handleCancel}>
                            Hủy
                        </Button>
                        <Button type="primary" onClick={handleCancel}>
                            Hoàn tất
                        </Button>
                    </Row>
                ]}
            >
                <CreateAttributesComponent />
            </Modal>
            <div style={{ marginBottom: 30, textAlign: 'center' }}>
                <div><Button onClick={showModal} style={{ width: '240px', marginBottom: 20 }} type='primary' icon={<PlusCircleOutlined />}>Thêm thuộc tính</Button></div>
                <App />
            </div>
        </>
    )
}

export default ManageAttributesComponent
