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
      const t1 = gsap.timeline({
        scrollTrigger: {
          markers: true,
          trigger: boxRef.current,
          start: "top center", // Adjust these values based on your layout
          end: "bottom 20%",
          scrub: 2, // Optional: makes the animation smooth on scroll
        },
        onComplete: () => {
          console.log('t1 completed')
          t2.restart();
        },
      });
      t1.from(boxRef.current, {
        rotate: 360,
        y: -200,
        duration: 3,
      })
        .to(boxRef.current, {
          rotate: 0,
          x: -200,
          duration: 3,
        })
        .to(boxRef.current, {
          rotate: 0,
          x: 0,
          y: 0,
          backgroundColor: "red",
          duration: 3,
        });

      // Second timeline for the circle
      // const t2 = gsap.timeline({
      //   scrollTrigger: {
      //     markers: true,
      //     trigger: circleRef.current,
      //     start: "top 80%",
      //     end: "top 20%",
      //     scrub: 1,
      //   },
      //   paused: true,
      // });
      const t2 = gsap.timeline({ paused: true });
      t2.to(circleRef.current, {
        x: 300,
        rotation: 180,
        duration: 2,
      })
      .to(circleRef.current, {
        x: 0,
        rotation: 180,
        duration: 2,
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
