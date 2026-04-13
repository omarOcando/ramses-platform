import { useNavigate } from "react-router-dom";
import Button from "../components/Button";
import bg1MyStory from "../assets/images/myStory/BG1-MyStory.jpg";
import bg2MyStory from "../assets/images/myStory/BG2-MyStory.jpg";

function MyStory() {
  const navigate = useNavigate();
  return (
    <div className="myStory">
      <section className="myStory__hero">
        <div className="myStory__hero-image">
          <img src={bg1MyStory} alt="Ramsés Viloria" />
        </div>

        <div className="myStory__hero-content">
          <h1 className="myStory__hero-title">
            Before I knew how to help, I had to learn the hard way how to heal
            my own relationships.
          </h1>

          <p className="myStory__hero-subtitle">
            I'm Ramsés, a relationship coach, and when I tell you that an
            extraordinary relationship is possible, it's because I've discovered
            that you need to create the right conditions for it. My mission is
            to help you achieve that.
          </p>
        </div>
      </section>

      <section className="myStory__story">
        <div className="myStory__story-container">
          <p className="myStory__story-text">
            For years, I believed that love was enough, but I realized that
            without communication, self-awareness, and mutual commitment, love
            fades. That discovery led me to study, to heal, and today, to help
            others build conscious relationships where love feels complete and
            stable.
          </p>
        </div>
      </section>

      <section className="myStory__experience">
        <div className="myStory__experience-content">
          <p className="myStory__experience-intro">
            In addition to studying Western Philosophy at the University of
            Frankfurt, I have studied and practiced Tibetan Buddhism for more
            than 20 years. I learned from Western meditation masters from the
            Himalayas. Based on my experiences and the various personal training
            courses I have completed, I have developed my own system.
          </p>

          <div className="myStory__experience-highlights">
            <div className="myStory__experience-card">
              Certificado en Xxxxx – Instituto XYZ
            </div>

            <div className="myStory__experience-card">
              Especialista en Relaciones de Pareja xxxxx
            </div>

            <div className="myStory__experience-card">
              Más de 100 parejas acompañadas desde 2018
            </div>
          </div>
        </div>
      </section>

      <section className="myStory__philosophy">
        <div className="myStory__philosophy-content">
          <div className="myStory__philosophy-text">
            <p className="myStory__philosophy-paragraph">
              I believe that an extraordinary relationship isn't born from luck,
              but from mutual understanding and commitment, vulnerability, and
              the intention to grow together.
            </p>

            <p className="myStory__philosophy-paragraph">
              My approach combines tools from coaching, humanistic psychology,
              and empathic communication to transform relationships from the
              ground up.
            </p>

            <p className="myStory__philosophy-paragraph">
              If you're ready to transform your relationship, or build one from
              a new place, I'd love to accompany you on that journey.
            </p>

            <Button
              className="myStory__philosophy-cta"
              variant="primary"
              onClick={() => navigate("/dashboard")}
            >
              Start your transformation today
            </Button>

          </div>

          <div className="myStory__philosophy-image">
            <img
              src={bg2MyStory}
              alt="Relationship coach Ramses Viloria"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

export default MyStory;