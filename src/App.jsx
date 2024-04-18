import { useState, useRef, useEffect } from "react";
import "./App.css";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef();

  // useGSAP(
  //   () => {
  //     const t1 = gsap.timeline({
  //       scrollTrigger: {
  //         trigger: boxRef.current,

  //         start: "top 80%",
  //         end: "top 20%",
  //         scrub: 2,
  //         toggleActions: "restart none none none",
  //       },
  //     });
  //     t1.to(boxRef.current, {
  //       x: -300,
  //       duration: 3,
  //     }).to(boxRef.current, {
  //       x: 0,
  //       duration: 3,
  //     });

  //     const t2 = gsap.timeline({
  //       scrollTrigger: {
  //         id: "circle",
  //         markers: false,
  //         trigger: circleRef.current,
  //         start: "top 80%",
  //         end: "top 20%",
  //         scrub: 2,
  //         toggleActions: "restart none none none",
  //         onUpdate: (self) => {
  //         },
  //       },
  //     });
  //     t2.to(circleRef.current, {
  //       x: 300,
  //       duration: 3,
  //     }).to(circleRef.current, {
  //       x: 0,
  //       duration: 3,
  //     });

  //     //some Text time line:
  //     const t3 = gsap.timeline({
  //       scrollTrigger: {
  //         // markers: true,
  //         trigger: ".textClass",
  //         // trigger: someTextRef.current,
  //         start: "top center",
  //         end: "+=55%",
  //         // end: "+=200px",
  //         scrub: 0.5,
  //         toggleActions: "restart none none none",
  //         toggleClass: { targets: ".textClass", className: "is-active" },
  //       },
  //     });
  //     // t3.from(someTextRef.current, {
  //     //   opacity: 0,
  //     //   duration: 0.6,
  //     // })
  //     //   .to(someTextRef.current, {
  //     //     color: "white",
  //     //     opacity: 1,
  //     //     duration: 2,
  //     //   })
  //     //   .to(someTextRef.current, {
  //     //     opacity: 0,
  //     //     duration: 2,
  //     //   });
  //   },
  //   {
  //     dependencies: [],
  //     scope: container,
  //     revertOnUpdate: true,
  //   }
  // );

  // TITLE ANIMATION
  // useGSAP(
  //   () => {
  //     const t1 = gsap.timeline({
  //       scrollTrigger: {
  //         markers: true,
  //         trigger: ".title",
  //         start: "top top",
  //         end: "+=700",
  //         pinSpacing: true,
  //         scrub: true,
  //         toggleActions: "restart none none none",
  //         pin: true,
  //         // scrub: 1,
  //       },
  //     });
  //     // t1.to(".title", {
  //     //   color: "red",
  //     //   opacity: 1,
  //     //   duration: 2,
  //     // });
  //   },
  //   {
  //     dependencies: [],
  //     scope: container,
  //     revertOnUpdate: true,
  //   }
  // );

  // useEffect(() => {
  //   ScrollTrigger.create({
  //     trigger: ".sdf",
  //     start: "top top",
  //     end: "+=700",
  //     pin: true,
  //     pinSpacing: true,
  //     scrub: 1,
  //     markers: true,
  //     toggleActions: "restart none none none",
  //   });
  // }, []);

  return (
    <>
      <div ref={container}>
        {/* <h2 className="title">IMAGE SEQUENCE</h2> */}
        <section className="imageSeqContainer ">
          <CanvasAnimation />
        </section>

        <section className="section secondSection">
          <h2 className="textClass">2nd here</h2>
        </section>
        <section className="section thirdSection">
          <h2 className="textClass">3rd - Content should be here</h2>
        </section>
      </div>
    </>
  );
}

const CanvasAnimation = () => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const frameCount = 147; // Update the frame count according to new image source

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    canvas.width = 1080;
    canvas.height = 720;

    // Function to generate image URLs based on new source
    // const currentFrame = (index) =>
    //   `https://www.apple.com/105/media/us/airpods-pro/2019/1299e2f5_9206_4470_b28e_08307a42f19b/anim/sequence/large/01-hero-lightpass/${(
    //     index + 1
    //   )
    //     .toString()
    //     .padStart(4, "0")}.jpg`;

    // v.2 :
    const currentFrame = (index) =>
      `/imgsequence/${(index + 1).toString().padStart(4, "0")}.jpg`;

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
      if (loadImages.length === frameCount) {
        console.log("loaded framesss!, TODO initital render");
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
    render(0);

    if (images.length === frameCount) {
      const sequence = { frame: 0 };
      gsap.to(sequence, {
        frame: frameCount - 1,
        snap: "frame",
        ease: "none",
        scrollTrigger: {
          id: "img-sequence",
          markers: false,
          trigger: canvasRef.current,
          start: "top top",
          end: "bottom 10%",
          scrub: 1.2,
          pin: true,
          pinSpacing: true,
          onUpdate: (self) => {
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

  return <canvas ref={canvasRef} style={{ width: "100%", height: "auto" }} />;
};

export default App;
