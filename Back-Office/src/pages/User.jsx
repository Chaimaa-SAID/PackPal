import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fetchUsersRequest, fetchUsersSuccess, fetchUsersFailure, addUser, updateUser, deleteUser } from '../Redux/actions/Users';
import { getUsers, updateUser as updateUserAPI, deleteUser as deleteUserAPI, addUser as addUserAPI } from '../API/Users';

const UserTable = () => {
  const dispatch = useDispatch();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedUser, setEditedUser] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm();

  const { users } = useSelector((state) => state.Users ? state.Users : { users: [] });

  useEffect(() => {
    dispatch(fetchUsersRequest());
    getUsers()
      .then((users) => {
        dispatch(fetchUsersSuccess(users));
      })
      .catch((error) => {
        dispatch(fetchUsersFailure(error));
      });
  }, [dispatch]);

  console.log("Users:", users);

  const handleEdit = (record) => {
    setEditedUser(record);
    setEditModalVisible(true);
    form.setFieldsValue(record);
  };

  const handleCancel = () => {
    form.resetFields();
    setAddModalVisible(false);
    setEditModalVisible(false);
    setEditedUser(null);
    setImageUrl('');
  };

  const handleAddUser = async () => {
    try {
      const values = await form.validateFields();
      const newUserData = { ...values, media: imageUrl };
      await addUserAPI(newUserData);
      dispatch(addUser(newUserData));
      form.resetFields();
      setAddModalVisible(false);
      setImageUrl('');
      message.success('User added successfully');      
      window.location.reload();
    } catch (error) {
      console.error('Error adding user:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedUserData = { ...editedUser, ...values };
      if (imageUrl) {
        updatedUserData.media = imageUrl;
      }
      await updateUserAPI(editedUser._id, updatedUserData);
      dispatch(updateUser(editedUser._id, updatedUserData)); 
      form.resetFields();
      setEditModalVisible(false);
      message.success('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      message.error('Error updating user. Please try again.');
    }
  };

  const handleDelete = async (userId) => {
    try {
      await deleteUserAPI(userId);
      dispatch(deleteUser(userId)); 
      message.success('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      message.error('Error deleting user. Please try again.');
    }
  };

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const url = info.file.response.secure_url;
      setImageUrl(url);
    }
  };

  const uploadProps = {
    action: 'https://api.cloudinary.com/v1_1/drukcn21i/upload',
    data: { upload_preset: 'duqax7wj' },
    onChange: handleChange,
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
      title: 'Image',
      dataIndex: 'media',
      key: 'media',
      align: 'center',
      render: (media) => <img src={media} alt="Media" style={{ display: 'block', margin: '0 auto', maxWidth: '100px' }} />,
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
        <p style={{ color: '#0C2D57', fontWeight: 'bold', marginRight: 'auto', marginLeft: '20px', fontSize: '1.2em' }}>Users</p>
        <Button
          type="primary"
          onClick={() => setAddModalVisible(true)}
          icon={<PlusOutlined />}
          style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}
        >
          Add User
        </Button>
      </div>
      <Modal
        title="Add User"
        visible={addModalVisible}
        onOk={handleAddUser}
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
          <Form.Item name="media" label="Image">
            <Upload id="media-upload" {...uploadProps}>
              <Button style={{ backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' }}>Click to Upload</Button>
            </Upload>
            {imageUrl && (
              <div>
                <img src={imageUrl} alt="User" style={{ display: 'block', margin: '10px auto', maxWidth: '200px' }} />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
      <Modal
        title="Edit User"
        visible={editModalVisible}
        onOk={handleUpdate}
        onCancel={handleCancel}
        okButtonProps={{ style: buttonStyle }}
        cancelButtonProps={{ style: buttonStyle }}
      >
        <Form form={form} layout="vertical" initialValues={editedUser}>
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
          <Form.Item name="media" label="Image">
            <Upload {...uploadProps}>
              <Button style={{ backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' }}>Click to Upload</Button>
            </Upload>
            {editedUser && editedUser.media && (
              <div>
                <img src={editedUser.media} alt="User" style={{ display: 'block', margin: '10px auto', maxWidth: '200px' }} />
              </div>
            )}
          </Form.Item>
        </Form>
      </Modal>
      <div style={{ overflowX: 'auto' }}>
        <Table
          columns={columns}
          dataSource={users}
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

export default UserTable;
