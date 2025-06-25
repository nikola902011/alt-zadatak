import { useState, useEffect } from 'react';
import ProductCard from './ProductCard';
import './ProductList.css';
import { getProducts } from '../services/api';
import type { Product } from '../services/api';

const ProductList = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const fetchedProducts = await getProducts();
        setProducts(fetchedProducts);
      } catch (err) {
        setError('Failed to fetch products.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return <div className="loadingMessage">Loading products...</div>;
  }

  if (error) {
    return <div className="errorMessage">{error}</div>;
  }

  return (
    <div className="productListCustomer">
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
};

export default ProductList; 