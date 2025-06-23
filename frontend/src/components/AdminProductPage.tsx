import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getProducts, getDashboardStats, addProduct, updateProduct, deleteProduct, uploadImage, type Product } from '../services/api';
import './AdminProductPage.css';

const AdminProductPage = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modal and Form State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<Product | null>(null);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImagePath, setProductImagePath] = useState('');

  const categories = ['Tablets', 'Smartphones', 'Laptops', 'Cameras', 'Gaming', 'Audio', 'Wearables', 'Accessories'];

  const fetchProductsAndStats = async () => {
    setLoading(true);
    try {
      const productsData = await getProducts();
      const statsData = await getDashboardStats();
      setProducts(productsData);
      setTotalProducts(statsData.totalProducts);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProductsAndStats();
  }, []);

  const closeModal = () => {
    setIsModalOpen(false);
    setProductToEdit(null);
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImagePath('');
  };
  
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    if (isModalOpen) {
      document.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isModalOpen]);

  const handleEdit = (product: Product) => {
    setProductToEdit(product);
    setProductName(product.name);
    setProductPrice(product.price.toString());
    setProductCategory(product.category);
    setProductImagePath(product.imagePath || '');
    setIsModalOpen(true);
  };

  const handleDelete = async (id: number) => {
    try {
      await deleteProduct(id);
      await fetchProductsAndStats();
    } catch (err) {
      alert('Failed to delete product.');
    }
  };

  const openAddModal = () => {
    setProductToEdit(null);
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImagePath('');
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      if (productToEdit) {
        await updateProduct(productToEdit.id, {
          id: productToEdit.id,
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          imagePath: productImagePath
        });
      } else {
        await addProduct({
          name: productName,
          price: Number(productPrice),
          category: productCategory,
          imagePath: productImagePath
        });
      }
      await fetchProductsAndStats();
      closeModal();
    } catch (err) {
      alert('Failed to save product.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div className="loadingMessage">Loading products...</div>;
  }

  if (error) {
    return <div className="errorMessage">{error}</div>;
  }

  return (
    <div className="adminProductPage">
      <div className="productListContainer">
        <h2 className="containerTitle">Active Products</h2>
        <ul className="productList">
          {products.map((product) => (
            <li key={product.id} className="productItem">
              <div className="productInfo">
                <span className="productName">{product.name}</span>
                <span className="productPrice">${product.price.toFixed(2)}</span>
              </div>
              <div className="productActions">
                <button className="actionButton editButton" onClick={() => handleEdit(product)}>Edit</button>
                <button className="actionButton deleteButton" onClick={() => handleDelete(product.id)}>Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
      <aside className="sidebar">
        <StatCard 
          value={totalProducts.toString()}
          title="Total"
          color="#B925E4"
        />
        <div onClick={openAddModal} style={{ cursor: 'pointer' }}>
          <StatCard 
            title="Add Products"
            icon="/images/icons/addProduct.svg"
          />
        </div>
      </aside>

      {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContent" onClick={(e) => e.stopPropagation()}>
            <form className="addProductForm" onSubmit={handleSubmit}>
              <div className="formGroup">
                <input 
                  type="text" 
                  id="productName" 
                  placeholder="Product Name" 
                  value={productName} 
                  onChange={(e) => setProductName(e.target.value)}
                />
              </div>
              <div className="formGroup">
                <div className="customSelectContainer">
                  <div 
                    className={`customSelectTrigger ${productCategory ? 'hasValue' : ''}`} 
                    onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                  >
                    <span>{productCategory || 'Select Category'}</span>
                    <span className="arrowDown"></span>
                  </div>
                  {isCategoryDropdownOpen && (
                    <div className="customSelectOptions">
                      {categories.map(category => (
                        <div 
                          key={category} 
                          className={`customSelectOption ${productCategory === category ? 'selected' : ''}`}
                          onClick={() => {
                            setProductCategory(category);
                            setIsCategoryDropdownOpen(false);
                          }}
                        >
                          {category}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="formGroup inputWithoutIcon">
                <input 
                  type="number" 
                  id="price" 
                  placeholder="Price" 
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                />
              </div>
              <div className="formGroup">
                <label htmlFor="imageUpload" className="addImageLabel">
                  <span>Add Image</span>
                  <input
                    type="file"
                    id="imageUpload"
                    hidden
                    onChange={async (e) => {
                      if (e.target.files && e.target.files[0]) {
                        try {
                          const path = await uploadImage(e.target.files[0]);
                          setProductImagePath(path);
                        } catch {
                          alert('Failed to upload image');
                        }
                      }
                    }}
                  />
                  <span className="plusIcon">+</span>
                </label>
              </div>
              <button type="submit" className="actionButton editButton saveModalButton" disabled={isSubmitting} style={{marginTop: '1rem'}}>
                {isSubmitting ? 'Saving...' : (productToEdit ? 'Save Changes' : 'Add Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProductPage; 