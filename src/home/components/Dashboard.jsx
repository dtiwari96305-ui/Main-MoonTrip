import { useEffect, useRef } from 'react';
import screenshotDashboard from '../../assets/screenshots/screenshot-dashboard.png';

export default function Dashboard() {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.classList.add('screenshot-visible');
          observer.unobserve(el);
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-16 px-4 overflow-hidden">
      <div className="max-w-5xl mx-auto">
        <p className="text-center text-dark-text text-sm tracking-widest uppercase mb-8">
          See it in action
        </p>
        <div ref={ref} className="screenshot-reveal screenshot-hover">
          <div className="browser-mockup">
            {/* Browser chrome bar */}
            <div className="browser-bar">
              <div className="browser-dots">
                <span className="dot red" />
                <span className="dot yellow" />
                <span className="dot green" />
              </div>
              <div className="browser-url">moontrip.app/dashboard</div>
            </div>
            {/* Actual screenshot */}
            <img
              src={screenshotDashboard}
              alt="MoonTrip Dashboard - Business overview with revenue charts and booking stats"
              loading="lazy"
              style={{ width: '100%', height: 'auto', display: 'block' }}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
