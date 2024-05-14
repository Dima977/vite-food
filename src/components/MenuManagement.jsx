import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../pages/Management.module.css';

function MenuManagement() {
    const [menuItems, setMenuItems] = useState([]);
    const [newMenuItem, setNewMenuItem] = useState({ name: '', description: '', price: '', imageUrl: '' });
    const [editingMenuItem, setEditingMenuItem] = useState(null);

    useEffect(() => {
        axios.get('http://localhost:5000/api/menuitems')
            .then(response => setMenuItems(response.data))
            .catch(error => console.error('Ошибка при загрузке пунктов меню:', error));
    }, []);

    const handleMenuItemChange = (e) => {
        const { name, value } = e.target;
        setNewMenuItem(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditMenuItemChange = (e) => {
        const { name, value } = e.target;
        setEditingMenuItem(prevState => ({ ...prevState, [name]: value }));
    };

    const addMenuItem = () => {
        axios.post('http://localhost:5000/api/menuitems', newMenuItem)
            .then(response => {
                setMenuItems([...menuItems, response.data]);
                setNewMenuItem({ name: '', description: '', price: '', imageUrl: '' });
            })
            .catch(error => console.error('Ошибка при добавлении пункта меню:', error));
    };

    const editMenuItem = () => {
        axios.patch(`http://localhost:5000/api/menuitems/${editingMenuItem.id}`, editingMenuItem)
            .then(response => {
                setMenuItems(menuItems.map(item => (item.id === editingMenuItem.id ? response.data : item)));
                setEditingMenuItem(null);
            })
            .catch(error => console.error('Ошибка при редактировании пункта меню:', error));
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Редактирование меню</h2>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Название</th>
                        <th>Описание</th>
                        <th>Цена</th>
                        <th>Изображение</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {menuItems.map(item => (
                        <tr key={item.id}>
                            <td>{item.name}</td>
                            <td>{item.description}</td>
                            <td>{item.price}</td>
                            <td><img src={item.image_url} alt={item.name} width="50" /></td>
                            <td>
                                <button className={styles.button} onClick={() => setEditingMenuItem(item)}>Редактировать</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.form}>
                <h3>Добавить новый пункт меню</h3>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Название" 
                    value={newMenuItem.name} 
                    onChange={handleMenuItemChange} 
                />
                <input 
                    type="text" 
                    name="description" 
                    placeholder="Описание" 
                    value={newMenuItem.description} 
                    onChange={handleMenuItemChange} 
                />
                <input 
                    type="text" 
                    name="price" 
                    placeholder="Цена" 
                    value={newMenuItem.price} 
                    onChange={handleMenuItemChange} 
                />
                <input 
                    type="text" 
                    name="imageUrl" 
                    placeholder="URL изображения" 
                    value={newMenuItem.imageUrl} 
                    onChange={handleMenuItemChange} 
                />
                <button className={styles.button} onClick={addMenuItem}>Добавить пункт меню</button>
            </div>
            {editingMenuItem && (
                <div className={styles.form}>
                    <h3>Редактировать пункт меню</h3>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Название" 
                        value={editingMenuItem.name} 
                        onChange={handleEditMenuItemChange} 
                    />
                    <input 
                        type="text" 
                        name="description" 
                        placeholder="Описание" 
                        value={editingMenuItem.description} 
                        onChange={handleEditMenuItemChange} 
                    />
                    <input 
                        type="text" 
                        name="price" 
                        placeholder="Цена" 
                        value={editingMenuItem.price} 
                        onChange={handleEditMenuItemChange} 
                    />
                    <input 
                        type="text" 
                        name="imageUrl" 
                        placeholder="URL изображения" 
                        value={editingMenuItem.image_url} 
                        onChange={handleEditMenuItemChange} 
                    />
                    <button className={styles.button} onClick={editMenuItem}>Сохранить изменения</button>
                    <button className={styles.button} onClick={() => setEditingMenuItem(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
}

export default MenuManagement;
