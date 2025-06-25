import React from 'react';
import './ProductCard.css';
import { API_BASE_URL } from '../services/api';

interface Product {
    id: number;
    name: string;
    price: number;
    imagePath?: string;
}

interface ProductCardProps {
    product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
    return (
        <div className="productCard">
            <div className="productImageContainer">
                {product.imagePath ? (
                    <img 
                        src={`${API_BASE_URL}/${product.imagePath}`} 
                        alt={product.name} 
                        className="productImage" 
                    />
                ) : (
                    <div className="noImagePlaceholder">
                        <span>No Image</span>
                    </div>
                )}
            </div>
            <div className="productInfoCustomer">
                {product.name} <br></br>
                ${product.price.toFixed(2)}
            </div>
        </div>
    );
};

export default ProductCard; 