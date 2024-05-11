// src/pages/Orders.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import OrderCard from "../components/OrderCard";
import "./Orders.css";

function Orders() {
    const [orders, setOrders] = useState([]);
    const [activeOrders, setActiveOrders] = useState([]);
    const [archivedOrders, setArchivedOrders] = useState([]);
    const [activeTab, setActiveTab] = useState("active");

    // Удалите статус "Готов" из списка
    const statuses = [
        "Приняли",
        "Готовится",
        "Готов",
        "Можно забрать",
        "Курьер в пути",
        "Завершен"
    ];

    useEffect(() => {
        async function fetchOrders() {
            try {
                const response = await axios.get("http://localhost:5000/api/orders");
                const sortedOrders = response.data.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
                setOrders(sortedOrders);
            } catch (error) {
                console.error("Ошибка при загрузке заказов:", error);
            }
        }
        fetchOrders();
    }, []);

    useEffect(() => {
        // Фильтруем заказы на активные и архивные
        setActiveOrders(orders.filter(order => order.status !== "Завершен"));
        setArchivedOrders(orders.filter(order => order.status === "Завершен"));
    }, [orders]);

    const handleStatusChange = async (orderId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/orders/${orderId}/status`, { status: newStatus });
            setOrders(prevOrders =>
                prevOrders.map(order =>
                    order.id === orderId ? { ...order, status: newStatus } : order
                )
            );
        } catch (error) {
            console.error("Ошибка при обновлении статуса:", error);
        }
    };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="orders-container">
            <h1>Список заказов</h1>
            <div className="tabs">
                <button className={activeTab === "active" ? "tab active" : "tab"} onClick={() => handleTabChange("active")}>
                    Активные
                </button>
                <button className={activeTab === "archived" ? "tab active" : "tab"} onClick={() => handleTabChange("archived")}>
                    Архив
                </button>
            </div>

            {activeTab === "active" ? (
                <div>
                    <h2>Активные</h2>
                    <div className="orders-grid">
                        {activeOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                statuses={statuses}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </div>
            ) : (
                <div>
                    <h2>Архив</h2>
                    <div className="orders-grid">
                        {archivedOrders.map(order => (
                            <OrderCard
                                key={order.id}
                                order={order}
                                statuses={statuses}
                                onStatusChange={handleStatusChange}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}

export default Orders;
