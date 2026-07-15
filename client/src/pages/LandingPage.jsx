import { Link } from "react-router-dom";
import {
  FaArrowRight,
  FaChartLine,
  FaShieldAlt,
  FaUserGraduate,
} from "react-icons/fa";

export default function LandingPage() {
  return (
    <>
      <style>{`
        /* Ateneo Blue Studio Spotlight Backdrop */
        .studio-background {
          background-color: #00122c;
          background-image: radial-gradient(
            circle at 50% 45%, 
            #003b88 0%, 
            #00204a 50%, 
            #000c1d 90%
          );
          background-attachment: fixed;
        }

        .tooltip-container {
          --background: #ffffff;
          --color: #ffffff;
          position: relative;
          cursor: pointer;
          transition: all .4s cubic-bezier(.23,1,.32,1);
          font-size: 16px;
          font-weight: 600;
          color: var(--color);
          height: 50px;
          width: 200px;
          display: grid;
          place-items: center;
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          overflow: visible;
          background: rgba(255, 255, 255, 0.05);
          backdrop-filter: blur(4px);
        }

        .tooltip-container .text {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          transition: all .4s cubic-bezier(.23,1,.32,1);
          z-index: 2;
        }

        .tooltip-container .hover-text {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          background: var(--background);
          color: #00204a; /* Matches the theme dark blue */
          border-radius: 9999px;
          transform: scale(0);
          transform-origin: left;
          transition: all .4s cubic-bezier(.23,1,.32,1);
          left: 100%;
          z-index: 1;
        }

        .tooltip {
          position: absolute;
          top: -54px;
          left: 50%;
          transform: translateX(-50%);
          background: rgba(255, 255, 255, 0.15);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          color: white;
          padding: 6px 12px;
          border-radius: 8px;
          font-size: 13px;
          opacity: 0;
          pointer-events: none;
          transition: .35s;
          white-space: nowrap;
        }

        .tooltip::after{
          content:"";
          position:absolute;
          bottom:-5px;
          left:50%;
          width:8px;
          height:8px;
          background: rgba(255, 255, 255, 0.15);
          border-right: 1px solid rgba(255, 255, 255, 0.15);
          border-bottom: 1px solid rgba(255, 255, 255, 0.15);
          transform:translateX(-50%) rotate(45deg);
        }

        .tooltip-container:hover{
          border-color: transparent;
          transform: translateY(-2px);
        }

        .tooltip-container:hover .text{
          opacity:0;
          transform:scale(.5);
          left:100%;
        }

        .tooltip-container:hover .hover-text{
          left:0;
          transform:scale(1);
        }

        .tooltip-container:hover .tooltip{
          opacity:1;
          animation:shake .45s ease;
        }

        @keyframes shake{
          0%{transform:translateX(-50%) rotate(0deg);}
          25%{transform:translateX(-50%) rotate(3deg);}
          50%{transform:translateX(-50%) rotate(-3deg);}
          75%{transform:translateX(-50%) rotate(1deg);}
          100%{transform:translateX(-50%) rotate(0deg);}
        }

        .card {
          position: relative;
          width: 100%;
          max-width: 350px;
          height: 200px;
          background-color: rgba(0, 18, 44, 0.4);
          backdrop-filter: blur(12px);
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          perspective: 1000px;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          margin: 0 auto;
        }

        .card .card-icon {
          font-size: 44px;
          color: rgba(255, 255, 255, 0.6);
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }

        .card:hover {
          transform: scale(1.02);
          border-color: rgba(255, 255, 255, 0.3);
        }

        .card__content {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          padding: 24px;
          box-sizing: border-box;
          background-color: #00122c;
          border: 1px solid rgba(255, 255, 255, 0.15);
          border-radius: 12px;
          transform: rotateX(-90deg);
          transform-origin: bottom;
          transition: all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        .card:hover .card__content {
          transform: rotateX(0deg);
        }

        .card__title {
          margin: 0;
          font-size: 18px;
          color: #ffffff;
          font-weight: 700;
          letter-spacing: -0.01em;
        }

        .card:hover .card-icon {
          transform: scale(0);
        }

        .card__description {
          margin: 8px 0 0;
          font-size: 13px;
          color: rgba(255, 255, 255, 0.7);
          line-height: 1.5;
        }
      `}</style>

      <main className="studio-background relative min-h-screen overflow-hidden text-white flex items-center justify-center">
        <section className="relative z-10 mx-auto flex flex-col justify-center w-full max-w-7xl px-6 py-16">
          
          {/* Top Hero Content Area */}
          <div className="max-w-3xl">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-white/50">
              Exam Platform
            </p>

            <h1 className="mt-4 text-5xl font-extrabold leading-none tracking-tight text-white md:text-8xl">
              ACET
            </h1>

            <p className="mt-6 text-base leading-relaxed text-white/80 max-w-lg">
              The Ateneo College Entrance Test (ACET) is a test requirement for admission to the undergraduate program of Ateneo de Manila University.
            </p>

            <div className="mt-10">
              <Link to="/login" className="inline-block">
                <div className="tooltip-container">
                  <span className="text">
                    Get Started
                  </span>

                  <span className="hover-text">
                    <span className="flex items-center gap-2 text-sm font-bold">
                      Start Exam <FaArrowRight />
                    </span>
                  </span>

                  <div className="tooltip">
                    Begin your ACET journey
                  </div>
                </div>
              </Link>
            </div>
          </div>

          {/* Bottom Landscape (Horizontal Grid) of Cards */}
          <div className="grid gap-6 grid-cols-1 md:grid-cols-3 mt-20 w-full justify-items-center">
            {[
              {
                icon: FaShieldAlt,
                title: "Lorem Ipsum",
                text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
              },
              {
                icon: FaUserGraduate,
                title: "Dolor Sit Amet",
                text: "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
              },
              {
                icon: FaChartLine,
                title: "Consectetur Elit",
                text: "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.",
              },
            ].map((item, index) => {
              const Icon = item.icon;

              return (
                <div key={index} className="card w-full">
                  <Icon className="card-icon" />
                  <div className="card__content">
                    <h2 className="card__title">{item.title}</h2>
                    <p className="card__description">{item.text}</p>
                  </div>
                </div>
              );
            })}
          </div>
          
        </section>
      </main>
    </>
  );
}