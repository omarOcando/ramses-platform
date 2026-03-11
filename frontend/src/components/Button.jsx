import "../styles/components/_button.scss";

function Button({
  children,
  variant = "primary",
  onClick,
  className = "",
  type = "button",
  disabled = false
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      className={`button button--${variant} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

export default Button;