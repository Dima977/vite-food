import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderCard from '../components/OrderCard'; // Используем существующий компонент
import './Delivery.css';

const cafeCoords = [58.6024, 49.6665];

function Delivery() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [deliveryCoords, setDeliveryCoords] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/delivery-orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => console.error('Ошибка при загрузке заказов:', error));
    }, []);

    const handleOrderClick = async (order) => {
        setSelectedOrder(order);
        const coords = await geocodeAddress(order.delivery_address);
        setDeliveryCoords(coords);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setDeliveryCoords(null);
    };

    return (
        <div className="container">
            <h2>Текущие заказы на доставку</h2>
            <div className="orders-container">
                {orders.map(order => (
                    <OrderCard 
                    key={order.id} 
                    order={order} 
                    showStatusChange={false} // Скрыть возможность изменения статуса
                />
                
                ))}
            </div>
            <button className="button" onClick={() => navigate('/new-delivery')}>Организовать доставку</button>
            {showModal && selectedOrder && <OrderDetailsModal key={selectedOrder.id} order={selectedOrder} cafeCoords={cafeCoords} deliveryCoords={deliveryCoords} onClose={handleCloseModal} />}
        </div>
    );
}

export default Delivery;
