import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from '../pages/Management.module.css';

function EmployeeManagement() {
    const [employees, setEmployees] = useState([]);
    const [newEmployee, setNewEmployee] = useState({ name: '', surname: '', role: '', email: '', phone: '' });
    const [editingEmployee, setEditingEmployee] = useState(null);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        axios.get('http://localhost:5000/api/employees')
            .then(response => setEmployees(response.data))
            .catch(error => console.error('Ошибка при загрузке сотрудников:', error));
    }, []);

    const handleEmployeeChange = (e) => {
        const { name, value } = e.target;
        setNewEmployee(prevState => ({ ...prevState, [name]: value }));
    };

    const handleEditEmployeeChange = (e) => {
        const { name, value } = e.target;
        setEditingEmployee(prevState => ({ ...prevState, [name]: value }));
    };

    const addEmployee = () => {
        axios.post('http://localhost:5000/api/employees', newEmployee)
            .then(response => {
                setEmployees([...employees, response.data]);
                setNewEmployee({ name: '', surname: '', role: '', email: '', phone: '' });
                setErrorMessage(''); // Сбросить сообщение об ошибке
            })
            .catch(error => {
                console.error('Ошибка при добавлении сотрудника:', error);
                setErrorMessage('Ошибка при добавлении сотрудника');
            });
    };

    const editEmployee = () => {
        axios.patch(`http://localhost:5000/api/employees/${editingEmployee.id}`, editingEmployee)
            .then(response => {
                setEmployees(employees.map(emp => (emp.id === editingEmployee.id ? response.data : emp)));
                setEditingEmployee(null);
                setErrorMessage(''); // Сбросить сообщение об ошибке
            })
            .catch(error => {
                console.error('Ошибка при редактировании сотрудника:', error);
                setErrorMessage('Ошибка при редактировании сотрудника');
            });
    };

    return (
        <div className={styles.section}>
            <h2 className={styles.sectionTitle}>Управление персоналом</h2>
            {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Имя</th>
                        <th>Фамилия</th>
                        <th>Роль</th>
                        <th>Email</th>
                        <th>Телефон</th>
                        <th>Действия</th>
                    </tr>
                </thead>
                <tbody>
                    {employees.map(employee => (
                        <tr key={employee.id}>
                            <td>{employee.name}</td>
                            <td>{employee.surname}</td>
                            <td>{employee.role}</td>
                            <td>{employee.email}</td>
                            <td>{employee.phone}</td>
                            <td>
                                <button className={styles.button} onClick={() => setEditingEmployee(employee)}>Редактировать</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className={styles.form}>
                <h3>Добавить нового сотрудника</h3>
                <input 
                    type="text" 
                    name="name" 
                    placeholder="Имя" 
                    value={newEmployee.name} 
                    onChange={handleEmployeeChange} 
                />
                <input 
                    type="text" 
                    name="surname" 
                    placeholder="Фамилия" 
                    value={newEmployee.surname} 
                    onChange={handleEmployeeChange} 
                />
                <select 
                    name="role" 
                    value={newEmployee.role} 
                    onChange={handleEmployeeChange}
                >
                    <option value="">Выберите роль</option>
                    <option value="Manager">Менеджер</option>
                    <option value="Courier">Курьер</option>
                </select>
                <input 
                    type="email" 
                    name="email" 
                    placeholder="Email" 
                    value={newEmployee.email} 
                    onChange={handleEmployeeChange} 
                />
                <input 
                    type="text" 
                    name="phone" 
                    placeholder="Телефон" 
                    value={newEmployee.phone} 
                    onChange={handleEmployeeChange} 
                />
                <button className={styles.button} onClick={addEmployee}>Добавить сотрудника</button>
            </div>
            {editingEmployee && (
                <div className={styles.form}>
                    <h3>Редактировать сотрудника</h3>
                    <input 
                        type="text" 
                        name="name" 
                        placeholder="Имя" 
                        value={editingEmployee.name} 
                        onChange={handleEditEmployeeChange} 
                    />
                    <input 
                        type="text" 
                        name="surname" 
                        placeholder="Фамилия" 
                        value={editingEmployee.surname} 
                        onChange={handleEditEmployeeChange} 
                    />
                    <select 
                        name="role" 
                        value={editingEmployee.role} 
                        onChange={handleEditEmployeeChange}
                    >
                        <option value="Manager">Менеджер</option>
                        <option value="Courier">Курьер</option>
                    </select>
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={editingEmployee.email} 
                        onChange={handleEditEmployeeChange} 
                    />
                    <input 
                        type="text" 
                        name="phone" 
                        placeholder="Телефон" 
                        value={editingEmployee.phone} 
                        onChange={handleEditEmployeeChange} 
                    />
                    <button className={styles.button} onClick={editEmployee}>Сохранить изменения</button>
                    <button className={styles.button} onClick={() => setEditingEmployee(null)}>Отмена</button>
                </div>
            )}
        </div>
    );
}

export default EmployeeManagement;
