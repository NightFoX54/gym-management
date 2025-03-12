import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import 'antd/dist/reset.css';
import { Button, Table, Form, Modal, Input, Select, message, Popconfirm, Upload, Image, theme } from 'antd';
import { SearchOutlined, PlusOutlined, EditOutlined, DeleteOutlined, UploadOutlined, ExclamationCircleOutlined } from '@ant-design/icons';

const { Option } = Select;

const MarketPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState(['Supplement', 'Equipment', 'Clothing', 'Accessories']);
  const [searchText, setSearchText] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [form] = Form.useForm();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  
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

  useEffect(() => {
    // Müşteri tarafında sunulan tüm ürünleri admin paneline ekliyoruz
    const allProducts = [
      // Supplements
      {
        id: 1,
        name: 'Whey Protein Powder',
        category: 'Supplement',
        price: 599.99,
        stock: 45,
        imageUrl: '/protein.png',
        description: 'High-quality whey protein powder for muscle recovery - 2000g'
      },
      {
        id: 2,
        name: 'BCAA Amino Acids',
        category: 'Supplement',
        price: 299.99,
        stock: 60,
        imageUrl: '/bcaa.png',
        description: 'Essential amino acids for muscle growth and recovery - 400g'
      },
      {
        id: 3,
        name: 'Pre-Workout Energy',
        category: 'Supplement',
        price: 349.99,
        stock: 38,
        imageUrl: '/preworkout.png',
        description: 'Advanced pre-workout formula for maximum performance - 300g'
      },

      // Equipment
      {
        id: 4,
        name: 'Premium Yoga Mat',
        category: 'Equipment',
        price: 199.99,
        stock: 25,
        imageUrl: '/yoga-mat.png',
        description: 'Non-slip, eco-friendly yoga mat with alignment lines'
      },
      {
        id: 5,
        name: 'Adjustable Dumbbell Set',
        category: 'Equipment',
        price: 1499.99,
        stock: 12,
        imageUrl: '/dumbbells.png',
        description: 'Space-saving adjustable dumbbells 2-24kg each'
      },
      {
        id: 6,
        name: 'Resistance Bands Set',
        category: 'Equipment',
        price: 249.99,
        stock: 30,
        imageUrl: '/bands.png',
        description: 'Set of 5 resistance bands with different strength levels'
      },

      // Clothing
      {
        id: 7,
        name: 'Performance T-Shirt',
        category: 'Clothing',
        price: 149.99,
        stock: 85,
        imageUrl: '/tshirt.png',
        description: 'Moisture-wicking, breathable training t-shirt'
      },
      {
        id: 8,
        name: 'Training Shorts',
        category: 'Clothing',
        price: 179.99,
        stock: 70,
        imageUrl: '/shorts.png',
        description: 'Flexible, quick-dry training shorts with pockets'
      },
      {
        id: 9,
        name: 'Compression Leggings',
        category: 'Clothing',
        price: 229.99,
        stock: 55,
        imageUrl: '/leggings.png',
        description: 'High-waist compression leggings with phone pocket'
      },

      // Accessories
      {
        id: 10,
        name: 'Sports Water Bottle',
        category: 'Accessories',
        price: 89.99,
        stock: 120,
        imageUrl: '/bottle.png',
        description: 'BPA-free sports water bottle with time markings - 1L'
      },
      {
        id: 11,
        name: 'Gym Bag',
        category: 'Accessories',
        price: 259.99,
        stock: 40,
        imageUrl: '/gym-bag.png',
        description: 'Spacious gym bag with wet compartment and shoe pocket'
      },
      {
        id: 12,
        name: 'Lifting Gloves',
        category: 'Accessories',
        price: 129.99,
        stock: 65,
        imageUrl: '/gloves.png',
        description: 'Premium weightlifting gloves with wrist support'
      }
    ];
    
    setProducts(allProducts);
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
    setDeleteModalVisible(false);
    setProductToDelete(null);
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
            <Input.TextArea rows={3} />
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