// src/components/MapWithRoute.jsx
import React, { useEffect, useRef } from "react";

function MapWithRoute({ restaurantAddress, deliveryAddress }) {
    const mapRef = useRef(null);
    const apiKey = "994228ab-8801-4087-9652-80b12e558a2d";

    useEffect(() => {
        // Подключаем скрипт Яндекс.Карт
        const script = document.createElement("script");
        script.src = `https://api-maps.yandex.ru/2.1/?apikey=${apiKey}&lang=ru_RU`;
        script.async = true;
        document.head.appendChild(script);

        script.onload = () => {
            // Инициализация Яндекс.Карт
            window.ymaps.ready(initMap);
        };

        const initMap = () => {
            const map = new window.ymaps.Map(mapRef.current, {
                center: [59.9342802, 30.3350986], // Центрируем на Санкт-Петербург
                zoom: 10
            });

            // Задаем маршруты от ресторана к адресу доставки
            const multiRoute = new window.ymaps.multiRouter.MultiRoute(
                {
                    referencePoints: [restaurantAddress, deliveryAddress]
                },
                {
                    boundsAutoApply: true // Автоматически подгоняем карту под маршрут
                }
            );

            map.geoObjects.add(multiRoute);
        };

        return () => {
            // Убираем скрипт при удалении компонента
            document.head.removeChild(script);
        };
    }, [restaurantAddress, deliveryAddress]);

    return <div ref={mapRef} style={{ width: "100%", height: "400px" }} />;
}

export default MapWithRoute;
