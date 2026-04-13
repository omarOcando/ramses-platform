import { useNavigate } from "react-router-dom";
import logoDesktop from "../assets/images/LogoRamses.png";
import logoMobile from "../assets/images/LogoRamsesSmall.png";
import bg1Home from "../assets/images/home/BG1-Home.png";
import bg2Home from "../assets/images/home/BG2-Home.jpg";
import Button from "../components/Button";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="home">
      
      {/* SECTION 1 - Hero */}

      <section className="home__hero">
        <div className="home__hero-content">
          <div className="home__logo">
            <img className="logo-desktop" src={logoDesktop} alt="Ramsés Logo" />
            <img className="logo-mobile" src={logoMobile} alt="Ramsés Logo" />
          </div>

          <h1 className="home__title">
            Love relationships are extraordinary.
            <br />
            Live yours!
          </h1>

          <p className="home__subtitle">
            Book your private session and start improving your relationship
            today.
          </p>

          <Button
            className="home__ctaBtn"
            variant="primary"
            onClick={() => navigate("/dashboard")}
          >
            Start here
          </Button>
        </div>

        <div className="home__hero-image">
          <img src={bg1Home} alt="Relationship coach Ramsés Viloria" />
        </div>
      </section>

      <section className="home__section2">
        <div className="home__section2-image">
          <img src={bg2Home} alt="Coach with his partner" />
        </div>

        {/* SECTION 2 */}

        <div className="home__section2-text">
          <h2 className="home__section2-title">
            I help singles and couples develop and maintain an extraordinary loving relationship.<br /><br />
          </h2>

          <p className="home__section2-subtitle">
            An extraordinary relationship is one in which you feel completely
            fulfilled. Love and passion are your everyday experiences.
            <br /><br />
            Personalized high-level 1:1 coaching for those who want stable,
            mature, and lasting relationships.
          </p>

          <Button
            variant="primary"
            onClick={() => navigate("/dashboard")}
          >
            Book your free private appointment now
          </Button>
        </div>
      </section>
    </div>
  );
}

export default Home;