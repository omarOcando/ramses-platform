import { Link } from "react-router-dom";
import Button from "../components/Button";

import heroImg from "../assets/images/doYouFeelThis/BG1-DoYouFeelThis.jpg";
import heroImg2 from "../assets/images/doYouFeelThis/BG2-DoYouFeelThis.jpg";
import discussionImg from "../assets/images/doYouFeelThis/discussion.jpg";
import distanceImg from "../assets/images/doYouFeelThis/distance.jpg";
import jealousyImg from "../assets/images/doYouFeelThis/jealousy.jpg";
import communicationImg from "../assets/images/doYouFeelThis/communication.jpg";
import lonelinessImg from "../assets/images/doYouFeelThis/loneliness.jpg";
import patternsImg from "../assets/images/doYouFeelThis/patterns.jpg";

const empathyCards = [
  {
    title: "Constant Arguments",
    text: "Every conversation seems to turn into a fight, even when you truly don’t want to argue…",
    image: discussionImg,
    alt: "Illustration of a couple arguing face to face",
  },
  {
    title: "Emotional Distance",
    text: "Your partner may be physically close, but emotionally far away...",
    image: distanceImg,
    alt: "Illustration of a couple having dinner while both look at their phones",
  },
  {
    title: "Jealousy or Distrust",
    text: "You don’t feel at peace, and deep down, trust feels fragile even when you try…",
    image: jealousyImg,
    alt: "Illustration of a woman secretly watching her partner work from behind a door",
  },
  {
    title: "Broken Communication",
    text: "It feels like you no longer understand each other — you speak, but don’t feel heard…",
    image: communicationImg,
    alt: "Illustration of a woman trying to speak while her partner walks away",
  },
  {
    title: "Loneliness",
    text: "You are in a relationship, but somehow you feel more alone than ever…",
    image: lonelinessImg,
    alt: "Illustration of a couple lying apart in bed without speaking",
  },
  {
    title: "Fear of Repeating Patterns",
    text: "You’re afraid of reliving the same pain you experienced in past relationships…",
    image: patternsImg,
    alt: "Illustration representing the fear of repeating unhealthy relationship patterns",
  },
];

function DoYouFeelThis() {
  return (
    <main className="doYouFeelThis">

      {/* SECTION 1 - Hero */}

      <section className="doYouFeelThis__hero">
        <div className="doYouFeelThis__hero-media">
          <img src={heroImg} alt="Ramsés portrait background" />
          <div className="doYouFeelThis__hero-overlay"></div>
        </div>
        
        <div className="doYouFeelThis__hero-content doYouFeelThis__hero-glass">
          <h1>You are not alone.</h1>
          <p className="doYouFeelThis__hero-text">
            Maybe today you feel confused, exhausted, or frustrated…, but all
            of that can change. We all deserve a relationship where we feel
            understood, safe, and at peace.
          </p>
        </div>        
      </section>

      {/* SECTION 2 - Empathy cards */}

      <section className="doYouFeelThis__empathy">        
        <div className="doYouFeelThis__section-heading">
          <p className="doYouFeelThis__section-label">
            You may recognize some of this
          </p>

          <h2>Situations that hurt<br/>more than words can often explain</h2>
        </div>

        <div className="doYouFeelThis__grid">
          {empathyCards.map((card, index) => (
            <article className="doYouFeelThis__card" key={index}>
              <div className="doYouFeelThis__card-image-wrapper">
                <img src={card.image} alt={card.alt} />
              </div>

              <div className="doYouFeelThis__card-content">
                <h3>{card.title}</h3>

                <p>{card.text}</p>
              </div>
            </article>
          ))}
        </div>        
      </section>

      {/* SECTION 3 - Transition */}

      <section className="doYouFeelThis__transition">
        <div className="doYouFeelThis__transition-container">
          <p className="doYouFeelThis__section-label">All of this can change</p>
          <h2>No relationship is meant for suffering.</h2>
          <p className="doYouFeelThis__transition-text">
            With the right guidance, communication can heal, trust can be rebuilt,
            and love can be renewed with more maturity, depth, and emotional
            connection.
          </p>
        </div>
      </section>

      {/* SECTION 4 - How I help */}

      <section className="doYouFeelThis__help">
        <p className="doYouFeelThis__section-label">There is a path forward</p>

        <h2>My work is to help you understand, heal, and reconnect.</h2>

        <p className="doYouFeelThis__help-text">
          Through personalized sessions, practical tools, and an emotionally
          intelligent approach, I support singles and couples in building more
          conscious, fulfilling, and connected relationships.
        </p>

        <div className="doYouFeelThis__actions">
          <Link to="/the-way-to-transformation">
            <Button variant="primary">Discover how I work</Button>
          </Link>
        </div>        
      </section>

      {/* SECTION 5 - Closing CTA */}

      <section className="doYouFeelThis__closing">
        <div className="doYouFeelThis__closing-content">
          <h2>You don't need to have everything figured out to take the first step.<br/><br/>Only the decision to not staying in the same place.</h2>

          <div className="doYouFeelThis__actions">
            <Link to="/dashboard">
              <Button variant="primary">Book your free consultation</Button>
            </Link>
          </div>
        </div>        

        <div className="doYouFeelThis__closing-media">
          <img src={heroImg2} alt="Ramsés and partner background" />
        </div>
      </section>
    </main>
  );
}

export default DoYouFeelThis;