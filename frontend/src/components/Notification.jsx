function Notification({ notifications }) {
  if (notifications.length === 0) return null;

  return (
    <div className="notifications">
      {notifications.map((n) => (
        <div key={n.id} className={`notification notification--${n.type}`}>
          {n.message}
        </div>
      ))}
    </div>
  );
}

export default Notification;