// src/components/OrderCard.jsx
import React from "react";
import ItemCard from "./ItemCard";
import "./OrderCard.css";

function OrderCard({ order, statuses, onStatusChange }) {
    const handleStatusChange = (event) => {
        const newStatus = event.target.value;
        onStatusChange(order.id, newStatus);
    };

    return (
        <div className="order-card">
            <h3>Номер заказа: {order.id}</h3>
            <p>Имя клиента: {order.customer_name}</p>
            <p>Дата создания: {new Date(order.created_at).toLocaleString()}</p>

            {/* Отображаем статус доставки */}
            <p>{order.is_delivery ? "Заказ на доставку" : "Заказ без доставки"}</p>

            {/* Если заказ на доставку, отображаем адрес */}
            {order.is_delivery && <p>Адрес доставки: {order.delivery_address}</p>}

            <label>
                Статус:
                <select value={order.status} onChange={handleStatusChange}>
                    {statuses.map((status, index) => (
                        <option key={index} value={status}>{status}</option>
                    ))}
                </select>
            </label>

            <h4>Состав заказа:</h4>
            <div className="items-grid">
                {order.items.map((item, index) => (
                    <ItemCard
                        key={index}
                        name={item.name}
                        image_url={item.image_url}
                        quantity={item.quantity}
                    />
                ))}
            </div>
        </div>
    );
}

export default OrderCard;
