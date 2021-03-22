import React from 'react';
import styles from './Advantages.module.css'
import busIcon from '../../images/bus-icon-min.png'
import scheduleIcon from '../../images/schedule-icon-min.png'
import timeIcon from '../../images/time-icon-min.png'
import wifiIcon from '../../images/wifi-icon-min.png'
import servicesIcon from '../../images/services-icon-min.png'
import teaIcon from '../../images/tea-icon-min.png'

const Advantages = () => {
    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Чому варто подорожувати з нами?</h2>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <div className={styles.imgBox}><img src={busIcon} alt='автобусні маршрути'></img></div><p>Комфортабельні автобуси</p>
                </li>
                <li className={styles.listItem}>
                    <div className={styles.imgBox}><img src={scheduleIcon} alt='розклад автобусів'></img></div><p>Найкращий розклад</p>
                </li>
                <li className={styles.listItem}>
                    <div className={styles.imgBox}><img src={timeIcon} alt='маршрути автобусів'></img></div><p>Найкоротший час в дорозі</p>
                </li>
                <li className={styles.listItem}>
                    <div className={styles.imgBox}><img src={teaIcon} alt='чай кава в автобусі'></img></div><p>Чай та кава в дорозі</p>
                </li>
                <li className={styles.listItem}>
                    <div className={styles.imgBox}><img src={wifiIcon} alt='wifi в автобусі'></img></div><p>WiFi</p>
                </li>
                <li className={styles.listItem}>
                    <div className={styles.imgBox}><img src={servicesIcon} alt='сервіс в автобусі'></img></div><p>Сервіс (стюардеса)</p>
                </li>
            </ul>
        </div>
    );
};

export default Advantages;