import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { YMaps, Map, Placemark } from 'react-yandex-maps';
import './Delivery.css';

const cafeCoords = [58.6024, 49.6665]; // Предполагаем, что координаты верные

function Delivery() {
    const [orders, setOrders] = useState([]);
    const [selectedOrder, setSelectedOrder] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get('http://localhost:5000/api/delivery-orders')
            .then(response => {
                setOrders(response.data);
            })
            .catch(error => console.error('Ошибка при загрузке заказов на доставку:', error));
    }, []);

    const handleOrderClick = order => {
        setSelectedOrder(order);
    };

    const handleNewDeliveryClick = () => {
        navigate('/new-delivery');
    };

    return (
        <div className="container">
            <h2>Текущие заказы на доставку</h2>
            <button className="button" onClick={handleNewDeliveryClick}>Организовать доставку</button>
            <div className="row">
                {orders.map(order => (
                    <div key={order.id} className="card" onClick={() => handleOrderClick(order)}>
                        <div className="card-body">
                            <h4 className="card-title">Заказ №{order.id}</h4>
                            <p className="card-text">Адрес доставки: {order.delivery_address}</p>
                            <p className="card-text">Курьер: {order.courier_name || 'Не назначен'}</p>
                            <p className="card-text">Статус: {order.status}</p>
                        </div>
                    </div>
                ))}
            </div>
            {selectedOrder && (
                <YMaps query={{ apikey: '994228ab-8801-4087-9652-80b12e558a2d' }}>
                    <Map defaultState={{ center: cafeCoords, zoom: 10 }} width="100%" height="400px">
                        <Placemark geometry={cafeCoords} />
                        {selectedOrder.delivery_coords && (
                            <Placemark geometry={selectedOrder.delivery_coords} /> 
                        )}
                    </Map>
                </YMaps>
            )}
        </div>
    );
}

export default Delivery;
