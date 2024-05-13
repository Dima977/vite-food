// DeliveryMap.jsx
import React from 'react';
import { YMaps, Map, Placemark } from 'react-yandex-maps';

const DeliveryMap = ({ cafeCoords, deliveryCoords }) => {
    return (
        <YMaps>
            <Map defaultState={{ center: cafeCoords, zoom: 10 }} width="100%" height="400px">
                <Placemark geometry={cafeCoords} />
                {deliveryCoords && <Placemark geometry={deliveryCoords} />}
            </Map>
        </YMaps>
    );
};


export default DeliveryMap;
