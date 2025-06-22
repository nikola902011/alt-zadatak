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
    // Gradimo punu URL putanju do slike na backend-u
    const imageUrl = product.imagePath 
        ? `${API_BASE_URL}${product.imagePath}` 
        : 'https://via.placeholder.com/300';

    return (
        <div className="productCard">
            <div className="productImageContainer">
                <img src={imageUrl} alt={product.name} className="productImage" />
            </div>
            <div className="productInfo">
                {product.name} <br></br>
                ${product.price.toFixed(2)}
            </div>
        </div>
    );
};

export default ProductCard; 