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
        <section className="forthSection section">
          <h2 className="">4th SECTION</h2>
          {/* <CanvasAnimation /> */}
          <Canvas />
        </section>
      </div>
    </>
  );
}

const Canvas = (props) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const context = canvas.getContext("2d");

    // Clear the canvas
    context.clearRect(0, 0, canvas.width, canvas.height);

    const imageObj = new Image();
    imageObj.onload = function () {
      // Draw the image on canvas
      context.drawImage(imageObj, 0, 0, canvas.width, canvas.height);
    };
    imageObj.onerror = function () {
      console.error("Error in loading the image.");
    };
    // Set the source of the image
    imageObj.src =
      "https://s-media-cache-ak0.pinimg.com/236x/d7/b3/cf/d7b3cfe04c2dc44400547ea6ef94ba35.jpg";

    // Cleanup function to potentially cancel any pending frame requests
    const cleanup = () => {
      const frameId = window.requestAnimationFrame(() => {
        window.cancelAnimationFrame(frameId);
      });
    };

    return cleanup;
  }, []); // Dependencies array is empty, effect runs only once after the initial rendering.

  return (
    <canvas
      ref={canvasRef}
      width={props.width || 300}
      height={props.height || 150}
      className="canvasStyle"
    />
  );
};

function CanvasAnimation() {
  const [images, setImages] = useState([]);
  const canvasRef = useRef(null);

  useEffect(() => {
    if (!canvasRef.current) {
      console.log("Canvas not available");
      return;
    }

    const context = canvasRef.current.getContext("2d");
    canvasRef.current.width = window.innerWidth;
    canvasRef.current.height = window.innerHeight;

    function loadImages(frameCount) {
      const imgPromises = Array.from({ length: frameCount }, (_, i) => {
        const img = new Image();
        const index = (i + 1).toString().padStart(4, "0");
        img.src = `https://kozarkar.github.io/heart-animation/image_${index}.webp`;
        return new Promise((resolve, reject) => {
          img.onload = () => {
            console.log(`Image ${img.src} loaded successfully`);
            resolve(img);
          };
          img.onerror = () => {
            console.log(`Error loading image ${img.src}`);
            reject(new Error(`Error loading image ${img.src}`));
          };
        });
      });
      return Promise.all(imgPromises);
    }

    loadImages(241).then((loadedImages) => {
      setImages(loadedImages);
      gsap.to(loadedImages, {
        frame: loadedImages.length - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          trigger: canvasRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 1,
          markers: true,
          onUpdate: (self) => {
            const frameIndex = Math.floor(
              self.progress * (loadedImages.length - 1)
            );
            drawImageProperly(
              context,
              loadedImages[frameIndex],
              window.innerWidth,
              window.innerHeight
            );
          },
        },
      });
    });

    const handleResize = () => {
      canvasRef.current.width = window.innerWidth;
      canvasRef.current.height = window.innerHeight;
      context.clearRect(
        0,
        0,
        canvasRef.current.width,
        canvasRef.current.height
      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, [images]);

  function drawImageProperly(ctx, img, canvasWidth, canvasHeight) {
    if (!img) return; // Ensure the image is loaded
    ctx.clearRect(0, 0, canvasWidth, canvasHeight);
    const hRatio = canvasWidth / img.width;
    const vRatio = canvasHeight / img.height;
    const ratio = Math.min(hRatio, vRatio);
    const centerShift_x = (canvasWidth - img.width * ratio) / 2;
    const centerShift_y = (canvasHeight - img.height * ratio) / 2;
    ctx.drawImage(
      img,
      0,
      0,
      img.width,
      img.height,
      centerShift_x,
      centerShift_y,
      img.width * ratio,
      img.height * ratio
    );
  }

  return (
    <canvas
      ref={canvasRef}
      // width={200}
      // height={200}
      style={{ backgroundColor: "pink" }}
    />
  );
}

export default App;
