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
  const circleRef = useRef();
  useGSAP(
    () => {
      // Timeline for the box
      const t1 = gsap.timeline({
        scrollTrigger: {
          trigger: boxRef.current,

          start: "top 80%",
          end: "top 20%",
          scrub: 2,
          toggleActions: "restart none none none",
        },
      });
      t1.to(boxRef.current, {
        x: -300,
        duration: 3,
      }).to(boxRef.current, {
        x: 0,
        duration: 3,
      });

      // Timeline for the circle, with new ScrollTrigger that starts right after t1's end
      const t2 = gsap.timeline({
        scrollTrigger: {
          // id:'circle',
          trigger: circleRef.current,
          start: "top 80%",
          end: "top 20%",
          scrub: 2,
          toggleActions: "restart none none none",
        },
      });

      t2.to(circleRef.current, {
        x: 300,
        duration: 3,
      }).to(circleRef.current, {
        x: 0,
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
        <section className="section"></section>
        <section className="section">
          <div ref={boxRef} className="box"></div>
          <div ref={circleRef} className="circle"></div>
        </section>
        <section className="section"></section>
      </div>
    </>
  );
}

export default App;
