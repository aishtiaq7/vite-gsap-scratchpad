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
  const someTextRef = useRef();

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
          id: "circle",
          markers: false,
          trigger: circleRef.current,
          start: "top 80%",
          end: "top 20%",
          // end: "+=200px",
          scrub: 2,
          toggleActions: "restart none none none",
          onUpdate: (self) => {
            // console.log("progress:", Math.round(self.progress * 100)),
          },
        },
      });
      t2.to(circleRef.current, {
        x: 300,
        duration: 3,
      }).to(circleRef.current, {
        x: 0,
        duration: 3,
      });

      //some Text time line:
      const t3 = gsap.timeline({
        scrollTrigger: {
          markers: true,
          trigger: ".textClass",
          // trigger: someTextRef.current,
          start: "top center",
          end: "+=25%",
          // end: "+=200px",
          scrub: 3,
          toggleActions: "restart none none none",
          toggleClass: { targets: ".textClass", className: "is-active" },
        },
      });
      // t3.from(someTextRef.current, {
      //   opacity: 0,
      //   duration: 0.6,
      // })
      //   .to(someTextRef.current, {
      //     color: "white",
      //     opacity: 1,
      //     duration: 2,
      //   })
      //   .to(someTextRef.current, {
      //     opacity: 0,
      //     duration: 2,
      //   });
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
        <section className="section DISPLAY_NONE"></section>

        {/* <section className="section DISPLAY_NONE">
          <div ref={boxRef} className="box"></div>
          <div ref={circleRef} className="circle"></div>
        </section> */}

        <section className="section DISPLAY_NONE">
          <h2 ref={someTextRef} className="textClass">
            3rd Section
          </h2>
        </section>
        <section className="section">
          <h2 className="forthSection">4th SECTION</h2>
          {/* <canvas ref={canvasRef} width={window.innerWidth} height={window.innerHeight} /> */}
          {/* <canvas  width={window.innerWidth} height={window.innerHeight} /> */}
        </section>
      </div>
    </>
  );
}

function CanvasImage() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Load the first frame
    const image = new Image();
    image.src = "https://kozarkar.github.io/heart-animation/image_0001.webp"; // URL to your image
    image.onload = () => {
      // Draw the image onto the canvas
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };

    // Handle resizing
    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return <canvas ref={canvasRef} />;
}

export default App;
