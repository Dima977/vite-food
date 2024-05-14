// src/components/OrderCard.jsx
import React from "react";
import ItemCard from "./ItemCard";
import "./OrderCard.css";

function OrderCard({ order, showStatusChange = false, onStatusChange }) {
    return (
        <div className="order-card">
            <h3>Номер заказа: {order.order_number}</h3>
            <p>Имя клиента: {order.customer_name || "Имя клиента не указано"}</p>
            <p>Дата создания: {order.created_at ? new Date(order.created_at).toLocaleString() : "Дата не указана"}</p>
            <p>{order.is_delivery ? "Заказ на доставку" : "Заказ без доставки"}</p>
            {order.is_delivery && <p>Адрес доставки: {order.delivery_address}</p>}
            {order.courier_name && <p>Курьер: {order.courier_name}</p>}
            <p>Статус: {order.status}</p>
            {showStatusChange && (
                <label>
                    Статус:
                    <select value={order.status} onChange={(e) => onStatusChange(order.id, e.target.value)}>
                        {order.statuses.map((status, index) => (
                            <option key={index} value={status}>{status}</option>
                        ))}
                    </select>
                </label>
            )}
            <h4>Состав заказа:</h4>
            <div className="items-grid">
                {order.items && order.items.length > 0 ? (
                    order.items.map((item, index) => (
                        <ItemCard
                            key={index}
                            name={item.name}
                            image_url={item.image_url}
                            quantity={item.quantity}
                        />
                    ))
                ) : (
                    <p>Нет товаров в заказе</p>
                )}
            </div>
        </div>
    );
}

export default OrderCard;
