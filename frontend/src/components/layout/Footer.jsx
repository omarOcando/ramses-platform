import { Link } from "react-router-dom";
import { FaInstagram, FaFacebookF, FaTiktok, FaLinkedinIn } from "react-icons/fa";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer__socials">
        <a
          href="https://www.instagram.com/ramses.beziehungscoach"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram"
        >
          <FaInstagram />
        </a>

        <a
          href="https://www.facebook.com/ramsesviloria.beziehungscoach"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Facebook"
        >
          <FaFacebookF />
        </a>

        <a
          href="https://www.tiktok.com/@ramses.beziehungscoach"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="TikTok"
        >
          <FaTiktok />
        </a>

        <a
          href="https://www.linkedin.com/in/ramsesviloria/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="LinkedIn"
        >
          <FaLinkedinIn />
        </a>
      </div>

      <div className="footer__legal">

        <Link to="/impressum">Impressum</Link>

        <span className="footer__dot">•</span>

        <Link to="/datenschutz">Datenschutz</Link>
        
      </div>

      <div className="footer__copyright">
        © Ramses Viloria {new Date().getFullYear()}
      </div>

    </footer>
  );
}

export default Footer;