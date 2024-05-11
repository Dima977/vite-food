# app.py
from flask import Flask, jsonify, request
from flask_cors import CORS
from models import Order, OrderItem, MenuItem, session, Employee
import datetime

app = Flask(__name__)
CORS(app)

@app.route('/api/orders', methods=['GET'])
def get_orders():
    try:
        # Получение всех заказов с использованием SQLAlchemy-сессии
        orders = session.query(Order).all()
        
        # Формирование структуры ответа с элементами заказа
        result = []
        for order in orders:
            items = [
                {
                    "menu_item_id": item.menu_item_id,
                    "quantity": item.quantity,
                    "name": item.menu_item.name,  # Убедитесь, что связь `menu_item` определена в модели `OrderItem`
                    "image_url": item.menu_item.image_url
                }
                for item in order.items
            ]

            result.append({
                "id": order.id,
                "customer_name": order.customer_name,
                "status": order.status,
                "is_delivery": order.is_delivery,
                "delivery_address": order.delivery_address,
                "comment": order.comment,
                "created_at": order.created_at.isoformat(),
                "updated_at": order.updated_at.isoformat(),
                "items": items
            })

        return jsonify(result), 200

    except Exception as e:
        # Печать сообщения об ошибке для отладки
        print(f"Ошибка при получении заказов: {e}")
        return jsonify({"error": "Не удалось загрузить заказы"}), 500


# Обработчик для обновления статуса заказа
@app.route('/api/orders/<int:order_id>/status', methods=['PATCH'])
def update_order_status(order_id):
    try:
        data = request.json
        new_status = data.get("status")
        if not new_status:
            return jsonify({"error": "Статус должен быть задан"}), 400

        # Ищем заказ и обновляем его статус
        order = session.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({"error": "Заказ не найден"}), 404

        order.status = new_status
        order.updated_at = datetime.datetime.now()
        session.commit()

        return jsonify({"message": "Статус заказа обновлен"}), 200

    except Exception as e:
        print(f"Ошибка при обновлении статуса заказа: {e}")
        session.rollback()
        return jsonify({"error": "Не удалось обновить статус заказа"}), 500


# app.py
@app.route('/api/orders', methods=['POST'])
def create_order():
    try:
        data = request.json
        print("Полученные данные для создания заказа:", data)

        # Статус по умолчанию при создании заказа
        default_status = "Приняли"

        new_order = Order(
            status=default_status,  # Присваиваем значение по умолчанию
            customer_name=data["customer_name"],
            is_delivery=data.get("is_delivery", False),
            delivery_address=data["delivery_address"] if data.get("is_delivery") else None,
            comment=data.get("comment", ""),
            created_at=datetime.datetime.now(),
            updated_at=datetime.datetime.now()

        )
        session.add(new_order)
        session.commit()

        for item in data["items"]:
            new_order_item = OrderItem(
                order_id=new_order.id,
                menu_item_id=item["menu_item_id"],
                quantity=item["quantity"]
            )
            session.add(new_order_item)

        session.commit()
        return jsonify({"message": "Заказ успешно создан"}), 201
    except Exception as e:
        print(f"Ошибка при создании заказа: {e}")
        session.rollback()
        return jsonify({"error": "Не удалось создать заказ"}), 500


@app.route('/api/menuitems', methods=['GET'])
def get_menuitems():
    try:
        menu_items = session.query(MenuItem).all()
        return jsonify([{
            "id": item.id,
            "name": item.name,
            "description": item.description,
            "price": float(item.price),
            "image_url": item.image_url
        } for item in menu_items])
    except Exception as e:
        print(f"Error fetching menu items: {e}")
        return jsonify({"error": "Failed to fetch menu items"}), 500

@app.route('/static/<path:filename>')
def static_files(filename):
    return send_from_directory('static', filename)

@app.route('/api/new-delivery-orders', methods=['GET'])
def get_ready_delivery_orders():
    """Возвращает заказы со статусом 'Готов', отмеченные для доставки"""
    try:
        orders = session.query(Order).filter_by(status='Готов', is_delivery=True).all()
        orders_data = [{'id': order.id, 'delivery_address': order.delivery_address} for order in orders]
        return jsonify(orders_data), 200
    except Exception as e:
        print(f"Ошибка при получении заказов на доставку: {e}")
        return jsonify({'error': 'Не удалось получить заказы на доставку'}), 500


@app.route('/api/new-delivery-orders', methods=['GET'])
def get_new_delivery_orders():
    """Возвращает заказы, которые еще не находятся в доставке"""
    try:
        # Фильтруем заказы без статуса "Курьер в пути"
        orders = session.query(Order).filter(Order.status != 'Курьер в пути').all()
        result = []

        for order in orders:
            result.append({
                'id': order.id,
                'delivery_address': order.delivery_address
            })

        print(f"Найдено {len(result)} заказов для новой доставки.")
        return jsonify(result), 200

    except Exception as e:
        print(f"Ошибка при получении заказов для новой доставки: {e}")
        return jsonify({'error': 'Не удалось получить заказы на новую доставку'}), 500




@app.route('/api/couriers', methods=['GET'])
def get_couriers():
    try:
        couriers = session.query(Employee).filter_by(role='Courier', status='active').all()
        couriers_data = [{'id': courier.id, 'name': courier.name} for courier in couriers]
        return jsonify(couriers_data), 200
    except Exception as e:
        print(f"Ошибка при получении курьеров: {e}")
        return jsonify({'error': 'Не удалось получить список курьеров'}), 500


@app.route('/api/orders/<int:order_id>/assign-courier', methods=['PATCH'])
def assign_courier(order_id):
    """Назначает курьера к заказу"""
    try:
        data = request.json
        print(f"Полученные данные: {data}")

        courier_id = data.get("courierId")
        if not courier_id:
            return jsonify({"error": "Необходимо указать ID курьера"}), 400

        order = session.query(Order).filter(Order.id == order_id).first()
        if not order:
            return jsonify({"error": "Заказ не найден"}), 404

        courier = session.query(Employee).filter(Employee.id == courier_id).first()
        if not courier:
            return jsonify({"error": "Курьер не найден"}), 404

        order.courier_id = courier.id
        order.status = "Курьер в пути"
        session.commit()

        return jsonify({"message": "Курьер назначен на заказ"}), 200

    except Exception as e:
        print(f"Ошибка при назначении курьера: {e}")
        session.rollback()
        return jsonify({"error": "Не удалось назначить курьера на заказ"}), 500



@app.route('/api/delivery-orders', methods=['GET'])
def get_delivery_orders():
    """Возвращает заказы со статусом 'Курьер в пути'."""
    try:
        # Фильтруем заказы со статусом "Курьер в пути"
        orders = session.query(Order).filter(Order.status == 'Курьер в пути').all()
        result = []

        for order in orders:
            courier = session.query(Employee).filter(Employee.id == order.courier_id).first()
            courier_name = f"{courier.name} {courier.surname}" if courier else 'Не назначен'

            result.append({
                'id': order.id,
                'delivery_address': order.delivery_address,
                'courier_name': courier_name,
                'status': order.status
            })

        return jsonify(result), 200

    except Exception as e:
        print(f"Ошибка при получении заказов на доставку: {e}")
        return jsonify({'error': 'Не удалось получить заказы на доставку'}), 500



        
if __name__ == '__main__':
    app.run(debug=True, port=5000)
