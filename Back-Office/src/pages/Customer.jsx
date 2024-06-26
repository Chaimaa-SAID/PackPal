import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fetchCustomersRequest, fetchCustomersSuccess, fetchCustomersFailure, addCustomer, updateCustomer, deleteCustomer } from '../Redux/actions/Customer';
import { fetchCustomers, updateCustomer as updateCustomerAPI, deleteCustomer as deleteCustomerAPI, addCustomer as addCustomerAPI } from '../API/Customers';

const CustomerTable = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedCustomer, setEditedCustomer] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  const { customers } = useSelector((state) => state.Customers ? state.Customers : { customers: [] });

  useEffect(() => {
    dispatch(fetchCustomersRequest());
    fetchCustomers()
      .then((Customers) => {
        dispatch(fetchCustomersSuccess(Customers));
      })
      .catch((error) => {
        dispatch(fetchCustomersFailure(error));
      });
  }, [dispatch]);

  console.log("Customers:", customers);

  const handleEdit = (record) => {
    setEditedCustomer(record);
    setEditModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleCancel = () => {
    form.resetFields();
    setAddModalVisible(false);
    setEditModalVisible(false);
    setEditedCustomer(null);
  };

  const handleAddCustomer = async () => {
    try {
      const values = await form.validateFields();
      const newCustomerData = { ...values };
      await addCustomerAPI(newCustomerData);
      dispatch(addCustomer(newCustomerData));
      form.resetFields();
      setAddModalVisible(false);
      message.success('Customer added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding Customer:', error);
      message.error('Error adding Customer. Please try again.');
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedCustomerData = { ...editedCustomer, ...values };
      await updateCustomerAPI(editedCustomer._id, updatedCustomerData);
      dispatch(updateCustomer(editedCustomer._id, updatedCustomerData));
      form.resetFields();
      setEditModalVisible(false);
      message.success('Customer updated successfully');
    } catch (error) {
      console.error('Error updating Customer:', error);
      message.error('Error updating Customer. Please try again.');
    }
  };
  
  const handleDelete = async (customerId) => {
    try {
      await deleteCustomerAPI(customerId);
      dispatch(deleteCustomer(customerId));
      message.success('Customer deleted successfully');
    } catch (error) {
      console.error('Error deleting Customer:', error);
      message.error('Error deleting Customer. Please try again.');
    }
  };
  

  const getColumnSearchProps = (dataIndex) => ({
    filterDropdown: ({ setSelectedKeys, selectedKeys, confirm, clearFilters }) => (
      <div style={{ padding: 8 }}>
        <Input
          ref={searchInput}
          placeholder={`Search ${dataIndex}`}
          value={selectedKeys[0]}
          onChange={(e) => setSelectedKeys(e.target.value ? [e.target.value] : [])}
          onPressEnter={() => handleSearch(selectedKeys, confirm, dataIndex)}
          style={{ width: 188, marginBottom: 8, display: 'block' }}
        />
        <Button
          type="primary"
          onClick={() => handleSearch(selectedKeys, confirm, dataIndex)}
          icon={<SearchOutlined />}
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button size="small" style={{ width: 90 }} onClick={() => handleReset(clearFilters)}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />,
    onFilter: (value, record) =>
      record[dataIndex] ? record[dataIndex].toString().toLowerCase().includes(value.toLowerCase()) : '',
    onFilterDropdownVisibleChange: (visible) => {
      if (visible) {
        setTimeout(() => searchInput.current.select(), 100);
      }
    },
    render: (text) =>
      searchedColumn === dataIndex ? (
        <Highlighter
          highlightStyle={{ backgroundColor: '#ffc069', padding: 0 }}
          searchWords={[searchText]}
          autoEscape
          textToHighlight={text ? text.toString() : ''}
        />
      ) : (
        text
      ),
  });

  const handleSearch = (selectedKeys, confirm, dataIndex) => {
    confirm();
    setSearchText(selectedKeys[0]);
    setSearchedColumn(dataIndex);
  };

  const handleReset = (clearFilters) => {
    clearFilters();
    setSearchText('');
  };

  const buttonStyle = {
    backgroundColor: '#0C2D57',
    borderColor: '#0C2D57',
    color: '#ffffff',
  };

  const columns = [
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      align: 'center',
      ...getColumnSearchProps('email'),
    },
    {
      title: 'First Name',
      dataIndex: 'first_name',
      key: 'first_name',
      align: 'center',
      ...getColumnSearchProps('first_name'),
    },
    {
      title: 'Last Name',
      dataIndex: 'last_name',
      key: 'last_name',
      align: 'center',
      ...getColumnSearchProps('last_name'),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <span>
          <Button type="link" onClick={() => handleEdit(record)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
            <EditOutlined />
          </Button>
          <Button type="link" onClick={() => handleDelete(record._id)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
            <DeleteOutlined />
          </Button>
        </span>
      ),
    },
  ];

  return (
    <div style={{ overflowX: 'auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '30px' }}>
        <p style={{ color: '#0C2D57', fontWeight: 'bold', marginRight: 'auto', marginLeft: '20px', fontSize: '1.2em' }}>Customers</p>
        <Button
          type="primary"
          onClick={() => setAddModalVisible(true)}
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}
        >
          Add Customer
        </Button>
      </div>
      <Modal
        title="Add Customer"
        visible={addModalVisible}
        onOk={handleAddCustomer}
        onCancel={handleCancel}
        okButtonProps={{ style: buttonStyle }}
        cancelButtonProps={{ style: buttonStyle }}
      >
        <Form form={form} layout="vertical">
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
          <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit Customer"
        visible={editModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        okButtonProps={{ style: buttonStyle }}
        cancelButtonProps={{ style: buttonStyle }}
      >
        <Form form={form} layout="vertical" initialValues={editedCustomer}>
          <Form.Item name="email" label="Email" rules={[{ required: true, message: 'Please enter email' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
          <Form.Item name="first_name" label="First Name" rules={[{ required: true, message: 'Please enter first name' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
          <Form.Item name="last_name" label="Last Name" rules={[{ required: true, message: 'Please enter last name' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
          <Form.Item name="password" label="Password" rules={[{ required: true, message: 'Please enter password' }]}>
            <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={customers}
          pagination={{
            ...pagination,
            itemRender: (current, type, originalElement) => {
              if (type === 'prev' || type === 'next') {
                return <Button style={{ borderColor: '#d9a74a', color: 'white' }}>{originalElement}</Button>;
              }
              return originalElement;
            },
          }}
          onChange={setPagination}
        />
      </div>
    </div>
  );
};

export default CustomerTable;
