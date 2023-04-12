import { useEffect } from 'react';
import style from './styles/Notify.module.css';
const Notify = ({ notification, setShowNotification }) => {
    useEffect(() => {
        const timeout = setTimeout(() => {
            setShowNotification(false);
        }, 5000);
        return () => clearTimeout(timeout);
    }, [setShowNotification]);

    return (
        <div className={notification.type === 'error' ? style.notifyContainerError : style.notifyContainerSuccess}>
            <h3>{notification.message}</h3>
        </div>
    );
};

export default Notify;
