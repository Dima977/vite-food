import React, { useState } from 'react';
import Tabs from '../components/Tabs';
import MenuManagement from '../components/MenuManagement';
import EmployeeManagement from '../components/EmployeeManagement';
import styles from './Management.module.css';

function Management() {
    const [activeTab, setActiveTab] = useState('menu');

    return (
        <div className={styles.tabsContainer}>
            <Tabs activeTab={activeTab} setActiveTab={setActiveTab} />
            {activeTab === 'menu' && <MenuManagement />}
            {activeTab === 'employees' && <EmployeeManagement />}
        </div>
    );
}

export default Management;
