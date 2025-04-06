import React, { useState, useEffect } from 'react';
import '../../styles/AdminPanels.css';
import 'antd/dist/reset.css';
import { Button, Table, message, Upload, Image } from 'antd';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

const MarketPanel = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [deleteModalVisible, setDeleteModalVisible] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    categoryId: '',
    price: '',
    stock: '',
    image: undefined
  });
  
  // Check dark mode on component mount and when body classes change
  useEffect(() => {
    setIsDarkMode(document.body.classList.contains('dark-mode'));
    
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === 'class') {
          setIsDarkMode(document.body.classList.contains('dark-mode'));
        }
      });
    });
    
    observer.observe(document.body, { attributes: true });
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
      // Convert file to base64
      const base64Image = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
      });
      
      // Get the authentication token
      const token = localStorage.getItem('token');
      
      // Upload the base64 image to the server
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
        throw new Error(`Failed to upload image: ${response.status} ${errorText}`);
      }
      
      const data = await response.json();
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
      setFormData({
        name: product.productName,
        description: product.description,
        categoryId: product.category?.id,
        price: product.price,
        stock: product.stock,
        image: undefined
      });
    } else {
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        stock: '',
        image: undefined
      });
    }
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setFormData({
      name: '',
      description: '',
      categoryId: '',
      price: '',
      stock: '',
      image: undefined
    });
    setEditingProduct(null);
  };

  const handleSubmit = async (values) => {
    try {
      // Get the authentication token
      const token = localStorage.getItem('token');
      const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      };
      
      let imageUrl = editingProduct?.imagePath;

      // Check if there's an image to upload
      if (values.image && values.image.length > 0) {
        const fileObj = values.image[0].originFileObj;
        
        // Double check file type before upload
        if (!fileObj.type.startsWith('image/')) {
          message.error('Only image files are allowed!');
          return;
        }
        
        if (fileObj) {
          const uploadedImagePath = await handleImageUpload(fileObj);
          if (uploadedImagePath) {
            imageUrl = uploadedImagePath;
          } else {
            // If image upload failed, show error and return
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

      let response;
      
      if (editingProduct) {
        // Update existing product
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
        response = await fetch('http://localhost:8080/api/market/products', {
          method: 'POST',
          headers: headers,
          body: JSON.stringify(productData),
        });
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save product: ${response.status} ${errorText}`);
      }

      // Refresh the products list
      const productsResponse = await fetch('http://localhost:8080/api/market/products', {
        headers: headers
      });
      const updatedProducts = await productsResponse.json();
      setProducts(updatedProducts);
      
      message.success(editingProduct ? 'Product updated successfully' : 'Product added successfully');
      setIsModalVisible(false);
      setFormData({
        name: '',
        description: '',
        categoryId: '',
        price: '',
        stock: '',
        image: undefined
      });
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

  const handleEditClick = () => {
    setIsEditing(!isEditing);
    setIsDeleting(false);
    setEditingProduct(null);
  };

  const handleDeleteClick = () => {
    setIsDeleting(!isDeleting);
    setIsEditing(false);
    setEditingProduct(null);
    setProductToDelete(null);
  };

  const handleSelectProduct = (product) => {
    if (isEditing) {
      showModal(product);
    } else if (isDeleting) {
      showDeleteConfirm(product);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.productName.toLowerCase().includes(searchText.toLowerCase());
    return matchesSearch;
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
  ];

  const uploadProps = {
    beforeUpload: (file) => {
      const isImage = file.type.startsWith('image/');
      if (!isImage) {
        message.error('You can only upload image files!');
        return Upload.LIST_IGNORE;
      }
      const isLt2M = file.size / 1024 / 1024 < 2;
      if (!isLt2M) {
        message.error('Image must be smaller than 2MB!');
        return Upload.LIST_IGNORE;
      }
      return false; // Prevent automatic upload
    },
    accept: "image/*",
    maxCount: 1,
  };

  return (
    <div className="panel-container">
      <div className="panel-header">
        <h2>Market Management</h2>
        <div className="search-and-actions">
          <div className="search-bar">
            <input
              type="text"
              placeholder="Search by name..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              className="search-input"
            />
          </div>
          <div className="panel-actions">
            <button 
              onClick={handleDeleteClick} 
              className={`delete-button ${isDeleting ? 'active' : ''}`}
            >
              <DeleteOutlined />
            </button>
            <button 
              onClick={handleEditClick} 
              className={`edit-button ${isEditing ? 'active' : ''}`}
            >
              ✎
            </button>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={() => showModal()}
            >
              Add New Product
            </Button>
          </div>
        </div>
      </div>

      {isEditing && (
        <div className="edit-mode-banner">
          <span className="edit-icon">✏️</span>
          <span className="edit-text">Edit Mode: Click on any product to edit its information.</span>
        </div>
      )}

      {isDeleting && (
        <div className="delete-mode-banner">
          <span className="delete-icon">🗑️</span>
          <span className="delete-text">Delete Mode: Click on any product to delete it.</span>
        </div>
      )}

      <Table
        loading={loading}
        columns={columns}
        dataSource={filteredProducts}
        rowKey="id"
        pagination={{ 
          pageSize: 10,
          className: isDarkMode ? 'dark-pagination' : 'custom-pagination'
        }}
        className={`${isDarkMode ? 'dark-table' : ''} ${isEditing ? 'edit-mode-container' : ''} ${isDeleting ? 'delete-mode-container' : ''}`}
        style={{
          ...(isDarkMode && {
            color: '#fff',
            borderRadius: '8px',
            overflow: 'hidden'
          })
        }}
        onRow={(record) => ({
          onClick: () => handleSelectProduct(record),
          className: isEditing ? 'selectable-row' : isDeleting ? 'deletable-row' : ''
        })}
      />

      {/* Add/Edit Product Modal */}
      {isModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>{editingProduct ? 'Edit Product' : 'Add New Product'}</h3>
            <form onSubmit={async (e) => {
              e.preventDefault();
              await handleSubmit(formData);
            }}>
              <div className="form-grid">
                <div className="input-group">
                  <label htmlFor="product-image">Product Image</label>
                  <div className="image-upload-container">
                    <Upload
                      {...uploadProps}
                      listType="picture-card"
                      showUploadList={{
                        showPreviewIcon: true,
                        showRemoveIcon: true,
                      }}
                      onChange={({ fileList }) => setFormData({...formData, image: fileList})}
                    >
                      {(!formData.image || formData.image.length === 0) && (
                        <div>
                          <PlusOutlined />
                          <div style={{ marginTop: 8 }}>Upload</div>
                        </div>
                      )}
                    </Upload>
                    {editingProduct?.imagePath && !formData.image && (
                      <div className="current-image">
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
                    <small className="input-hint">Supported formats: JPG, PNG. Maximum size: 2MB</small>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="product-name">Product Name</label>
                  <input
                    id="product-name"
                    type="text"
                    placeholder="Enter product name"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>

                <div className="input-group full-width">
                  <label htmlFor="product-description">Description</label>
                  <textarea
                    id="product-description"
                    className="description-input"
                    placeholder="Enter product description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    required
                  ></textarea>
                </div>

                <div className="input-group">
                  <label htmlFor="product-category">Category</label>
                  <select
                    id="product-category"
                    value={formData.categoryId}
                    onChange={(e) => setFormData({...formData, categoryId: e.target.value})}
                    required
                  >
                    <option value="">Select a Category</option>
                    {categories.map((category, index) => (
                      <option key={index} value={index + 1}>{category}</option>
                    ))}
                  </select>
                </div>

                <div className="input-group">
                  <label htmlFor="product-price">Price (₺)</label>
                  <input
                    id="product-price"
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="Enter price"
                    value={formData.price}
                    onChange={(e) => setFormData({...formData, price: e.target.value})}
                    required
                  />
                </div>

                <div className="input-group">
                  <label htmlFor="product-stock">Stock</label>
                  <input
                    id="product-stock"
                    type="number"
                    min="0"
                    placeholder="Enter stock amount"
                    value={formData.stock}
                    onChange={(e) => setFormData({...formData, stock: e.target.value})}
                    required
                  />
                </div>
              </div>
              
              <div className="modal-buttons">
                <button type="button" onClick={handleCancel} className="cancel-button">Cancel</button>
                <button type="submit" className="add-button">
                  {editingProduct ? 'Update Product' : 'Add Product'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Custom Delete Confirmation Modal */}
      {deleteModalVisible && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Confirm Deletion</h3>
            <div className="confirmation-content">
              <div className="warning-icon">⚠️</div>
              <p>Are you sure you want to delete the product:</p>
              <div className="highlighted-name">{productToDelete?.productName}</div>
              <p className="warning-text">This action cannot be undone!</p>
            </div>
            <div className="modal-buttons">
              <button onClick={cancelDelete} className="cancel-button">Cancel</button>
              <button onClick={() => handleDelete(productToDelete?.id)} className="delete-confirm-button">Delete</button>
            </div>
          </div>
        </div>
      )}

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

        /* Fix for sorted column background in dark mode */
        :where(.css-dev-only-do-not-override-1v613y0).ant-table-wrapper .ant-table-tbody > tr > td.ant-table-column-sort {
          background-color: inherit !important;
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
            background-color: #1a1a1a !important;
            color: #fff;
            border-bottom: 1px solid #333;
          }

          /* Fix for sorted column background in dark mode */
          .dark-table .ant-table-tbody > tr > td.ant-table-column-sort {
            background-color: #1a1a1a !important;
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
        ` : ''}

        /* Description input specific styles */
        .description-input {
          min-height: 100px !important;
          resize: vertical !important;
          white-space: pre-wrap !important;
          overflow-wrap: break-word !important;
          line-height: 1.5 !important;
          padding: 12px !important;
        }

        .dark-mode .description-input {
          background-color: #2c2c2c !important;
          color: #fff !important;
          border-color: #404040 !important;
        }

        .dark-mode .description-input:focus {
          border-color: #177ddc !important;
          box-shadow: 0 0 0 2px rgba(23, 125, 220, 0.2) !important;
        }

        .description-input:focus {
          border-color: #40a9ff !important;
          box-shadow: 0 0 0 2px rgba(24, 144, 255, 0.2) !important;
        }

        /* Upload component icon styles */
        .image-upload-container .ant-upload-list-item-actions {
          display: flex !important;
          justify-content: center !important;
          align-items: center !important;
          gap: 8px !important;
          position: absolute !important;
          top: 50% !important;
          left: 50% !important;
          transform: translate(-50%, -50%) !important;
          background: rgba(0, 0, 0, 0.45) !important;
          border-radius: 20px !important;
          padding: 4px 12px !important;
        }

        .image-upload-container .ant-upload-list-item-actions .ant-upload-list-item-action {
          opacity: 1 !important;
        }

        .image-upload-container .ant-upload-list-item:hover .ant-upload-list-item-info::before {
          opacity: 1 !important;
        }

        .image-upload-container .ant-upload-list-item-actions .anticon {
          color: white !important;
          font-size: 16px !important;
          transition: transform 0.2s !important;
        }

        .image-upload-container .ant-upload-list-item-actions .anticon:hover {
          transform: scale(1.1) !important;
        }
      `}</style>
    </div>
  );
};

export default MarketPanel; 