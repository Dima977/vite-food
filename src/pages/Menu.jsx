// src/pages/Menu.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import "./Menu.css";

function Menu() {
    const [menuItems, setMenuItems] = useState([]);

    useEffect(() => {
        // Получаем пункты меню из API
        async function fetchMenuItems() {
            try {
                const response = await axios.get("http://localhost:5000/api/menuitems");
                setMenuItems(response.data);
            } catch (error) {
                console.error("Error fetching menu items:", error);
            }
        }
        fetchMenuItems();
    }, []);

    return (
        <div className="menu-container">
            <h1>Menu</h1>
            <div className="menu-items">
                {menuItems.map((item) => (
                    <div key={item.id} className="menu-item">
                        <Link to={`/menu/${item.id}`}>
                            <img src={item.image_url} alt={item.name} />
                            <h3>{item.name}</h3>
                            <p>${item.price.toFixed(2)}</p>
                        </Link>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Menu;
