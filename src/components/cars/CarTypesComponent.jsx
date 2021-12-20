import { PlusCircleOutlined } from '@ant-design/icons';
import { Button, Col, Input, Modal, Row, Table } from 'antd';
import React, { useState } from 'react';
import { useHistory } from "react-router-dom";
import CreateCarTypesComponent from './CreateCarTypesComponent';

function CarTypesComponent() {
    const [visible, setVisible] = React.useState(false);
    const [record, setRecord] = useState(null);
    const [pageSize, setPageSize] = React.useState(5);
    const [page, setPage] = React.useState(1);
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    const history = useHistory();
    const showModal = () => {
        setVisible(true);
    };

    const baseColumns = [
        {
            title: 'Ảnh loại xe',
            key: 'image',
            render: (data) => {
                return (
                    <Row gutter={15}>
                        <Col span={4} style={{ textAlign: 'center' }}><img alt="" style={{ height: 'auto', width: 'auto', maxHeight: '50px' }} src={data.User.Image} /></Col>
                        <Col span={20} style={{ display: 'flex', alignItems: 'center' }}><div>{data.User.FullName}</div></Col>
                    </Row>
                )
            }
        },
        {
            title: 'Tên loại xe',
            key: 'name',
            render: (data) => {
                return (
                    <div>Tên</div>
                )
            }
        },
        {
            title: 'Tác vụ',
            key: 'action',
            width: '20%',
            render: (data) => {
                return (
                    <div>Xem</div>
                )
            }
        }
    ];
    class Check extends React.Component {
        constructor(props) {
            super(props);
            this.state = { filterTable: null, columns: baseColumns, baseData: record };
        }
        search = value => {
            const { baseData } = this.state;
            console.log("PASS", { value });
            const filterTable = baseData.filter(o =>
                Object.keys(o.User).some(k =>
                    String(o.User[k])
                        .toLowerCase()
                        .includes(value.toLowerCase())
                )
            );
            this.setState({ filterTable });
        }
        render() {
            const { filterTable, columns, baseData } = this.state;
            return (
                <div>
                    <div style={{ textAlign: 'center' }}>
                        <Input.Search
                            className="inputSearchCheck"
                            style={{ marginBottom: 15, width: 500 }}
                            placeholder="Tìm kiếm. . ."
                            enterButton
                            onSearch={this.search}
                        />
                    </div>
                    <Table
                        columns={columns}
                        dataSource={filterTable === null ? baseData : filterTable}
                        rowKey="Id"
                        pagination={{
                            current: page,
                            pageSize: pageSize,
                            onChange: (page, pageSize) => {
                                setPage(page)
                                setPageSize(pageSize)
                            },
                            pageSizeOptions: ['5', '10', '15', '20'],
                            showSizeChanger: true,
                            locale: { items_per_page: "/ trang" },
                        }}
                    />
                </div>
            )
        }
    }
    return (
        <div>
            <Modal
                title='Tạo loại xe'
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
                <CreateCarTypesComponent />
            </Modal>
            <Button type="primary" shape="round" onClick={showModal} className="createButton" style={{ height: 36 }} icon={<PlusCircleOutlined />}><span style={{ marginTop: 2.5 }}>Tạo loại xe</span></Button>
            <Check />
        </div>
    )
}

export default CarTypesComponent
