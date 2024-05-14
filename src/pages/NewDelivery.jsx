import React, { useState, useEffect } from 'react';
import axios from 'axios';

function NewDelivery() {
    const [couriers, setCouriers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [selectedCourier, setSelectedCourier] = useState(null);
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        // Загружаем список курьеров
        axios.get('http://localhost:5000/api/couriers')
            .then((response) => setCouriers(response.data))
            .catch((error) => console.error('Ошибка при загрузке списка курьеров:', error));

        // Загружаем заказы, которые еще не в статусе "Курьер в пути"
        axios.get('http://localhost:5000/api/new-delivery-orders')
            .then((response) => setOrders(response.data))
            .catch((error) => console.error('Ошибка при загрузке заказов на новую доставку:', error));
    }, []);

    // Назначить курьера на выбранный заказ
    const assignCourierToOrder = () => {
        if (!selectedOrder || !selectedCourier) {
            alert('Выберите заказ и курьера');
            return;
        }

        axios.patch(`http://localhost:5000/api/orders/${selectedOrder}/assign-courier`, {
            courierId: selectedCourier
        })
        .then(() => {
            alert('Курьер успешно назначен на заказ');
            // Обновить список заказов
            setOrders(orders.filter(order => order.id !== selectedOrder));
            setSelectedOrder(null);
        })
        .catch((error) => {
            console.error('Ошибка при назначении курьера к заказу:', error);
            alert('Ошибка при назначении курьера к заказу');
        });
    };

    // Выбор заказа
    const selectOrder = (orderId) => {
        setSelectedOrder(orderId);
    };

    // Выбор курьера
    const selectCourier = (event) => {
        setSelectedCourier(event.target.value);
    };

    return (
        <div>
            <h2>Организация новой доставки</h2>
            <h3>Выберите заказ:</h3>
            <div className="orders-list">
                {orders.map(order => (
                    <div
                        key={order.id}
                        className={`order-card ${order.id === selectedOrder ? 'selected' : ''}`}
                        onClick={() => selectOrder(order.id)}
                    >
                        <h4>Заказ №{order.order_number}</h4> {/* Изменено отображение номера заказа */}
                        <p>Адрес доставки: {order.delivery_address}</p>
                    </div>
                ))}
            </div>

            <label>Выберите курьера:</label>
            <select onChange={selectCourier}>
                <option value="">Выберите курьера</option>
                {couriers.map(courier => (
                    <option key={courier.id} value={courier.id}>
                        {courier.name}
                    </option>
                ))}
            </select>

            <button onClick={assignCourierToOrder}>Организовать доставку</button>
        </div>
    );
}

export default NewDelivery;
