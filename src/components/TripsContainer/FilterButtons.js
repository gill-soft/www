import React from 'react';
import styles from './FilterButtons.module.css'

const FilterButtons = () => {
    return (
        <div className={styles.filterButtons}>
            <button type="button" >Время отправления</button>
            <button type="button" >Время в пути</button>
            <button type="button" >Время прибытия</button>
            <button type="button" >Стоимость</button>
        </div>
    );
};

export default FilterButtons;