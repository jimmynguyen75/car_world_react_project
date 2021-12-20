import React from 'react'
import { Select, Divider, Input, Row } from 'antd';
import { PlusOutlined } from '@ant-design/icons';

function ManageAttributesComponent() {
    const { Option } = Select;
    let index = 0;
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
                    placeholder="Chọn thuộc tính xe"
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
                                    <PlusOutlined /> Thêm thuộc tính
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
        <div>
            <App />
        </div>
    )
}

export default ManageAttributesComponent
