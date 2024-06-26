import React, { useEffect, useState } from "react";
import axios from "axios";
import ItemCard from "../components/ItemCard";
import SelectedItems from "../components/SelectedItems";
import "./CreateOrder.css";

const cafeCoords = [58.6024, 49.6665];
const deliveryRadius = 5000; // 5 км

function CreateOrder() {
    const [order, setOrder] = useState({
        customer_name: "",
        is_delivery: false,
        delivery_address: "",
        comment: "",
        items: []
    });
    const [menuItems, setMenuItems] = useState([]);
    const [suggestedAddresses, setSuggestedAddresses] = useState([]);

    useEffect(() => {
        async function fetchMenuItems() {
            try {
                const response = await axios.get("http://localhost:5000/api/menuitems");
                setMenuItems(response.data);
            } catch (error) {
                console.error("Ошибка при загрузке пунктов меню:", error);
            }
        }
        fetchMenuItems();
    }, []);

    const handleChange = (event) => {
        const { name, value, type, checked } = event.target;
        setOrder((prevOrder) => ({
            ...prevOrder,
            [name]: type === "checkbox" ? checked : value
        }));
    };

    const handleItemToggle = (menuItemId) => {
        setOrder((prevOrder) => {
            const existingItem = prevOrder.items.find((item) => item.menu_item_id === menuItemId);

            if (existingItem) {
                return {
                    ...prevOrder,
                    items: prevOrder.items.map((item) =>
                        item.menu_item_id === menuItemId ? { ...item, quantity: item.quantity + 1 } : item
                    )
                };
            } else {
                const menuItem = menuItems.find((item) => item.id === menuItemId);
                return {
                    ...prevOrder,
                    items: [...prevOrder.items, { menu_item_id: menuItemId, name: menuItem.name, image_url: menuItem.image_url, quantity: 1 }]
                };
            }
        });
    };

    const handleAddressChange = async (event) => {
        const { value } = event.target;
        setOrder((prevOrder) => ({ ...prevOrder, delivery_address: value }));

        if (value.length > 2) {
            try {
                const response = await axios.post(
                    "https://suggestions.dadata.ru/suggestions/api/4_1/rs/suggest/address",
                    { query: value },
                    {
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Token f67c2e9f0f8311fd45a72687767b9b22eca31a70"
                        }
                    }
                );

                const filteredSuggestions = await Promise.all(
                    response.data.suggestions.map(async (suggestion) => {
                        const coords = await geocodeAddress(suggestion.value);
                        return { suggestion: suggestion.value, coords };
                    })
                );

                const validSuggestions = filteredSuggestions.filter(({ coords }) =>
                    isWithinDeliveryZone(coords)
                );

                setSuggestedAddresses(validSuggestions.map(({ suggestion }) => suggestion));
            } catch (error) {
                console.error("Ошибка при загрузке подсказок адреса:", error);
            }
        } else {
            setSuggestedAddresses([]);
        }
    };

    const handleAddressSelect = (address) => {
        setOrder((prevOrder) => ({ ...prevOrder, delivery_address: address }));
        setSuggestedAddresses([]);
    };

    const handleRemoveItem = (index) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            items: prevOrder.items.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const orderData = {
                customer_name: order.customer_name,
                is_delivery: order.is_delivery,
                delivery_address: order.is_delivery ? order.delivery_address : null,
                comment: order.comment,
                items: order.items.map(({ menu_item_id, quantity }) => ({ menu_item_id, quantity }))
            };

            await axios.post("http://localhost:5000/api/orders", orderData);
            alert("Заказ успешно создан!");

            setOrder({
                customer_name: "",
                is_delivery: false,
                delivery_address: "",
                comment: "",
                items: []
            });
        } catch (error) {
            console.error("Ошибка при создании заказа:", error);
        }
    };

    const geocodeAddress = async (address) => {
        try {
            const response = await axios.get('https://geocode-maps.yandex.ru/1.x/', {
                params: {
                    geocode: address,
                    format: 'json',
                    apikey: '994228ab-8801-4087-9652-80b12e558a2d' // Используем ваш API ключ
                }
            });

            const coords = response.data.response.GeoObjectCollection.featureMember[0].GeoObject.Point.pos.split(' ');
            return [parseFloat(coords[1]), parseFloat(coords[0])]; // Возвращаем координаты в правильном формате
        } catch (error) {
            console.error('Ошибка при геокодировании адреса:', error);
            return null;
        }
    };

    const isWithinDeliveryZone = (coords) => {
        if (!coords) return false;

        const [lat, lon] = coords;
        const R = 6371e3; // Радиус Земли в метрах
        const φ1 = cafeCoords[0] * Math.PI / 180;
        const φ2 = lat * Math.PI / 180;
        const Δφ = (lat - cafeCoords[0]) * Math.PI / 180;
        const Δλ = (lon - cafeCoords[1]) * Math.PI / 180;

        const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c; // Расстояние в метрах

        return distance <= deliveryRadius;
    };

    return (
        <div className="container">
            <h1>Создать новый заказ</h1>
            <form onSubmit={handleSubmit}>
                <label>
                    Имя клиента:
                    <input
                        type="text"
                        name="customer_name"
                        value={order.customer_name}
                        onChange={handleChange}
                        required
                    />
                </label>
                <label>
                    Доставка:
                    <input
                        type="checkbox"
                        name="is_delivery"
                        checked={order.is_delivery}
                        onChange={handleChange}
                    />
                </label>
                {order.is_delivery && (
                    <label>
                        Адрес доставки:
                        <input
                            type="text"
                            name="delivery_address"
                            value={order.delivery_address}
                            onChange={handleAddressChange}
                            required
                        />
                        <ul className="address-suggestions">
                            {suggestedAddresses.map((addr, index) => (
                                <li key={index} onClick={() => handleAddressSelect(addr)}>
                                    {addr}
                                </li>
                            ))}
                        </ul>
                    </label>
                )}
                <label>
                    Комментарий:
                    <textarea
                        name="comment"
                        value={order.comment}
                        onChange={handleChange}
                    />
                </label>
                <SelectedItems items={order.items} onRemoveItem={handleRemoveItem} />
                <button type="submit">Создать заказ</button>
            </form>

            <h2>Выбрать блюда из меню</h2>
            <div className="menu-items">
                {menuItems.map((item) => (
                    <div key={item.id} onClick={() => handleItemToggle(item.id)}>
                        <ItemCard name={item.name} image_url={item.image_url} quantity={1} />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default CreateOrder;
