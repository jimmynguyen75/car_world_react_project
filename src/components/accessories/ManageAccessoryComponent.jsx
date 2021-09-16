import React, { useEffect, useState } from 'react'
import { Table, Input, Button, Space } from 'antd';
import Highlighter from 'react-highlight-words';
import { SearchOutlined } from '@ant-design/icons';
import AccessoryService from '../../services/AccessoryService'

function ManageAccessoryComponent() {
    const [accessories, setAccessories] = useState(null);
    useEffect(() => {
        AccessoryService
            .getAccessories()
            .then(response => {
                console.log("ra" + response);
                setAccessories(response.data);
            })
            .catch(error => {
                console.log(error);
            })
    }, []);

    class App extends React.Component {
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
                    title: 'Name',
                    key: 'name',
                    width: '30%',
                    ...this.getColumnSearchProps('name'),
                    render: (text, record) => {
                        return (
                            <div>
                                <div class="row">
                                    <div class="col-5"> <img style={{ height: 100, maxWidth: '100%' }} src={record.Image} /></div>
                                    <div class="col-7"><div>{record.Name}</div></div>
                                </div>
                            </div>
                        );
                    },
                },
                {
                    title: 'Brand',
                    dataIndex: 'age',
                    key: 'age',
                    width: '10%',
                    ...this.getColumnSearchProps('age'),
                },
                {
                    title: 'Price',
                    dataIndex: 'Price',
                    key: 'address',
                    width: '15%',
                    ...this.getColumnSearchProps('address'),
                    sorter: (a, b) => a.address.length - b.address.length,
                    sortDirections: ['descend', 'ascend'],
                },
                {
                    title: 'Created',
                    dataIndex: 'age',
                    key: 'age',
                    width: '20%',
                    ...this.getColumnSearchProps('age'),
                },
                {
                    title: 'Action',
                    key: 'action',
                }
            ];
            return <Table columns={columns} dataSource={accessories} />;
        }
    }

    return (
        <div>
            <App />
        </div>
    )
}

export default ManageAccessoryComponent;