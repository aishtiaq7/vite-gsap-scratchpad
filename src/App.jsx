import { useState, useRef } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";

import "./App.css";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function App() {

  const container = useRef();
  const boxRef = useRef();
  useGSAP(
    () => {
      const t1 = gsap.timeline({
        onComplete: () => {
          //
        },
      });
      t1.from(boxRef.current, {
        scrollTrigger: {
          markers: true,
          trigger: boxRef.current,
          start: "top center", // Adjust these values based on your layout
          end: "bottom top",
          scrub: true, // Optional: makes the animation smooth on scroll
        },
        rotate: 360,
        y: -200,
        duration: 3,
      });
    },
    {
      dependencies: [],
      scope: container,
      revertOnUpdate: true,
    }
  );

  return (
    <>
      <div ref={container}>
        <section className="section">
        </section>
        <section className="section">
          <div ref={boxRef} className="box"></div>
          <div className="circle"></div>
        </section>
        <section className="section"></section>
      </div>
    </>
  );
}

export default App;
