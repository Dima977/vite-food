// src/pages/Home.jsx
import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
    return (
        <div>
            <h1>Home</h1>
            <nav>
                <ul>
                    <li>
                        <Link to="/orders">Заказы</Link>
                    </li>
                    <li>
                        <Link to="/delivery">Доставка</Link>
                    </li>
                    <li>
                        <Link to="/management">Management</Link>
                    </li>
                    <li>
                        <Link to="/create-order">Создать заказ</Link>
                    </li>
                </ul>
            </nav>
        </div>
    );
}

export default Home;
