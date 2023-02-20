import { Box, Paper, Stack } from "@mui/material";
import useCamera from "queries/useCamera";
import targetImage from "assets/target.jpg";
import targetTest from "assets/target_test.jpg";
import { useNavigate, useParams } from "react-router-dom";
import { useUpdateEffect } from "usehooks-ts";
import { useEffect, useRef } from "react";
import cv from "@techstark/opencv-js";
import Webcam from "react-webcam";

export default function Camera() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { data } = useCamera();
  const canvasRef = useRef(null);
  const imageRef = useRef(null);
  const realImageRef = useRef<HTMLImageElement>(null);
  const image2Ref = useRef<HTMLCanvasElement>(null);
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
            // realImageRef.current.src = targetImage;

            realImageRef.current.onload = () => {
              try {
                if (
                  realImageRef.current &&
                  canvasRef.current &&
                  image2Ref.current
                ) {
                  //test only
                  const img = cv.imread(realImageRef.current);

                  const gray = new cv.Mat();
                  cv.cvtColor(img, gray, cv.COLOR_BGR2GRAY);
                  cv.GaussianBlur(
                    gray,
                    gray,
                    new cv.Size(3, 3),
                    0,
                    0,
                    cv.BORDER_DEFAULT
                  );
                  cv.medianBlur(gray, gray, 3);
                  const edges = new cv.Mat();
                  cv.Canny(gray, edges, 50, 150, 3);
                  const circles = new cv.Mat();
                  cv.HoughCircles(
                    edges,
                    circles,
                    cv.HOUGH_GRADIENT,
                    1,
                    50,
                    175,
                    30,
                    0,
                    0
                  );
                  console.log(circles);
                  let color = new cv.Scalar(100, 100, 100);
                  for (let i = 0; i < circles.cols; i++) {
                    let x = circles.data32F[i * 3];
                    let y = circles.data32F[i * 3 + 1];
                    let radius = circles.data32F[i * 3 + 2];
                    let center = new cv.Point(x, y);
                    cv.circle(img, center, radius, color);
                  }

                  cv.imshow(image2Ref.current, edges);
                  cv.imshow(canvasRef.current, img);
                  img.delete();
                  gray.delete();
                  circles.delete();
                  resolve(1);
                }
              } catch (err) {
                resolve(1);
              }
            };
          }
        });
      }
    };

    let interval = setInterval(async () => {
      await imageProcessor();
    }, 1000);

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
        width={"640px"}
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
        style={{ display: "none" }}
      />
      <img
        alt="target"
        src={targetImage}
        height="480px"
        width={"640px"}
        style={{ display: "none" }}
        ref={imageRef}
      />
      <Stack direction={"row"}>
        <Box>
          <canvas ref={canvasRef} />
        </Box>
        <canvas ref={image2Ref} />
      </Stack>
    </Paper>
  );
}
