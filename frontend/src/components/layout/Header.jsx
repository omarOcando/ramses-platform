import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useEffect, useState } from "react";
import Button from "../../components/Button";

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  const closeMenu = () => setMenuOpen(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40);
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header className={`header ${scrolled ? "header--scrolled" : ""}`}>
      <div className="header__container">
        <div className="header__shape">
          <Button
            variant="secondary"
            className="header__burger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </Button>

          <nav className={`header__nav ${menuOpen ? "active" : ""}`}>
            <NavLink to="/" className="header__link" onClick={closeMenu}>
              Home
            </NavLink>

            <NavLink
              to="/my-story"
              className="header__link"
              onClick={closeMenu}
            >
              My story
            </NavLink>

            <NavLink
              to="/do-you-feel-this"
              className="header__link"
              onClick={closeMenu}
            >
              Do you feel this?
            </NavLink>

            <NavLink
              to="/the-way-to-transformation"
              className="header__link"
              onClick={closeMenu}
            >
              The way to transformation
            </NavLink>

            {/* <NavLink
              to="/what-couples-say"
              className="header__link"
              onClick={closeMenu}
            >
              What clients say
            </NavLink> */}

            <NavLink
              to="/take-the-first-step"
              className="header__link"
              onClick={closeMenu}
            >
              Take the first step
            </NavLink>

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
                <span className="header__separator">|</span>

                {/* <NavLink
                  to="/inside-the-room"
                  className="header__link"
                  onClick={closeMenu}
                >
                  Inside the room
                </NavLink> */}

                {user?.user?.role === "admin" ? (
                  <>
                    <NavLink
                      to="/admin/appointments"
                      className="header__link"
                      onClick={closeMenu}
                    >
                      Appointments
                    </NavLink>

                    <NavLink
                      to="/admin/availability"
                      className="header__link"
                      onClick={closeMenu}
                    >
                      Availability
                    </NavLink>

                    <NavLink
                      to="/admin/revenue"
                      className="header__link"
                      onClick={closeMenu}
                    >
                      Revenue
                    </NavLink>

                    <NavLink
                      to="/admin/users"
                      className="header__link"
                      onClick={closeMenu}
                    >
                      Users
                    </NavLink>
                  </>
                ) : (
                  <>
                    <NavLink
                      to="/dashboard"
                      className="header__link"
                      onClick={closeMenu}
                    >
                      Dashboard
                    </NavLink>

                    <NavLink
                      to="/my-appointments"
                      className="header__link"
                      onClick={closeMenu}
                    >
                      My appointments
                    </NavLink>
                  </>
                )}

                <Button variant="primary" onClick={handleLogout}>
                  Logout
                </Button>

                <span className="header__user">
                  Hi, {user?.user?.name?.split(" ")[0]}
                </span>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}

export default Header;