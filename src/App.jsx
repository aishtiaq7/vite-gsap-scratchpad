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
          end: "+=55%",
          // end: "+=200px",
          scrub: 0.5,
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
        <section className="section"></section>

        <section className="forthSection section">
          <h2 className="">IMAGE SEQUENCE</h2>
          <CanvasAnimation />
        </section>

        <section className="section ">
          <h2 className="textClass">
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
  const frameCount = 147; // Update the frame count according to new image source

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1080;
    canvas.height = 720;
    // canvas.width = window.innerWidth;
    // canvas.height = window.innerHeight;

    // Function to generate image URLs based on new source
    const currentFrame = (index) =>
      `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(
        index + 1
      )
        .toString()
        .padStart(4, "0")}.jpg`;

    function loadImages() {
      let loadedImages = [];
      for (let i = 0; i < frameCount; i++) {
        const img = new Image();
        img.onload = () => {
          if (i === 0) render(0); // Render first image immediately for instant feedback
          loadedImages[i] = img; // Assign to index to maintain order
          if (loadedImages.filter(Boolean).length === frameCount) {
            setImages(loadedImages); // Only update state when all images are loaded
          }
        };
        img.onerror = () => console.error(`Failed to load image ${i}`);
        img.src = currentFrame(i);
      }
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
          markers: true,
          trigger: canvasRef.current,
          start: "top 50%",
          end: "bottom bottom",
          scrub: 1.2,
          onUpdate: () => {
            render(Math.floor(sequence.frame));
          },
        },
      });
    }
  }, [images]);

  function render(index) {
    const ctx = canvasRef.current.getContext("2d");
    const img = images[index];
    if (img && ctx) {
      const ratio = Math.max(
        canvasRef.current.width / img.width,
        canvasRef.current.height / img.height
      );
      const x = (canvasRef.current.width - img.width * ratio) / 2;
      const y = (canvasRef.current.height - img.height * ratio) / 2;
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      ctx.drawImage(
        img,
        0,
        0,
        img.width,
        img.height,
        x,
        y,
        img.width * ratio,
        img.height * ratio
      );
    }
  }

  return <canvas ref={canvasRef} style={{ width: "100%", height: "100%" }} />;
};

export default App;
