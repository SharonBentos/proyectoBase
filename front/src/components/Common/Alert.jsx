const Alert = ({ type = 'info', children, className = '' }) => {
  return (
    <div className={`alert alert-${type} ${className}`}>
      {children}
    </div>
  );
};

export default Alert;
