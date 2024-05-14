import React, { useEffect, useRef } from 'react';
import './OrderDetailsModal.css';

const OrderDetailsModal = ({ order, cafeCoords, deliveryCoords, onClose }) => {
    const mapRef = useRef(null);

    useEffect(() => {
        if (window.ymaps && !mapRef.current) {
            window.ymaps.ready(init);
        }

        function init() {
            mapRef.current = new window.ymaps.Map("map", {
                center: cafeCoords,
                zoom: 12
            });

            const cafePlacemark = new window.ymaps.Placemark(cafeCoords, {
                hintContent: 'Кафе',
                balloonContent: 'Наше кафе'
            });

            const deliveryPlacemark = new window.ymaps.Placemark(deliveryCoords, {
                hintContent: 'Доставка',
                balloonContent: 'Адрес доставки'
            });

            const deliveryZoneCoords = [
                [58.6200, 49.6500],
                [58.6100, 49.6700],
                [58.6000, 49.6600],
                [58.5900, 49.6500],
                [58.5950, 49.6400],
                [58.6050, 49.6300],
                [58.6150, 49.6400],
                [58.6250, 49.6450]
            ];

            const deliveryZone = new window.ymaps.Polygon([deliveryZoneCoords], {}, {
                hintContent: 'Зона доставки',
                fillColor: '#DB709377',
                strokeColor: '#990066',
                strokeWidth: 3,
                opacity: 0.5
            });

            mapRef.current.geoObjects.add(cafePlacemark);
            mapRef.current.geoObjects.add(deliveryPlacemark);
            mapRef.current.geoObjects.add(deliveryZone);

            const bounds = mapRef.current.geoObjects.getBounds();
            mapRef.current.setBounds(bounds, { checkZoomRange: true }).then(function() {
                if (mapRef.current.getZoom() > 16) mapRef.current.setZoom(16);
            });
        }

        return () => {
            if (mapRef.current) {
                mapRef.current.destroy();
                mapRef.current = null;
            }
        };
    }, [cafeCoords, deliveryCoords]);

    return (
        <div className="modal">
            <div className="modal-content">
                <span className="close" onClick={onClose}>&times;</span>
                <h2>Детали заказа</h2>
                <p>Номер заказа: {order.order_number}</p>
                <p>Имя клиента: {order.customer_name}</p>
                <p>Адрес доставки: {order.delivery_address}</p>
                <div id="map" style={{ width: "100%", height: "400px" }}></div>
            </div>
        </div>
    );
};

export default OrderDetailsModal;
