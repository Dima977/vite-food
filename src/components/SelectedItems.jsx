// src/components/SelectedItems.jsx
import React from "react";
import "./SelectedItems.css";

function SelectedItems({ items, onRemoveItem }) {
    return (
        <div>
            <h2>Выбранные блюда</h2>
            <div className="selected-items">
                {items.map((item, index) => (
                    <div className="item-card" key={index}>
                        <h4>{item.name}</h4>
                        <p>Количество: {item.quantity}</p>
                        <button className="remove-btn" onClick={() => onRemoveItem(index)}>Убрать</button>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default SelectedItems;
