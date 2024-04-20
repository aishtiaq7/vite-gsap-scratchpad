import { useState, useRef, useEffect } from "react";
import "./App.css";

import { useGSAP } from "@gsap/react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ReactLenis } from "@studio-freight/react-lenis";

gsap.registerPlugin(ScrollTrigger);

function App() {
  const container = useRef();

  // FOR : textClass animations GSAP
  useGSAP(
    () => {
      const textElements = gsap.utils.toArray(".textClass");

      textElements.forEach((text) => {
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: text,
            start: "top 50%",
            end: "+=900",
            scrub: true,
            markers: false,
            toggleActions: "restart pause reverse pause",
            pin: true,
            pinSpacing: true,
            // scroller: container.current,
          },
        });

        tl.fromTo(
          text,
          { autoAlpha: 0, duration: 1, id: "start-dark" }, //from
          { color: "white", autoAlpha: 1, duration: 8 } // to
        )
          // .to(text, {
          //   color: "white",
          //   duration: 5,
          // })
          .to(text, {
            duration: 2,
            autoAlpha: 0,
            opacity: 0,
            visibility: 0,
          });
      });
    },
    {
      dependencies: [],
      scope: container.current,
      revertOnUpdate: true,
    }
  );

  // useGSAP for parallax
  useGSAP(() => {
    // Parallax Effect for multiple sections
    const layers = gsap.utils.toArray(".parallax");
    layers.forEach((layer) => {
      const depth = layer.dataset.depth;
      gsap.to(layer, {
        y: () => -(window.innerHeight * parseFloat(depth)),
        ease: "none",
        scrollTrigger: {
          markers: false,
          trigger: layer.current,
          start: "top bottom",
          end: "bottom top",
          scrub: true,
        },
      });
    });
  }, [container.current]);

  const [isLoading, setIsLoading] = useState(true); // Central loading state for the application
  console.log("isloading: ", isLoading);
  if (false) {
    return <div className="spinnerContainer">Loading...</div>;
  }
  return (
    <ReactLenis root options={{ lerp: 0.1, duration: 1.5, smoothTouch: true }}>
      <div ref={container}>
        <section className="imageSeqContainer">
          <CanvasAnimation setIsLoading={setIsLoading} />
        </section>
        <section className="section secondSection">
          <h2 className="textClass">As a boy I always had BIG dreams</h2>
        </section>
        <section className="section thirdSection">
          <h2 className="textClass">dreams that I wanna</h2>
        </section>
        <section className="section thirdSection">
          <h2 className="textClass">turn into reality</h2>
        </section>
        {/* dummy sections */}
        <section className="section"></section>
        <section className="section"></section>
        {/* Additional Sections for Parallax Effect */}
        <section
          className="section smallerSections parallax"
          data-depth="1"
          style={{ backgroundColor: "#2e8b57", color: "white" }}
        >
          <h2>Normal</h2>
        </section>
        <section
          className="section smallerSections parallax"
          data-depth="0.8"
          style={{ backgroundColor: "#ff6347" }}
        >
          <section
            className="section smallerSections parallax"
            data-depth="1.2"
            style={{ backgroundColor: "#4682b4" }}
          >
            <h2>Faster </h2>
          </section>
          <h2>Slow </h2>
        </section>
      </div>
    </ReactLenis>
  );
}

const CanvasAnimation = ({ setIsLoading }) => {
  const canvasRef = useRef(null);
  const [images, setImages] = useState([]);
  const frameCount = 74;

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const currentFrame = (index) => {
      let res = `/psyboyimgsequence/boysittingsmall_${index
        .toString()
        .padStart(3, "0")}.png`;
      return res;
    };

    const loadedImages = [];
    let imagesLoaded = 0;
    for (let i = 0; i < frameCount; i++) {
      console.log("i==>", i);
      const img = new Image();
      // img.src = `/psyboyimgsequence/boysittingsmall_${i.toString().padStart(3, "0")}.png`;
      img.src = currentFrame(i);
      img.onload = () => {
        loadedImages[i] = img;
        imagesLoaded++;
        if (imagesLoaded === frameCount) {
          console.log("here");
          setImages(loadedImages);
          setIsLoading(false); // Set loading to false only when all images are loaded
        }
      };
      img.onerror = () => {
        console.error(`Failed to load image ${i}`);
      };
    }

    return () => {
      window.removeEventListener("resize", () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        render(0);
      });
    };
  }, []);

  useGSAP(() => {
    render(0); // Initial render

    if (images.length === frameCount) {
      render(0); // Initial render

      const sequence = { frame: 0 }; // Sequence object to keep track of the frame index
      const canvasStartY = 0; // Initial Y position of the canvas
      const canvasEndY = -950; // Final Y position of the canvas (e.g., 200 pixels up)

      // Create a timeline with a scrollTrigger to manage both animations
      const timeline = gsap.timeline({
        scrollTrigger: {
          id: "img-sequence",
          trigger: canvasRef.current,
          start: "top top",
          end: "bottom top", // Adjust this if needed to ensure full visibility throughout the scroll
          scrub: 1.2,
          pin: true,
          markers: true, // Useful for debugging
          onUpdate: (self) => {
            // Update the frame based on the progress of the timeline
            const currentFrame = Math.floor(self.progress * (frameCount - 1));
            render(currentFrame);
          },
        },
      });

      // Sequence animation for frames
      timeline.to(sequence, {
        frame: frameCount - 1,
        duration: 1, // This duration is arbitrary as the 'scrub' in ScrollTrigger modulates it
        ease: "none",
      });

      // Simultaneous translation of the canvas upward
      timeline.to(
        canvasRef.current,
        {
          y: canvasEndY, // Move up by 200 pixels
          duration: 1,
          ease: "none",
        },
        "<"
      ); // This "<" symbol means that this animation will start at the same time as the previous one
    }
  }, [images, frameCount, canvasRef]);

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
