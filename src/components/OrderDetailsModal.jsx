// OrderDetailsModal.jsx
import React from 'react';
import DeliveryMap from './DeliveryMap'; // Убедитесь, что путь к файлу правильный

const OrderDetailsModal = ({ order, cafeCoords, deliveryCoords, onClose }) => {
    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Детали заказа №{order.id}</h2>
                <p>Адрес доставки: {order.delivery_address}</p>
                <p>Курьер: {order.courier_name || 'Не назначен'}</p>
                <p>Статус: {order.status}</p>
                <DeliveryMap cafeCoords={cafeCoords} deliveryCoords={deliveryCoords} />
            </div>
        </div>
    );
};

export default OrderDetailsModal;
