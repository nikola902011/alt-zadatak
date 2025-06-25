import React, { useState, useEffect } from 'react';
import StatCard from './StatCard';
import { getDashboardStats, addProduct, uploadImage } from '../services/api';
import './AdminHomePage.css';

interface AdminHomePageProps {
  onTabChange: (tab: string, options?: any) => void;
}

const categories = ['Tablets', 'Smartphones', 'Laptops', 'Cameras', 'Gaming', 'Audio', 'Wearables', 'Accessories'];

const AdminHomePage = ({ onTabChange }: AdminHomePageProps) => {
  const [stats, setStats] = useState({ totalProducts: 0, activeUsers: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [productCategory, setProductCategory] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [productImagePath, setProductImagePath] = useState('');
  const [validationError, setValidationError] = useState('');

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const data = await getDashboardStats();
        setStats(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load dashboard stats.');
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const openAddModal = () => {
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImagePath('');
    setValidationError('');
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setProductName('');
    setProductPrice('');
    setProductCategory('');
    setProductImagePath('');
    setValidationError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError('');
    setIsSubmitting(true);
    try {
      await addProduct({
        name: productName,
        price: Number(productPrice),
        category: productCategory,
        imagePath: productImagePath
      });
      setStats(prev => ({ ...prev, totalProducts: prev.totalProducts + 1 }));
      closeModal();
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to save product.';
      if (errorMessage.includes('Validation error:')) {
        setValidationError(errorMessage);
      } else {
        alert('Failed to save product.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return <div>Loading admin dashboard...</div>;
  }

  if (error) {
    return <div className="errorMessage">{error}</div>;
  }

  return (
    <div className="adminHomePage">
      <div className="statsRow">
        <StatCard 
          value={stats.totalProducts.toString()} 
          title="Total Products" 
          color="#B925E4" 
        />
        <StatCard 
          value={stats.activeUsers.toString()} 
          title="Active Users" 
          color="#E6B433" 
        />
      </div>
      <div className="actionsSection">
        <div className="actionsHeader">Quick Actions</div>
        <div className="actionsRow">
          <StatCard 
            title="Add Products" 
            icon="/images/icons/addProduct.svg"
            onClick={openAddModal}
          />
          <StatCard 
            title="Analytics" 
            icon="/images/icons/Analytics.svg"
            onClick={() => onTabChange('analytics')}
          />
        </div>
      </div>
      {isModalOpen && (
        <div className="modalOverlay" onClick={closeModal}>
          <div className="modalContentAdmin" onClick={e => e.stopPropagation()}>
            <form className="addProductForm" onSubmit={handleSubmit}>
              <div className="formGroup">
                <input 
                  type="text" 
                  id="productName" 
                  placeholder="Product Name" 
                  value={productName} 
                  onChange={e => setProductName(e.target.value)}
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
                  onChange={e => setProductPrice(e.target.value)}
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
                {isSubmitting ? 'Saving...' : 'Add Product'}
              </button>
              {validationError && (
                <div className="validationError">
                  {validationError}
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminHomePage; 