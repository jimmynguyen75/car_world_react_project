import React, { useEffect, useState } from 'react'
import { useHistory, useLocation } from "react-router-dom";
import { Table, Input, Popover, Button, Space, Spin, Modal, Avatar, message } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined, DeleteOutlined, EditOutlined, FundViewOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
import CarService from '../../services/CarService';
import CreateCarModalComponent from './CreateCarModalComponent';
import { useTranslation } from 'react-i18next';
import CreateCarBodyModalComponent from './CreateCarBodyModalComponent';
import ViewCarModalComponent from './ViewCarModalComponent';

function ManageCarsComponent() {

    const history = useHistory();
    const [car, setCars] = useState(null);
    const { t, i18n } = useTranslation();
    const [visible, setVisible] = React.useState(false);
    const [visibleDetail, setVisibleDetail] = React.useState(false);
    const [confirmLoading, setConfirmLoading] = React.useState(false);
    const [visibleSuccess, setSuccess] = React.useState(false);

    const contentDelete = (
        <div>
            <p>{t('You will Delete this Car when you click!.1')}</p>
        </div>
    );
    const contentView = (
        <div>
            <p>{t('You will View Detail this Car when you click!.1')}</p>
        </div>
    );
    const contentEdit = (
        <div>
            <p>{t('You will Edit this Car when you click!.1')}</p>
        </div>
    );
    useEffect(() => {
        CarService
            .getCars()
            .then(res => {
                console.log(res)
                setCars(res.data)
            })
            .catch(err => {
                console.log(err)
            })
    }, []);

    function confirmDelete() {
        Modal.confirm({
            title: t('Delete Car!.1'),
            icon: <ExclamationCircleOutlined />,
            content: t('Are you sure you want to Delete this Car?.1'),
            okText: t('Ok.1'),
            cancelText: t('Cancel.1'),
        });
    }

    const success = () => {
        setSuccess(false);
        message.success(t('Created Car Successfully.1'), 2);
    };
    const showModal = () => {
        setVisible(true);
    };

    const showViewDetail = () => {
        setVisibleDetail(true);
    }
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
    const handleOkDetail = () => {
        setConfirmLoading(true);
        setTimeout(() => {
            setVisibleDetail(false);
            setConfirmLoading(false);
        }, 2000);
    };
    const handleCancel = () => {
        console.log('Clicked cancel button');
        setVisible(false);
    };
    const handleCancelDetail = () => {
        console.log('Clicked cancel button');
        setVisibleDetail(false);
    };

    class Cars extends React.Component {
        state = {
            searchText: '',
            searchedColumn: '',
        };

        getColumnSearchProps = dataIndex => ({
            filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
                <div style={{ padding: 8 }}>
                    <Input
                        ref={node => {
                            this.searchInput = node;
                        }}
                        placeholder={`Search ${dataIndex}`}
                        value={selectedKeys[0]}
                        onChange={e => setSelectedKeys(e.target.value ? [e.target.value] : [])}
                        onPressEnter={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                        style={{ marginBottom: 8, display: 'block' }}
                    />
                    <Space>
                        <Button
                            type="primary"
                            onClick={() => this.handleSearch(selectedKeys, confirm, dataIndex)}
                            icon={<SearchOutlined />}
                            size="small"
                            style={{ width: 90 }}
                        >
                            Search
                        </Button>
                        <Button onClick={() => this.handleReset(clearFilters)} size="small" style={{ width: 90 }}>
                            Reset
                        </Button>
                        <Button
                            type="link"
                            size="small"
                            onClick={() => {
                                confirm({ closeDropdown: false });
                                this.setState({
                                    searchText: selectedKeys[0],
                                    searchedColumn: dataIndex,
                                });
                            }}
                        >
                            Filter
                        </Button>
                    </Space>
                </div>
            ),
            filterIcon: filtered => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
            onFilter: (value, record) =>
                record[dataIndex]
                    ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
                    : '',
            onFilterDropdownVisibleChange: visible => {
                if (visible) {
                    setTimeout(() => this.searchInput.select(), 100);
                }
            },
            render: text =>
                this.state.searchedColumn === dataIndex ? (
                    <Highlighter
                        highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
                        searchWords={[this.state.searchText]}
                        autoEscape
                        textToHighlight={text ? text.toString() : ''}
                    />
                ) : (
                    text
                ),
        });

        handleSearch = (selectedKeys, confirm, dataIndex) => {
            confirm();
            this.setState({
                searchText: selectedKeys[0],
                searchedColumn: dataIndex,
            });
        };

        handleReset = clearFilters => {
            clearFilters();
            this.setState({ searchText: '' });
        };

        render() {
            const columns = [
                {
                    title: t('Car Name.1'),
                    dataIndex: 'thumbnailUrl',
                    key: 'age',
                    width: '20%',
                    ...this.getColumnSearchProps('thumbnailUrl'),
                    render: (text, record) => {
                        return (
                            <div>
                                <img src={record.thumbnailUrl} />
                                {/*<Avatar src={record.productimage}/> */}
                                <div>
                                    <div>{record.title}</div>
                                    <a href="javascript:alert('ciao');">{record.productname}</a>
                                </div>
                            </div>
                        );
                    },
                },
                {
                    title: t('Brand.1'),
                    dataIndex: 'title',
                    key: 'name',
                    width: '20%',
                    ...this.getColumnSearchProps('title'),
                },
                {
                    title: t('Status.1'),
                    dataIndex: 'title',
                    key: 'name',
                    width: '20%',
                    ...this.getColumnSearchProps('title'),
                },
                {
                    title: t('Last Modified.1'),
                    dataIndex: 'title',
                    key: 'name',
                    width: '20%',
                    ...this.getColumnSearchProps('title'),
                },
                {
                    title: t('Action.1'),
                    key: 'action',
                    render: (text, record) => {
                        return (
                            <Space size="middle">
                                {/* <a>Invite {record.lastName}</a> */}
                                <Popover content={contentView} title={t('View Button!.1')}>
                                    <Button onClick={showViewDetail} icon={<FundViewOutlined />}
                                        block className="viewButton" />
                                </Popover>
                                <Popover content={contentEdit} title={t('Edit Button!.1')}>
                                    <Button onClick={showModal} icon={<EditOutlined />}
                                        block className="editButton" />
                                </Popover>
                                <Popover content={contentDelete} title={t('Delete Button!.1')}>
                                    <Button onClick={confirmDelete} icon={<DeleteOutlined />}
                                        block className="deleteButton" />
                                </Popover>
                            </Space>
                        )
                    },
                }
            ];
            return <Table
                columns={columns}
                dataSource={car}
                onChange={() => {
                    document.body.scrollTop = 0; // For Safari
                    document.documentElement.scrollTop = 0;
                }}
                pagination={{
                    defaultPageSize: 3,
                    showSizeChanger: true,
                    pageSizeOptions: ['3', '10', '15', '20']
                }}
            />;
        }
    }

    return (
        <Spin
            spinning={car == null ? true : false}
            // delay={100}
            size="large" >
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
            <Modal
                title="View Car Detail"
                visible={visibleDetail}
                onOk={handleOkDetail}
                confirmLoading={confirmLoading}
                onCancel={handleCancelDetail}
                footer={[
                    <Button key="back" onClick={handleCancelDetail}>
                        Ok
                    </Button>
                ]}
            >
                <ViewCarModalComponent />
            </Modal>
            <CreateCarModalComponent />
            <Cars />
        </Spin>
    )
}

export default ManageCarsComponent
