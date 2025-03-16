import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import 'antd/dist/reset.css';
import { Button, Table, Form, Modal, Input, Select, message, Popconfirm, Upload, Image, theme } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const MarketPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  
  // Check dark mode on component mount and when body classes change
  useEffect(() => {
    // Initial check
    setIsDarkMode(document.body.classList.contains('dark-mode'));
    
    // Create observer to watch for class changes on body
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.body.classList.contains('dark-mode'));
        }
      });
    });
    
    // Start observing
    observer.observe(document.body, { attributes: true });
    
    // Cleanup
    return () => observer.disconnect();
  }, []);

  // Fetch products and categories from the backend
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Fetch products
        const productsResponse = await fetch('http://localhost:8080/api/market/products');
        if (!productsResponse.ok) {
          throw new Error('Failed to fetch products');
        }
        const productsData = await productsResponse.json();
        
        // Fetch categories
        const categoriesResponse = await fetch('http://localhost:8080/api/market/categories');
        if (!categoriesResponse.ok) {
          throw new Error('Failed to fetch categories');
        }
        const categoriesData = await categoriesResponse.json();
        
        setProducts(productsData);
        setCategories(categoriesData.map(category => category.name));
        setLoading(false);
      } catch (error) {
        console.error('Error fetching data:', error);
        message.error('Failed to load data from server');
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleImageUpload = async (file) => {
    try {
      console.log("Starting image upload for file:", file.name);
      
      // Convert file to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => {
          console.log("File converted to base64, length:", reader.result.length);
          resolve(reader.result);
        };
      });
      
      // Get the authentication token
      const token = localStorage.getItem('token');
      console.log("Got authentication token");
      
      // Upload the base64 image to the server
      console.log("Sending image to server...");
      const response = await fetch('http://localhost:8080/api/images/upload-base64', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ image: base64Image })
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response not OK:", response.status, errorText);
        throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
      console.log("Image upload successful, received path:", data.imagePath);
      return data.imagePath; // Return the path to the saved image
    } catch (error) {
      console.error('Error uploading image:', error);
      message.error('Failed to upload image: ' + error.message);
      return null;
    }
  };

  const showModal = (product = null) => {
    setEditingProduct(product);
    if (product) {
      form.setFieldsValue({
        name: product.productName,
        description: product.description,
        categoryId: product.category?.id,
        price: product.price,
        stock: product.stock,
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
    try {
      console.log("Starting form submission, values:", values);
      
      // Get the authentication token
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      let imageUrl = editingProduct?.imagePath;
      console.log("Initial image URL:", imageUrl);

      // Check if there's an image to upload
      console.log("Image value:", values.image);
      if (values.image && values.image.length > 0) {
        const fileObj = values.image[0].originFileObj;
        console.log("File object:", fileObj);
        
        if (fileObj) {
          console.log("New image detected, uploading...");
          const uploadedImagePath = await handleImageUpload(fileObj);
          if (uploadedImagePath) {
            imageUrl = uploadedImagePath;
            console.log("Image uploaded successfully, new path:", imageUrl);
          } else {
            // If image upload failed, show error and return
            console.error("Image upload failed");
            message.error('Failed to upload image. Please try again.');
            return;
          }
        }
      }

      // Prepare the product data
      const productData = {
        productName: values.name,
        description: values.description,
        price: parseFloat(values.price),
        stock: parseInt(values.stock, 10),
        imagePath: imageUrl,
        category: {
          id: values.categoryId
        }
      };
      
      console.log("Prepared product data:", productData);

      let response;
      
      if (editingProduct) {
        // Update existing product
        console.log("Updating existing product ID:", editingProduct.id);
        response = await fetch(`http://localhost:8080/api/market/products/${editingProduct.id}`, {
          method: 'PUT',
          headers: headers,
          body: JSON.stringify({
            ...productData,
            id: editingProduct.id
          }),
        });
      } else {
        // Create new product
        console.log("Creating new product");
        response = await fetch('http://localhost:8080/api/market/products', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error("Server response not OK:", response.status, errorText);
        throw new Error(`Failed to save product: ${response.status} ${errorText}`);
      }

      // Refresh the products list
      console.log("Product saved successfully, refreshing product list");
      const productsResponse = await fetch('http://localhost:8080/api/market/products', {
        headers: headers
      });
      const updatedProducts = await productsResponse.json();
      setProducts(updatedProducts);
      
      message.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setIsModalVisible(false);
      form.resetFields();
      setEditingProduct(null);
    } catch (error) {
      console.error('Error saving product:', error);
      message.error('Failed to save product: ' + error.message);
    }
  };

  const handleDelete = async (productId) => {
    try {
      const token = localStorage.getItem('token');
      const headers = {
        'Authorization': `Bearer ${token}`
      };
      
      const response = await fetch(`http://localhost:8080/api/market/products/${productId}`, {
        method: 'DELETE',
        headers: headers
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      // Update the local state
      setProducts(products.filter(p => p.id !== productId));
      message.success('Product deleted successfully');
      setDeleteModalVisible(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      message.error('Failed to delete product');
    }
  };

  const showDeleteConfirm = (product) => {
    setProductToDelete(product);
    setDeleteModalVisible(true);
  };

  const cancelDelete = () => {
    setDeleteModalVisible(false);
    setProductToDelete(null);
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchText.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || 
                           (product.category && product.category.name === selectedCategory);
    return matchesSearch && matchesCategory;
  });

  const columns = [
    {
      title: 'Product Image',
      dataIndex: 'imagePath',
      key: 'imagePath',
      render: (imagePath) => (
        <Image
          src={imagePath}
          alt="Product image"
          width={80}
          height={80}
          style={{ 
            objectFit: 'contain', 
            background: 'transparent', 
            padding: '4px'
          }}
        />
      ),
    },
    {
      title: 'Product Name',
      dataIndex: 'productName',
      key: 'productName',
      sorter: (a, b) => a.productName.localeCompare(b.productName),
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
      render: (text) => (
        <span title={text}>{text}</span>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => category?.name,
      filters: categories.map(cat => ({ text: cat, value: cat })),
      onFilter: (value, record) => record.category?.name === value,
    },
    {
      title: 'Price (₺)',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => {
        const numPrice = typeof price === 'string' ? parseFloat(price) : price;
        return isNaN(numPrice) ? '₺0.00' : `₺${numPrice.toFixed(2)}`;
      },
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
          <Button 
            type="primary" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => showDeleteConfirm(record)}
            className="delete-button"
          >
            Delete
          </Button>
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
        loading={loading}
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          className: isDarkMode ? 'dark-pagination' : 'custom-pagination'
        }}
        className={isDarkMode ? 'dark-table' : ''}
        style={{
          ...(isDarkMode && {
            color: '#fff',
            borderRadius: '8px',
            overflow: 'hidden'
          })
        }}
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
            getValueFromEvent={e => {
              console.log("Upload event:", e);
              if (Array.isArray(e)) {
                return e;
              }
              return e?.fileList;
            }}
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
          {editingProduct?.imagePath && !form.getFieldValue('image') && (
            <div style={{ marginBottom: 24 }}>
              <p>Current Image:</p>
              <Image
                src={editingProduct.imagePath}
                alt="Current product image"
                width={100}
                height={100}
                style={{ 
                  objectFit: 'contain', 
                  background: 'transparent',
                  padding: '4px'
                }}
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
            name="description"
            label="Description"
            rules={[{ required: true, message: 'Please enter product description!' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item
            name="categoryId"
            label="Category"
            rules={[{ required: true, message: 'Please select a category!' }]}
          >
            <Select>
              {categories.map((category, index) => (
                <Option key={index} value={index + 1}>{category}</Option>
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

      {/* Custom Delete Confirmation Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', color: isDarkMode ? '#fff' : 'inherit' }}>
            <ExclamationCircleOutlined style={{ color: '#ff4d4f', marginRight: '10px' }} />
            <span>Delete Product</span>
          </div>
        }
        open={deleteModalVisible}
        onCancel={cancelDelete}
        footer={null}
        centered
        closable={false}
        width={400}
        className={isDarkMode ? 'dark-modal' : ''}
        bodyStyle={{
          padding: '24px',
          backgroundColor: isDarkMode ? '#1f1f1f' : '#f5f5f5',
          color: isDarkMode ? '#fff' : 'inherit'
        }}
      >
        <p style={{ fontSize: '16px', marginBottom: '24px' }}>
          Are you sure you want to delete this product?
        </p>
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px' }}>
          <Button onClick={cancelDelete}>
            No
          </Button>
          <Button 
            type="primary" 
            danger 
            onClick={() => handleDelete(productToDelete?.id)}
          >
            Yes
          </Button>
        </div>
      </Modal>

      {/* Add custom CSS for dark mode */}
      <style jsx="true">{`
        /* Custom pagination styles for both light and dark mode */
        .custom-pagination .ant-pagination-item-active {
          background-color: #ff4757;
          border-color: #ff4757;
        }
        
        .custom-pagination .ant-pagination-item-active a {
          color: #fff;
        }
        
        /* Table header styles for both light and dark mode */
        .ant-table-thead {
          position: relative;
          box-shadow: 0 3px 5px rgba(0, 0, 0, 0.1);
          z-index: 1;
        }
        
        .ant-table-thead > tr > th {
          background: linear-gradient(to bottom, #f8f8f8, #f0f0f0) !important;
          font-weight: 600;
          border-bottom: 2px solid #d9d9d9 !important;
          border-right: 1px solid #e8e8e8;
          padding: 12px 16px;
        }
        
        .ant-table-thead > tr > th:last-child {
          border-right: none;
        }
        
        /* Dark mode table styles */
        ${isDarkMode ? `
          .dark-table {
            border-radius: 8px;
            overflow: hidden;
            background: transparent;
          }
          
          .dark-table .ant-table {
            background: transparent;
            color: #fff;
          }
          
          .dark-table .ant-table-container {
            border-radius: 8px;
            overflow: hidden;
          }
          
          .dark-table .ant-table-thead {
            position: relative;
            box-shadow: 0 3px 5px rgba(0, 0, 0, 0.2);
            z-index: 1;
          }
          
          .dark-table .ant-table-thead > tr > th {
            background: linear-gradient(to bottom, #353535, #2d2d2d) !important;
            color: #fff !important;
            border-bottom: 2px solid #505050;
            border-right: 1px solid #404040;
            font-weight: 600;
            padding: 12px 16px;
          }
          
          .dark-table .ant-table-thead > tr > th:last-child {
            border-right: none;
          }
          
          .dark-table .ant-table-thead > tr:first-child > th:first-child {
            border-top-left-radius: 8px;
          }
          
          .dark-table .ant-table-thead > tr:first-child > th:last-child {
            border-top-right-radius: 8px;
          }
          
          .dark-table .ant-table-tbody > tr > td {
            background-color: #1a1a1a;
            color: #fff;
            border-bottom: 1px solid #333;
          }
          
          .dark-table .ant-table-tbody > tr:hover > td {
            background-color: #2a2a2a !important;
          }
          
          .dark-table .ant-table-tbody > tr:last-child > td:first-child {
            border-bottom-left-radius: 8px;
          }
          
          .dark-table .ant-table-tbody > tr:last-child > td:last-child {
            border-bottom-right-radius: 8px;
          }
          
          .dark-table .ant-table-column-sorter {
            color: #aaa;
          }
          
          .dark-table .ant-table-column-sorter-up.active,
          .dark-table .ant-table-column-sorter-down.active {
            color: #fff;
          }
          
          .dark-table .ant-table-column-sort {
            background-color: #2d2d2d !important;
          }
          
          .dark-table .ant-table-pagination.ant-pagination {
            margin: 16px 0;
            background: transparent;
          }
          
          .dark-pagination {
            background: transparent !important;
          }
          
          .dark-pagination .ant-pagination-item {
            background-color: #2c2c2c;
            border-color: #444;
          }
          
          .dark-pagination .ant-pagination-item a {
            color: #fff;
          }
          
          .dark-pagination .ant-pagination-item-active {
            background-color: #ff4757;
            border-color: #ff4757;
          }
          
          .dark-pagination .ant-pagination-prev button,
          .dark-pagination .ant-pagination-next button,
          .dark-pagination .ant-pagination-jump-prev button,
          .dark-pagination .ant-pagination-jump-next button {
            background-color: #2c2c2c;
            color: #fff;
            border-color: #444;
          }
          
          .dark-pagination .ant-pagination-options {
            background: transparent;
          }
          
          .dark-pagination .ant-pagination-options .ant-select-selector {
            background-color: #2c2c2c;
            color: #fff;
            border-color: #444;
          }
          
          .dark-pagination .ant-select-selection-item {
            color: #fff;
          }
          
          /* Dark Mode Modal Styles */
          .dark-modal .ant-modal-content {
            background-color: #1f1f1f;
            box-shadow: 0 3px 6px -4px rgba(0, 0, 0, 0.48), 0 6px 16px 0 rgba(0, 0, 0, 0.32), 0 9px 28px 8px rgba(0, 0, 0, 0.2);
          }
          
          .dark-modal .ant-modal-header {
            background-color: #1f1f1f;
            border-bottom: 1px solid #303030;
          }
          
          .dark-modal .ant-modal-title {
            color: #fff;
          }
          
          .dark-modal .ant-modal-close {
            color: #999;
          }
          
          .dark-modal .ant-modal-close:hover {
            color: #fff;
          }
        ` : ''}
      `}</style>
    </div>
  );
};

export default MarketPanel; 