import React from 'react';
import styles from './Tabs.module.css';

function Tabs({ activeTab, setActiveTab }) {
    return (
        <div className={styles.tabs}>
            <button className={activeTab === 'menu' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('menu')}>Редактирование меню</button>
            <button className={activeTab === 'employees' ? styles.activeTab : styles.tab} onClick={() => setActiveTab('employees')}>Управление персоналом</button>
        </div>
    );
}

export default Tabs;
