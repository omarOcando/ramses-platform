import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";
import Button from "../../components/Button";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="header">
      <div className="header__container">
        
        <Button
          variant="secondary"
          className="header__burger"
          onClick={() => setMenuOpen(!menuOpen)}
        >
          ☰
        </Button>

        <nav className={`header__nav ${menuOpen ? "active" : ""}`}>
          <NavLink to="/" className="header__link" onClick={closeMenu}>Home</NavLink>
          <NavLink to="/my-story" className="header__link" onClick={closeMenu}>My story</NavLink>
          <NavLink to="/do-you-feel-this" className="header__link" onClick={closeMenu}>Do you feel this?</NavLink>
          <NavLink to="/the-way-to-transformation" className="header__link" onClick={closeMenu}>The way to transformation</NavLink>
          <NavLink to="/what-couples-say" className="header__link" onClick={closeMenu}>What couples say</NavLink>
          <NavLink to="/take-the-first-step" className="header__link" onClick={closeMenu}>Take the first step</NavLink>

          {!user ? (
            <Button
              variant="primary"
              onClick={() => {
                navigate("/login");
                closeMenu();
              }}
            >
              Login
            </Button>
          ) : (
            <>
              <NavLink to="/inside-the-room" className="header__link" onClick={closeMenu}>Inside the room</NavLink>
              <NavLink to="/dashboard" className="header__link" onClick={closeMenu}>Dashboard</NavLink>
              <NavLink to="/my-appointments" className="header__link" onClick={closeMenu}>My Appointments</NavLink>

              <Button
                variant="primary"
                onClick={handleLogout}
              >
                Logout
              </Button>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}

export default Header;