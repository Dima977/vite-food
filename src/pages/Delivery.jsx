// src/pages/Delivery.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderCard from '../components/OrderCard';
import './Delivery.module.css';

// Обновленные координаты кафе
const cafeCoords = [58.5900, 49.6700];

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

    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
                params: {
                    geocode: address,
                    format: 'json',
                    apikey: '994228ab-8801-4087-9652-80b12e558a2d'
                }
            });

            const coords = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
            return [parseFloat(coords[1]), parseFloat(coords[0])];
        } catch (error) {
            console.error('Ошибка при геокодировании адреса:', error);
            return null;
        }
    };

    const handleOrderClick = async (order) => {
        const coords = await geocodeAddress(order.delivery_address);
        if (coords) {
            setSelectedOrder(order);
            setDeliveryCoords(coords);
            setShowModal(true);
        } else {
            console.error('Не удалось получить координаты для адреса доставки.');
        }
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedOrder(null);
        setDeliveryCoords(null);
    };

    return (
        <div className="delivery-container">
            <h2>Текущие заказы на доставку</h2>
            <div className="orders-container">
                {orders.map(order => (
                    <div key={order.id} className="order-card-wrapper" onClick={() => handleOrderClick(order)}>
                        <OrderCard 
                            order={order} 
                            showStatusChange={false} 
                        />
                    </div>
                ))}
            </div>
            <button className="button" onClick={() => navigate('/new-delivery')}>Организовать доставку</button>
            {showModal && selectedOrder && 
                <OrderDetailsModal 
                    key={selectedOrder.id} 
                    order={selectedOrder} 
                    cafeCoords={cafeCoords} 
                    deliveryCoords={deliveryCoords} 
                    onClose={handleCloseModal} 
                />
            }
        </div>
    );
}

export default Delivery;
