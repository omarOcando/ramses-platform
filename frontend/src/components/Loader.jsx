import { useEffect, useState } from "react";
import "../styles/components/_loader.scss";

function Loader({ onFinish }) {
  const [visible, setVisible] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const t0 = setTimeout(() => {
      setVisible(true);
    }, 50);
  
    const duration = 3000;
    const intervalTime = 30;
    const steps = duration / intervalTime;
    let current = 0;
  
    const progressInterval = setInterval(() => {
      current++;
      const value = Math.min(Math.round((current / steps) * 100), 100);
      setProgress(value);
    }, intervalTime);
  
    const t1 = setTimeout(() => {
      setFadeOut(true);
      clearInterval(progressInterval);
    }, 3000);
  
    const t2 = setTimeout(() => {
      onFinish();
    }, 3600);
  
    return () => {
      clearTimeout(t0);
      clearTimeout(t1);
      clearTimeout(t2);
      clearInterval(progressInterval);
    };
  }, [onFinish]);

  return (
    <div
      className={`loader ${visible ? "loader--visible" : ""} ${
        fadeOut ? "loader--fadeOut" : ""
      }`}
    >
      <div className="loader__content">
        <div className="loader__heartWrap">
          <div className="loader__heart"></div>
          <div className="loader__heartShadow"></div>
        </div>

        <div className="loader__bottom">
          <h2 className="loader__text">Preparing your experience...</h2>

          <div className="loader__bottomRow">
            <span className="loader__percent">{progress}%</span>

            <div className="loader__bar">
              <div className="loader__progress"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Loader;