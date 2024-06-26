import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Upload, message } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fetchCategoriesRequest, fetchCategoriesSuccess, fetchCategoriesFailure, addCategory, updateCategory, deleteCategory } from '../Redux/actions/Categories';
import { createCategory, fetchCategories, updateCategory as updateCategoryAPI, deleteCategory as deleteCategoryAPI } from '../API/Categories';

const Category = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.Categories);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedCategory, setEditedCategory] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm(); 

  useEffect(() => {
    dispatch(fetchCategoriesRequest());
    fetchCategories()
      .then((categories) => {
        dispatch(fetchCategoriesSuccess(categories));
      })
      .catch((error) => {
        dispatch(fetchCategoriesFailure(error));
      });
  }, [dispatch]);

  const handleEdit = (record) => {
    setEditedCategory(record);
    setEditModalVisible(true);
    form.setFieldsValue(record); 
  };

  const handleCancel = () => {
    form.resetFields();
    setAddModalVisible(false);
    setEditModalVisible(false);
    setEditedCategory(null);
    setImageUrl('');
  };

  const handleAddCategory = async () => {
    try {
      const values = await form.validateFields();
      const newCategoryData = { ...values, media: imageUrl }; 
      await createCategory(newCategoryData);
      dispatch(addCategory(newCategoryData));
      form.resetFields();
      setAddModalVisible(false);
      setImageUrl('');
      message.success('Category Add successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding category:', error);
    }
  };

  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedCategoryData = { ...editedCategory, ...values };
      if (imageUrl) {
        updatedCategoryData.media = imageUrl;
      }
      await updateCategoryAPI(editedCategory._id, updatedCategoryData);
      dispatch(updateCategory(editedCategory._id, updatedCategoryData));
      form.resetFields(); 
      setEditModalVisible(false); 
      message.success('Category updated successfully');
    } catch (error) {
      console.error('Error updating category:', error);
    }
  };

  const handleDelete = async (categoryId) => {
    try {
      await deleteCategoryAPI(categoryId);
      dispatch(deleteCategory(categoryId));
      message.success('Category Delete successfully');
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleChange = (info) => {
    if (info.file.status === 'done') {
      message.success(`${info.file.name} file uploaded successfully`);
      const url = info.file.response.secure_url;
      setImageUrl(url);  
      if (editModalVisible && editedCategory) {
        setEditedCategory(prevCategory => ({
          ...prevCategory,
          media: url
        }));
      }
    }
  }

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
  let nextId = (pagination.current - 1) * pagination.pageSize + 1;

  const displayedIds = categories.map((category, index) => nextId + index);
  const columns = [
    {
      title: 'Category ID',
      dataIndex: '_id',
      key: '_id',
      align: 'center',
      render: (_, record, index) => displayedIds[index],
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      align: 'center',
      ...getColumnSearchProps('name'),
    },
    {
      title: 'Image',
      dataIndex: 'media',
      key: 'media',
      align: 'center',
      render: (media) => <img src={media} alt="Category" style={{ display: 'block', margin: '0 auto', maxWidth: '100px' }} />,
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
    <div style={{ display: 'flex', alignItems: 'center', marginBottom:'30px' }}>
  <p style={{ color: '#0C2D57', fontWeight: 'bold', marginRight: 'auto', marginLeft: '20px', fontSize: '1.2em' }}>Categories</p>
  <Button
    type="primary"
    onClick={() => setAddModalVisible(true)}
    icon={<PlusOutlined />}
    style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}
  >
   Add Category
  </Button>
</div>
<Modal
title="Add Category"
visible={addModalVisible}
onOk={handleAddCategory}
onCancel={handleCancel}
okButtonProps={{ style: buttonStyle }}
cancelButtonProps={{ style: buttonStyle }}
>
<Form form={form} layout="vertical">
  <Form.Item name="name" label="Name" rules={[{ required: true }]}>
    <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
  </Form.Item>
  <Form.Item name="media" label="Image">
    <Upload id="media-upload" {...uploadProps}>
      <Button style={{ backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' }}>Click to Upload</Button>
    </Upload>
  {imageUrl && (
    <div>
      <img src={imageUrl} alt="Category" style={{ display: 'block', margin: '10px auto', maxWidth: '200px' }} />
    </div>
  )}
</Form.Item>
</Form>
</Modal>
      <Modal
  title="Edit Category"
  visible={editModalVisible}
  onOk={handleUpdate}
  onCancel={handleCancel}
  okButtonProps={{ style: buttonStyle }}
  cancelButtonProps={{ style: buttonStyle }}
>
  <Form form={form} layout="vertical" initialValues={editedCategory}>
    <Form.Item name="name" label="Name" rules={[{ required: true }]}>
      <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
    </Form.Item>
    <Form.Item name="media" label="Image">
      <Upload {...uploadProps}>
        <Button style={{ backgroundColor: '#0C2D57', borderColor: '#0C2D57', color: '#ffffff' }}>Click to Upload</Button>
      </Upload>
      {editedCategory && editedCategory.media && (
        <div>
        <img src={editedCategory.media} alt="Category" style={{ display: 'block', margin: '10px auto', maxWidth: '200px' }} />
        </div>
      )}
    </Form.Item>
  </Form>
</Modal>

      <div style={{ overflowX: 'auto' }}>
        <Table 
          columns={columns} 
          dataSource={categories} 
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

export default Category;
