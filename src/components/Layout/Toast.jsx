import { FiCheckCircle, FiAlertCircle, FiInfo, FiX } from 'react-icons/fi';

const Toast = ({ show, message, type, onClose }) => {
  if (!show) return null;

  const icons = {
    success: <FiCheckCircle />,
    error: <FiAlertCircle />,
    warning: <FiAlertCircle />,
    info: <FiInfo />
  };

  const typeClasses = {
    success: 'success',
    error: 'error',
    warning: 'warning',
    info: ''
  };

  return (
    <div className={`toast ${typeClasses[type]}`}>
      <div style={{ fontSize: '20px' }}>
        {icons[type] || <FiInfo />}
      </div>
      <div style={{ flex: 1 }}>
        {message}
      </div>
      <button className="toast-close" onClick={onClose}>
        <FiX />
      </button>
    </div>
  );
};

export default Toast;