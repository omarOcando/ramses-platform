import bg1Take1step from "../assets/images/takeTheFirstStep/BG1-Take1step.jpg";
import bg2Take1step from "../assets/images/takeTheFirstStep/BG2-Take1step.jpg";
import Button from "../components/Button";

function TakeTheFirstStep() {
  return (
    <div className="takeFirstStep">
      <section className="takeFirstStep__hero">
        <div className="takeFirstStep__hero-image">
          <img src={bg1Take1step} alt="Relationship conversation" />
        </div>

        <div className="takeFirstStep__hero-content">
          <h1 className="takeFirstStep__hero-title">
            Every great change begins with a conversation…
          </h1>

          <p className="takeFirstStep__hero-text">
            If you feel it's time to take the next step in your relationship,
            whether with yourself or your partner, I'm here to listen. Tell me
            briefly about your situation and we'll schedule a free initial session.
          </p>

          <p className="takeFirstStep__hero-highlight">Talk to me directly</p>

          <p className="takeFirstStep__hero-text">
            Press the button and let's talk on WhatsApp.
          </p>

          <div className="takeFirstStep__hero-cta">
            <a
              href="https://wa.me/491736625564?text=Hello%20Ramses,%20I%20would%20like%20to%20ask%20about%20coaching."
              target="_blank"
              rel="noopener noreferrer"
            >
              <Button>Talk on WhatsApp</Button>
            </a>
          </div>
        </div>
      </section>

      <section className="takeFirstStep__contact">
        <div className="takeFirstStep__contact-image">
          <img src={bg2Take1step} alt="Couple connection" />
        </div>

        <div className="takeFirstStep__contact-text">
          <p className="takeFirstStep__contact-emailText">
            Write me an email, I will read it and answer it personally within 24
            hours.
          </p>

          <div className="takeFirstStep__contact-cta">
            <a href="mailto:mail@ramsesviloria.com">
              <Button>Send Email</Button>
            </a>
          </div>

          <p className="takeFirstStep__contact-message">
            Helping people transform the way they love is more than my job, it's
            my purpose. If you've made it this far, you've already taken the
            first step. Congratulations! We'll take the next one together.
          </p>

          <p className="takeFirstStep__contact-signature">— Ramsés</p>

          <p className="takeFirstStep__contact-role">
            (Expert Coach in Couple Relationships)
          </p>
        </div>
      </section>
    </div>
  );
}

export default TakeTheFirstStep;