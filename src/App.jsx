import { useState, useRef, useEffect } from "react";
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
          // markers: true,
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
        {/* <section className="forthSection section">
          <h2 className="">4th SECTION</h2>
          <CanvasAnimation />
          <Canvas />
        </section> */}

        <section className="forthSection section">
          <h2 className="">5th SECTION</h2>
          <CanvasAnimation />
        </section>



        <section className="section ">
          <h2 ref={someTextRef} className="textClass">
            3rd Section
          </h2>
        </section>
        <section className="section ">
          <h2 ref={someTextRef} className="textClass">
            3rd Section
          </h2>
        </section>

 <section className="section ">
          <h2 ref={someTextRef} className="textClass">
            3rd Section
          </h2>
        </section>      
      </div>
    </>
  );
}

// const Canvas = (props) => {
//   const canvasRef = useRef(null);

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     const context = canvas.getContext("2d");

//     // Clear the canvas
//     context.clearRect(0, 0, canvas.width, canvas.height);

//     const imageObj = new Image();
//     imageObj.onload = function () {
//       // Draw the image on canvas
//       context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
//     };
//     imageObj.onerror = function () {
//       console.error("Error in loading the image.");
//     };
//     // Set the source of the image
//     imageObj.src =
//       "https://s-media-cache-ak0.pinimg.com/236x/d7/b3/cf/d7b3cfe04c2dc44400547ea6ef94ba35.jpg";

//     // Cleanup function to potentially cancel any pending frame requests
//     const cleanup = () => {
//       const frameId = window.requestAnimationFrame(() => {
//         window.cancelAnimationFrame(frameId);
//       });
//     };

//     return cleanup;
//   }, []); // Dependencies array is empty, effect runs only once after the initial rendering.

//   return (
//     <canvas
//       ref={canvasRef}
//       width={props.width || 250}
//       height={props.height || 380}
//       className="canvasStyle"
//     />
//   );
// };

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const frameCount = 241;

  useEffect(() => {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext('2d');
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      function loadImages() {
          let loadedImages = [];
          for (let i = 0; i < frameCount; i++) {
              const img = new Image();
              img.onload = () => render(i);  // Setting up onload before src to ensure the image is loaded before drawing.
              img.src = `https://kozarkar.github.io/heart-animation/image_${(i + 1).toString().padStart(4, "0")}.webp`;
              loadedImages.push(img);
          }
          setImages(loadedImages);
      }

      loadImages();

      return () => {
          window.removeEventListener("resize", () => {
              canvas.width = window.innerWidth;
              canvas.height = window.innerHeight;
              render(0);
          });
      };
  }, []);

  useEffect(() => {
      if (images.length === frameCount) {
          const sequence = { frame: 0 };
          gsap.to(sequence, {
              frame: frameCount - 1,
              snap: "frame",
              ease: "none",
              scrollTrigger: {
                  trigger: canvasRef.current,
                  start: "top top",
                  end: "bottom bottom",
                  scrub: 1,
                  onUpdate: () => {
                      render(sequence.frame);
                  },
              }
          });
      }
  }, [images]);

  function render(index) {
      const ctx = canvasRef.current.getContext('2d');
      const img = images[index];
      if (img && ctx) {
          const ratio = Math.max(canvasRef.current.width / img.width, canvasRef.current.height / img.height);
          const x = (canvasRef.current.width - img.width * ratio) / 2;
          const y = (canvasRef.current.height - img.height * ratio) / 2;
          ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          ctx.drawImage(img, 0, 0, img.width, img.height, x, y, img.width * ratio, img.height * ratio);
      }
  }

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%' }} />;
};

export default App;
