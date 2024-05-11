// src/components/ItemCard.jsx
import React from "react";
import "./ItemCard.css";

function ItemCard({ name, image_url, quantity }) {
    return (
        <div className="item-card">
            {image_url ? (
                <img src={image_url} alt={`Изображение ${name}`} className="item-image" />
            ) : (
                <div className="image-placeholder">Нет изображения</div>
            )}
            <h4>{name}</h4>
            <p>Количество: {quantity}</p>
        </div>
    );
}

export default ItemCard;
