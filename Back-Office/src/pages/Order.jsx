import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Table, Button, Modal, Form, Input, Space, Row, Col, Card, Select } from 'antd'; // Add Col to the imports
import { PlusOutlined, EditOutlined, DeleteOutlined, SearchOutlined, EyeOutlined } from '@ant-design/icons';
import Highlighter from 'react-highlight-words';
import { fetchOrders, createOrder, updateOrder as updateOrderAPI, deleteOrder as deleteOrderAPI } from '../API/orders';
import { fetchOrdersRequest, fetchOrdersSuccess, fetchOrdersFailure, addOrder as addOrderAction, updateOrder as updateOrderAction, deleteOrder as deleteOrderAction } from '../Redux/actions/Orders';
import { message } from 'antd';
import axios from 'axios';

const { Option } = Select;
const Order = () => {
  const dispatch = useDispatch();
  const { orders } = useSelector((state) => state.Orders);
  const [pagination, setPagination] = useState({ current: 1, pageSize: 4 });
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editedOrder, setEditedOrder] = useState(null);
  const [searchText, setSearchText] = useState('');
  const [searchedColumn, setSearchedColumn] = useState('');
  const searchInput = useRef(null);
  const [form] = Form.useForm(); // Initialize form
  const [products, setProducts] = useState([]);
  const [productNames, setProductNames] = useState([]); // State to store product names

  const fetchProducts = async () => {
    try {
      const response = await axios.get('https://packpal-backend.vercel.app/products');
      // Extract product names from the response data
      const productNames = response.data.map(product => product.title);
      return productNames;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  };

  const fetchProductNames = async () => {
    try {
      const names = await fetchProducts();
      setProductNames(names);
    } catch (error) { }
  };
  useEffect(() => {
    fetchProductNames();
    dispatch(fetchOrdersRequest());
    fetchOrders()
      .then((orders) => {
        dispatch(fetchOrdersSuccess(orders));
      })
      .catch((error) => {
        dispatch(fetchOrdersFailure(error));
      });
  }, [dispatch]);

  const handleEdit = (record) => {
    setEditedOrder(record);
    setEditModalVisible(true);
    setProducts(record.products); 
    form.setFieldsValue(record); 
  };

  const handleCancel = () => {
    form.resetFields();
    setAddModalVisible(false);
    setEditModalVisible(false);
    setEditedOrder(null);
    setProducts([]); 
  };

  const handleAddOrder = async () => {
    try {
      await form.validateFields();
      const values = { ...form.getFieldsValue(), products };
      await createOrder(values);
      dispatch(addOrderAction(values));
      form.resetFields();
      setAddModalVisible(false);
      setProducts([]);
      message.success('Order added successfully');
      window.location.reload();
    } catch (error) {
      console.error('Error adding order:', error);
      message.error('Failed to add order');
    }
  };
  
  const handleUpdate = async () => {
    try {
      const values = await form.validateFields();
      const updatedValues = { ...values, products };
      await updateOrderAPI(editedOrder._id, updatedValues);
      dispatch(updateOrderAction(editedOrder._id, updatedValues));
      setEditModalVisible(false);
      setEditedOrder(null);
      setProducts([]);
      message.success('Order Update successfully');
    } catch (error) {
      console.error('Error updating order:', error);
    }
  };
  

  const handleDelete = async (orderId) => {
    try {
      await deleteOrderAPI(orderId);
      dispatch(deleteOrderAction(orderId));
      message.success('Order Delete successfully');
    } catch (error) {
      console.error('Error deleting order:', error);
    }
  };

  const handleProductAdd = () => {
    setProducts([...products, { product: '', quantity: '', price: '' }]);
  };

  const handleProductChange = (index, key, value) => {
    const updatedProducts = [...products];
    updatedProducts[index][key] = value;
    setProducts(updatedProducts);
  };

  const handleSeeMore = async (record) => {
    try {
      const orderDetails = orders.find(order => order._id === record._id);
  
      if (orderDetails) {
      Modal.info({
        title: 'Order Details',
        width: 800,
        icon: null,
        content: (
          <div>
            <p><strong>Customer :</strong> {orderDetails.customer}</p>
            <p><strong>Status :</strong> {orderDetails.status}</p>
            <p><strong>Total Price :</strong> {orderDetails.total_price}</p>
            <p><strong>Payment Method :</strong> {orderDetails.payment_method}</p>
            <p><strong>Address :</strong> {orderDetails.address_line}, {orderDetails.city}, {orderDetails.state}, {orderDetails.country}, {orderDetails.postal_code}</p>
            <p><strong>Phone :</strong> {orderDetails.phone}</p>
            <p><strong>Products :</strong></p>
            <Row gutter={[16, 16]}>
              {orderDetails.products.map((product, index) => (
                <Col span={8} key={index} style={{ margin: '10px 0' }}>
                  <Card style={{ backgroundColor: '#0C2D57', color: 'white', borderRadius: '10px' }}>
                    <p><strong style={{ color: '#d9a74a' }}>Product :</strong><br />{product.product}</p>
                    <p><strong style={{ color: '#d9a74a' }}>Quantity :</strong><br />{product.quantity}</p>
                    <p><strong style={{ color: '#d9a74a' }}>Price :</strong><br />{product.price}</p>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
        ),
        okText: 'Close',
        okButtonProps: { style: buttonStyle },
        cancelButtonProps: { style: buttonStyle }
      });}
    } catch (error) {
      console.error('Error fetching order details:', error);
      message.error('Failed to fetch order details');
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
          size="small"
          style={{ width: 90, marginRight: 8 }}
        >
          Search
        </Button>
        <Button size="small" onClick={() => handleReset(clearFilters)}>
          Reset
        </Button>
      </div>
    ),
    filterIcon: (filtered) => {
      if (dataIndex === '_id' || dataIndex === 'customer' || dataIndex === 'status') {
        return <SearchOutlined style={{ color: filtered ? '#1890ff' : undefined }} />;
      }
      return null;
    },
    onFilter: (value, record) =>
      (dataIndex === '_id' || dataIndex === 'customer' || dataIndex === 'status')
        ? record[dataIndex] && record[dataIndex].toString().toLowerCase().includes(value.toLowerCase())
        : '',
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

let orderIdCounter = (pagination.current - 1) * pagination.pageSize + 1;
const displayedOrderIds = orders.map(() => orderIdCounter++);

const columns = [
  {
    title: 'Order',
    dataIndex: '_id', 
    key: '_id',
    align: 'center',
    render: (_, record, index) => displayedOrderIds[index],
  },
    {
      title: 'Customer',
      dataIndex: 'customer',
      key: 'customer',
      align: 'center',
      ...getColumnSearchProps('customer'),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      align: 'center',
      ...getColumnSearchProps('status'),
    },
    {
      title: 'Phone',
      dataIndex: 'phone',
      key: 'phone',
      align: 'center',
      ...getColumnSearchProps('phone'),
    },
    {
      title: 'Action',
      key: 'action',
      align: 'center',
      render: (_, record) => (
        <Space>
          <Button type="link" onClick={() => handleEdit(record)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
            <EditOutlined />
          </Button>
          <Button type="link" onClick={() => handleDelete(record._id)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
            <DeleteOutlined />
          </Button>
          <Button type="link" onClick={() => handleSeeMore(record)} style={{ color: '#0C2D57', fontSize: '1.5em' }}>
          <EyeOutlined />
          </Button>
        </Space>
      ),
    },
  ];
  const handleRemoveProduct = (index) => {
    const updatedProducts = [...products];
    updatedProducts.splice(index, 1); // Remove the product at the specified index
    setProducts(updatedProducts); // Update the products state
  };
  
  return (
    <div style={{ overflowX: 'auto' }}>
    <div style={{ display: 'flex', alignItems: 'center', marginBottom:'30px' }}>
    <p style={{ color: '#0C2D57', fontWeight: 'bold', marginRight: 'auto', marginLeft: '20px', fontSize: '1.2em' }}>Orders</p>
    <Button
      type="primary"
      onClick={() => setAddModalVisible(true)}
      icon={<PlusOutlined />}
      style={{ backgroundColor: '#0C2D57', color: '#ffffff' }}
    >
     Add Order
    </Button>
  </div>
      <Modal
  title="Add Order"
  visible={addModalVisible}
  onOk={handleAddOrder}
  onCancel={handleCancel}
  okButtonProps={{ style: buttonStyle }}
  cancelButtonProps={{ style: buttonStyle }}
>
  <Form form={form} layout="horizontal">
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="customer" label="Customer" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="total_price" label="Total Price" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select style={{ width: 150, borderColor: '#0C2D57' }}>
            <Option value="pending">Pending</Option>
            <Option value="ordered">Ordered</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="payment_method" label="Payment Method" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="address_line" label="Address" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="postal_code" label="Postal Code" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    {products.map((product, index) => (
      <div key={index}>
        {/* First row for product input */}
        <Row gutter={16}>
          <Col span={24}>
            <Form.Item label={`Product ${index + 1}`}>
              <Select
                placeholder="Select a product"
                style={{ width: '100%', borderColor: '#0C2D57' }}
                onChange={value => handleProductChange(index, 'product', value)}
              >
                {productNames.map((productName, idx) => (
                  <Option key={idx} value={productName}>{productName}</Option>
                ))}
              </Select>
            </Form.Item>
          </Col>
        </Row>
    
        {/* Second row for quantity and price inputs */}
        <Row gutter={16}>
          <Col span={12}>
            <Form.Item>
              <Input
                placeholder="Quantity"
                value={product.quantity}
                onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                style={{ borderColor: '#0C2D57', color: '#0C2D57', width: '100%' }}
              />
            </Form.Item>
          </Col>
          <Col span={12}>
            <Form.Item>
              <Input
                placeholder="Price"
                value={product.price}
                onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                style={{ borderColor: '#0C2D57', color: '#0C2D57', width: '100%' }}
              />
            </Form.Item>
          </Col>
        </Row>
    
        {/* Button to remove product */}
        <Row gutter={16}>
          <Col span={24}>
            <Button onClick={() => handleRemoveProduct(index)} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff', marginBottom:'8px' }}>
              Remove
            </Button>
          </Col>
        </Row>
      </div>
    ))}
    {/* Button to add more products */}
    <Button onClick={handleProductAdd} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff' }}>
      Add Product
    </Button>
  </Form>
</Modal>

<Modal
  title="Edit Order"
  visible={editModalVisible}
  onOk={handleUpdate}
  onCancel={handleCancel}
  okButtonProps={{ style: buttonStyle }}
  cancelButtonProps={{ style: buttonStyle }}
>
  <Form form={form} layout="horizontal" initialValues={editedOrder}>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="customer" label="Customer" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="total_price" label="Total Price" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="status" label="Status" rules={[{ required: true }]}>
          <Select style={{ width: 150, borderColor: '#0C2D57' }}>
            <Option value="pending">Pending</Option>
            <Option value="ordered">Ordered</Option>
            <Option value="delivered">Delivered</Option>
          </Select>
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="payment_method" label="Payment Method" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="address_line" label="Address Line" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="city" label="City" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="state" label="State" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="country" label="Country" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={12}>
        <Form.Item name="postal_code" label="Postal Code" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
      <Col span={12}>
        <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
          <Input style={{ borderColor: '#0C2D57', color: '#0C2D57' }} />
        </Form.Item>
      </Col>
    </Row>
    <Row gutter={16}>
      <Col span={24}>
      {products.map((product, index) => (
        <div key={index}>
          {/* First row for product input */}
          <Row gutter={16}>
            <Col span={24}>
            <Form.Item label={`Product ${index + 1}`}>
            <Select
              placeholder="Select a product"
              style={{ width: '100%', borderColor: '#0C2D57' }}
              onChange={value => handleProductChange(index, 'product', value)}
              defaultValue={product.product} // Set default value to current product
            >
              {productNames.map((productName, idx) => (
                <Option key={idx} value={productName}>{productName}</Option>
              ))}
            </Select>
          </Form.Item>
            </Col>
          </Row>
      
          {/* Second row for quantity and price inputs */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item>
                <Input
                  placeholder="Quantity"
                  value={product.quantity}
                  onChange={(e) => handleProductChange(index, 'quantity', e.target.value)}
                  style={{ borderColor: '#0C2D57', color: '#0C2D57', width: '100%' }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item>
                <Input
                  placeholder="Price"
                  value={product.price}
                  onChange={(e) => handleProductChange(index, 'price', e.target.value)}
                  style={{ borderColor: '#0C2D57', color: '#0C2D57', width: '100%' }}
                />
              </Form.Item>
            </Col>
          </Row>
      
          {/* Button to remove product */}
          <Row gutter={16}>
            <Col span={24}>
              <Button onClick={() => handleRemoveProduct(index)} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff', marginBottom:'8px' }}>
                Remove
              </Button>
            </Col>
          </Row>
        </div>
      ))}
      {/* Button to add more products */}
      <Button onClick={handleProductAdd} style={{ width: '100%', backgroundColor: '#0C2D57', color: '#ffffff' }}>
        Add Product
      </Button>
      </Col>
    </Row>
  </Form>
</Modal>


      <Table
        columns={columns}
        dataSource={orders}
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
  );
};

export default Order;
