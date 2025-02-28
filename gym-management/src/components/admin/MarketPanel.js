import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import 'antd/dist/reset.css';
import { Button, Table, Form, Modal, Input, Select, message, Popconfirm, Upload, Image } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined } from '@ant-design/icons';

const { Option } = Select;

const MarketPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Supplement', 'Equipment', 'Clothing', 'Accessories']);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();

  useEffect(() => {
    const sampleProducts = [
      { 
        id: 1, 
        name: 'Protein Powder', 
        category: 'Supplement', 
        price: 599.99, 
        stock: 50,
        imageUrl: '/protein.jpg'
      },
      { 
        id: 2, 
        name: 'Yoga Mat', 
        category: 'Equipment', 
        price: 199.99, 
        stock: 30,
        imageUrl: '/yoga-mati.jpg'
      },
      { 
        id: 3, 
        name: 'Sports T-Shirt', 
        category: 'Clothing', 
        price: 149.99, 
        stock: 100,
        imageUrl: '/tshirt.jpg'
      },
    ];
    setProducts(sampleProducts);
  }, []);

  const handleImageUpload = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        resolve(reader.result);
      };
    });
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        ...product,
        image: undefined // Reset image field for Upload component
      });
    } else {
      form.resetFields();
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const handleSubmit = async (values) => {
    let imageUrl = editingProduct?.imageUrl;

    // If a new image is uploaded
    if (values.image?.fileList?.[0]?.originFileObj) {
      imageUrl = await handleImageUpload(values.image.fileList[0].originFileObj);
    }

    const productData = {
      ...values,
      imageUrl
    };

    if (editingProduct) {
      // Update product
      setProducts(products.map(p => 
        p.id === editingProduct.id ? { ...productData, id: p.id } : p
      ));
      message.success('Product updated successfully');
    } else {
      // Add new product
      const newProduct = {
        ...productData,
        id: Math.max(...products.map(p => p.id), 0) + 1
      };
      setProducts([...products, newProduct]);
      message.success('Product added successfully');
    }
    setIsModalVisible(false);
    form.resetFields();
    setEditingProduct(null);
  };

  const handleDelete = (productId) => {
    setProducts(products.filter(p => p.id !== productId));
    message.success('Product deleted successfully');
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      render: (imageUrl) => (
        <Image
          src={imageUrl}
          alt="Product image"
          width={80}
          height={80}
          style={{ objectFit: 'cover' }}
        />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category === value,
    },
    {
      title: 'Price (₺)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `₺${price.toFixed(2)}`,
    },
    {
      title: 'Stock',
      dataIndex: 'stock',
      key: 'stock',
      sorter: (a, b) => a.stock - b.stock,
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <span className="action-buttons">
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => showModal(record)}
            className="edit-button"
          >
            Edit
          </Button>
          <Popconfirm
            title="Are you sure you want to delete this product?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button 
              type="primary" 
              danger 
              icon={<DeleteOutlined />}
              className="delete-button"
            >
              Delete
            </Button>
          </Popconfirm>
        </span>
      ),
    },
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return false;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return false;
      }
      return false; // Prevent automatic upload
    },
    maxCount: 1,
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Market Management</h2>
        <div className="panel-actions">
          <Input
            placeholder="Search products..."
            prefix={<SearchOutlined />}
            style={{ width: 200, marginRight: 16 }}
            value={searchText}
            onChange={e => setSearchText(e.target.value)}
          />
          <Select
            defaultValue="all"
            style={{ width: 120, marginRight: 16 }}
            onChange={value => setSelectedCategory(value)}
          >
            <Option value="all">All Categories</Option>
            {categories.map(category => (
              <Option key={category} value={category}>{category}</Option>
            ))}
          </Select>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => showModal()}
          >
            Add New Product
          </Button>
        </div>
      </div>

      <Table
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ pageSize: 10 }}
      />

      <Modal
        title={editingProduct ? 'Edit Product' : 'Add New Product'}
        open={isModalVisible}
        onCancel={handleCancel}
        footer={null}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
        >
          <Form.Item
            name="image"
            label="Product Image"
            valuePropName="fileList"
            getValueFromEvent={e => e?.fileList}
            extra="Supported formats: JPG, PNG. Maximum size: 2MB"
          >
            <Upload
              {...uploadProps}
              listType="picture-card"
              showUploadList={{
                showPreviewIcon: true,
                showRemoveIcon: true,
              }}
            >
              {(!form.getFieldValue('image') || form.getFieldValue('image').length === 0) && (
                <div>
                  <PlusOutlined />
                  <div style={{ marginTop: 8 }}>Upload</div>
                </div>
              )}
            </Upload>
          </Form.Item>
          {editingProduct?.imageUrl && !form.getFieldValue('image') && (
            <div style={{ marginBottom: 24 }}>
              <p>Current Image:</p>
              <Image
                src={editingProduct.imageUrl}
                alt="Current product image"
                width={100}
                height={100}
                style={{ objectFit: 'cover' }}
              />
            </div>
          )}
          <Form.Item
            name="name"
            label="Product Name"
            rules={[{ required: true, message: 'Please enter product name!' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="category"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select>
              {categories.map(category => (
                <Option key={category} value={category}>{category}</Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            name="price"
            label="Price (₺)"
            rules={[{ required: true, message: 'Please enter price!' }]}
          >
            <Input type="number" min={0} step={0.01} />
          </Form.Item>
          <Form.Item
            name="stock"
            label="Stock"
            rules={[{ required: true, message: 'Please enter stock amount!' }]}
          >
            <Input type="number" min={0} />
          </Form.Item>
          <Form.Item>
            <div className="modal-buttons">
              <Button onClick={handleCancel}>
                Cancel
              </Button>
              <Button type="primary" htmlType="submit">
                {editingProduct ? 'Update' : 'Add'}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default MarketPanel; 