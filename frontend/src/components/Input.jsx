function Input({ label, type = "text", name, value, onChange, placeholder, required, min, maxLength }) {
  return (
    <div className="input">
      {label && <label className="input__label">{label}</label>}
      <input
        className="input__field"
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        min={min}
        maxLength={maxLength}
      />
    </div>
  );
}

export default Input;