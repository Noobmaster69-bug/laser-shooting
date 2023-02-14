import { useEffect, useRef } from "react";
import cv from "@techstark/opencv-js";
import Webcam from "react-webcam";
import { Box } from "@mui/material";
function App() {
  const imgRef = useRef<HTMLImageElement>(null);
  const webcamRef = useRef<Webcam>(null);
  const faceImgRef = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    // navigator.mediaDevices.enumerateDevices().then(console.log);
  }, []);
  useEffect(() => {
    const detectFace = async () => {
      if (webcamRef.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        return new Promise((resolve) => {
          if (imgRef.current) {
            imgRef.current.src = imageSrc;
            imgRef.current.onload = () => {
              try {
                if (imgRef.current && faceImgRef.current) {
                  const img = cv.imread(imgRef.current);
                  const imgGray = new cv.Mat();
                  cv.cvtColor(img, imgGray, cv.COLOR_BGR2GRAY);
                  cv.imshow(faceImgRef.current, imgGray);

                  img.delete();
                  resolve(1);
                }
              } catch (error) {
                console.log(error);
                resolve(1);
              }
            };
          }
        });
      }
    };

    let handle: number = 0;
    const nextTick = () => {
      handle = requestAnimationFrame(async () => {
        await detectFace();
        nextTick();
      });
    };
    nextTick();
    return () => {
      cancelAnimationFrame(handle);
    };
  }, []);
  return (
    <Box height="100%" width="100%">
      <img alt="test" ref={imgRef} style={{ display: "none" }} />
      <Webcam
        ref={webcamRef}
        className="webcam"
        mirrored
        screenshotFormat="image/jpeg"
        audio={false}
      />
      <canvas className="outputImage" ref={faceImgRef} />
    </Box>
  );
}

export default App;
