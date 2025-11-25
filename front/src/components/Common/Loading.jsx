const Loading = ({ message = "Cargando..." }) => {
  return (
    <div className="loading-container">
      <div className="loading-spinner">{message}</div>
    </div>
  );
};

export default Loading;
