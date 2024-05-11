// src/pages/MenuItemDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import "./MenuItemDetails.css";

function MenuItemDetails() {
    const { id } = useParams();
    const [menuItem, setMenuItem] = useState(null);

    useEffect(() => {
        // Получаем детали блюда из API по идентификатору
        async function fetchMenuItem() {
            try {
                const response = await axios.get(`http://localhost:5000/api/menuitems/${id}`);
                setMenuItem(response.data);
            } catch (error) {
                console.error("Error fetching menu item:", error);
            }
        }
        fetchMenuItem();
    }, [id]);

    if (!menuItem) {
        return <p>Loading...</p>;
    }

    return (
        <div className="menu-item-details">
            <h1>{menuItem.name}</h1>
            <img src={menuItem.image_url} alt={menuItem.name} />
            <h2>Price: ${menuItem.price.toFixed(2)}</h2>
            <p>Description: {menuItem.description}</p>
        </div>
    );
}

export default MenuItemDetails;
