// src/pages/Management.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Management.css"; // Подключи файл стилей для оформления

function Management() {
    // Пример ресурсов для управления
    const resources = [
        { id: 1, type: "Menu", description: "Update menu items, prices, and availability." },
        { id: 2, type: "Staff", description: "Manage staff schedules, roles, and contact information." },
        { id: 3, type: "Inventory", description: "Track inventory levels and supply needs." },
    ];

    return (
        <div className="container">
            <h1>Restaurant Management</h1>
            <Link to="/">Back to Home</Link>
            <ul>
                {resources.map(resource => (
                    <li key={resource.id}>
                        <h3>{resource.type}</h3>
                        <p>{resource.description}</p>
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default Management;
