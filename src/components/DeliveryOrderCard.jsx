// src/components/DeliveryOrderCard.jsx
import React from 'react';

function DeliveryOrderCard({ order, onStatusChange }) {
    return (
        <div className="delivery-order-card">
            <h3>{order.name}</h3>
            <p>Количество: {order.quantity}</p>
            <p>Цена: {order.price}</p>
            <p>Статус: {order.status}</p>
            <button onClick={() => onStatusChange(order.id, 'nextStatus')}>
                Изменить статус
            </button>
        </div>
    );
}

export default DeliveryOrderCard;
