import { Box, Paper } from "@mui/material";
import useCamera from "queries/useCamera";
import targetImage from "assets/target.jpg";
import targetTest from "assets/target_test.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateEffect } from "usehooks-ts";
import { useEffect, useRef } from "react";
import cv from "@techstark/opencv-js";
import { clearInterval } from "timers";
import Webcam from "react-webcam";
import { display } from "@mui/system";

export default function Camera() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useCamera();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const realImageRef = useRef<HTMLImageElement>(null);
  const webcamRef = useRef<Webcam>(null);
  useUpdateEffect(() => {
    if (!data?.some(({ deviceId }) => deviceId === id)) {
      navigate("/startup");
    }
  }, [data]);

  useEffect(() => {
    const imageProcessor = async () => {
      if (webcamRef?.current) {
        const imageSrc = webcamRef.current.getScreenshot();
        if (!imageSrc) return;

        return new Promise((resolve) => {
          if (realImageRef.current) {
            realImageRef.current.src = imageSrc;
            realImageRef.current.onload = () => {
              try {
                if (realImageRef.current && canvasRef.current) {
                  //test only
                  const img = cv.imread(realImageRef.current);

                  const gray = new cv.Mat();
                  cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);

                  const edges = new cv.Mat();
                  cv.Canny(gray, edges, 50, 150, 3);
                  // const circles = new cv.Mat();
                  // cv.HoughCircles(
                  //   edges,
                  //   circles,
                  //   cv.HOUGH_GRADIENT,
                  //   1,
                  //   20,
                  //   50,
                  //   30,
                  //   0,
                  //   0
                  // );

                  cv.imshow(canvasRef.current, edges);
                  img.delete();
                  gray.delete();
                  resolve(1);
                }
              } catch (err) {
                console.log(err);
                resolve(1);
              }
            };
          }
        });
      }
    };

    let interval = setInterval(async () => {
      await imageProcessor();
    }, 1000 / 30);

    return () => {
      clearInterval(interval);
    };
  }, []);
  return (
    <Paper sx={{ width: "1280px", height: "480px" }} elevation={4}>
      <img
        alt="target_test"
        src={targetTest}
        height="480px"
        width={"480px"}
        style={{ display: "none" }}
        ref={realImageRef}
      />
      <Webcam
        mirrored
        screenshotFormat="image/jpeg"
        videoConstraints={{ deviceId: id }}
        height={"480px"}
        width={"640px"}
        ref={webcamRef}
      />
      <img
        alt="target"
        src={targetImage}
        height="480px"
        width={"480px"}
        style={{ display: "none" }}
        ref={imageRef}
      />
      <Box>
        <canvas height={"480px"} width="480px" ref={canvasRef} />
      </Box>
    </Paper>
  );
}
