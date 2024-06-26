# models.py
from sqlalchemy import Column, Text, Boolean, Integer, String, ForeignKey, DateTime, Numeric, Sequence, create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship, sessionmaker
import datetime
from sqlalchemy.dialects.postgresql import UUID
import uuid

Base = declarative_base()

# class Restaurant(Base):
#     __tablename__ = 'restaurants'
#     id = Column(Integer, primary_key=True)
#     name = Column(String(100), nullable=False)
#     address = Column(String(200))
#     phone = Column(String(20))
#     email = Column(String(100))



# models.py
class MenuItem(Base):
    __tablename__ = 'menuitems'
    id = Column(UUID(as_uuid=True), primary_key=True,  default=uuid.uuid4)
    name = Column(String(100), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 2), nullable=False)
    image_url = Column(String(255))

class Order(Base):
    __tablename__ = 'orders'
    id = Column(UUID(as_uuid=True), primary_key=True,  default=uuid.uuid4)
    customer_name = Column(String(100), nullable=False)
    is_delivery = Column(Boolean, default=False)
    delivery_address = Column(String(255), nullable=True)
    status = Column(String(20), default='in_progress')
    comment = Column(String, nullable=True)
    created_at = Column(DateTime, default=datetime.datetime.now)
    updated_at = Column(DateTime, default=datetime.datetime.now, onupdate=datetime.datetime.now)
    items = relationship('OrderItem', back_populates='order')
    courier_id = Column(Integer, ForeignKey('employees.id'), nullable=True)  # Ссылка на курьера
    courier = relationship("Employee") 
    order_number = Column(Integer, Sequence('order_number_seq'), unique=True, nullable=False)


class OrderItem(Base):
    __tablename__ = 'orderitems'
    id = Column(UUID(as_uuid=True), primary_key=True,  default=uuid.uuid4)
    order_id = Column(UUID(as_uuid=True), ForeignKey('orders.id', ondelete='CASCADE'))
    menu_item_id = Column(UUID(as_uuid=True), ForeignKey('menuitems.id'))
    quantity = Column(Integer, nullable=False)
    menu_item = relationship("MenuItem", backref="order_items")
    order = relationship('Order', back_populates='items')  

# models.py
class User(Base):
    __tablename__ = 'users'
    id = Column(Integer, primary_key=True, autoincrement=True)
    username = Column(String(50), nullable=False)
    password = Column(String(100), nullable=False)
    role = Column(String(20))
    email = Column(String(100))
    phone = Column(String(20))

class Employee(Base):
    __tablename__ = 'employees'

    id = Column(Integer, primary_key=True)
    name = Column(String(100), nullable=False)
    surname = Column(String(100), nullable=False)
    patronymic = Column(String(100), nullable=True)
    role = Column(String(50), nullable=False)  # Например, "Courier", "Manager"
    email = Column(String(100), unique=True, nullable=False)
    phone = Column(String(20), nullable=False)
    status = Column(String(20), default="active")

# Подключение к базе данных PostgreSQL
DATABASE_URL = "postgresql://postgres:123456789@localhost:5433/cafe"
engine = create_engine(DATABASE_URL)

# Создание сессии
Session = sessionmaker(bind=engine)
session = Session()

# Создаем все таблицы
Base.metadata.create_all(engine)
