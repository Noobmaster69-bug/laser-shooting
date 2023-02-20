import {
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  MenuItem,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import colors from "const/colors";
import { Close, RocketLaunch } from "@mui/icons-material";
import { useInterval, useToggle, useUpdateEffect } from "usehooks-ts";

import useCamera from "queries/useCamera";
import cv from "@techstark/opencv-js";

export default function StartUp() {
  const [open, _toggleOpen, setOpen] = useToggle(false);
  const { data, isLoading } = useCamera();
  const [device, setDevice] = useState<MediaDeviceInfo | undefined>(undefined);
  const [started, toggleStart, setStart] = useToggle(false);
  const [calib, toggleCalib] = useToggle(true);
  const webCamRef = useRef<Webcam>(null);
  const virturalRef = useRef<HTMLImageElement>(null);
  const showRef = useRef<HTMLCanvasElement>(null);
  const laserPoint = useRef([0, 0]);
  const [form, setForm] = useState({
    distance: 25,
    size: 50,
  });
  useUpdateEffect(() => {
    if ((data || [])[0]) {
      if (!data?.some((_device) => _device.deviceId === device?.deviceId)) {
        setDevice((data || [])[0]);
      }
    }
  }, [data]);

  useInterval(
    async () => {
      if (webCamRef?.current) {
        const imageSrc = webCamRef.current.getScreenshot();
        if (!imageSrc) return;
        await new Promise((resolve) => {
          if (virturalRef.current) {
            virturalRef.current.src = imageSrc;
            virturalRef.current.onload = () => {
              try {
                if (virturalRef.current && showRef.current) {
                  const img = cv.imread(virturalRef.current);
                  const hsv = new cv.Mat();
                  const mask = new cv.Mat();
                  const dst = new cv.Mat();
                  if (started) {
                    cv.cvtColor(img, hsv, cv.COLOR_BGR2HSV);
                    const lower = new cv.Mat(
                      hsv.rows,
                      hsv.cols,
                      hsv.type(),
                      [0, 0, 255, 0]
                    );
                    const upper = new cv.Mat(
                      hsv.rows,
                      hsv.cols,
                      hsv.type(),
                      [255, 255, 255, 255]
                    );
                    let color = new cv.Scalar(0, 0, 255);
                    cv.inRange(hsv, lower, upper, mask);
                    //@ts-ignore
                    const result = cv.minMaxLoc(mask);
                    //@ts-ignore
                    const maxLoc = result.maxLoc;
                    if (maxLoc.x !== 0 && maxLoc.y !== 0) {
                      laserPoint.current = [maxLoc.x, maxLoc.y];
                      let center = new cv.Point(maxLoc.x, maxLoc.y + 10);
                      let center2 = new cv.Point(
                        maxLoc.x,
                        maxLoc.y -
                          (180 / Number(form.size)) *
                            (form.distance === 25
                              ? 23.5
                              : form.distance === 20
                              ? 20
                              : 10)
                      );
                      cv.circle(img, center, 20, color, 2, cv.LINE_AA);
                      cv.circle(
                        img,
                        center2,
                        10,
                        new cv.Scalar(0, 255, 0, 100),
                        2,
                        cv.LINE_AA
                      );
                      setStart(false);

                      lower.delete();
                      upper.delete();
                    }
                  } else {
                    if (
                      laserPoint.current[0] !== 0 &&
                      laserPoint.current[1] !== 0
                    ) {
                      let color = new cv.Scalar(0, 0, 255);
                      let center = new cv.Point(
                        laserPoint.current[0],
                        laserPoint.current[1] + 10
                      );
                      let center2 = new cv.Point(
                        laserPoint.current[0],
                        laserPoint.current[1] -
                          (180 / Number(form.size)) *
                            (form.distance === 25
                              ? 23.5
                              : form.distance === 20
                              ? 20
                              : 10)
                      );
                      cv.circle(img, center, 20, color, 2, cv.LINE_AA);
                      cv.circle(
                        img,
                        center2,
                        10,
                        new cv.Scalar(0, 255, 0, 100),
                        2,
                        cv.LINE_AA
                      );
                    }
                  }
                  //@ts-ignore
                  cv.circle(
                    img,
                    new cv.Point(img.size().width / 2, img.size().height / 2),
                    180,
                    new cv.Scalar(0, 255, 255),
                    2,
                    cv.LINE_AA
                  );
                  cv.imshow(showRef.current, img);
                  img.delete();
                  hsv.delete();
                  mask.delete();
                  dst.delete();

                  resolve(1);
                }
              } catch (err) {
                window.location.reload();
                resolve(1);
              }
            };
          }
        });
      }
    },
    calib || started ? 1000 / 45 : null
  );

  return (
    <Paper sx={{ width: "1280px", height: "480px" }} elevation={4}>
      <Stack height={"480px"} width="100%" direction={"row"}>
        <Box
          height={"480px"}
          width="640px"
          bgcolor={colors.slate[900]}
          display="flex"
          justifyContent={"center"}
          alignItems="center"
        >
          {isLoading ? (
            <CircularProgress />
          ) : (
            <>
              <Webcam
                mirrored
                screenshotFormat="image/jpeg"
                videoConstraints={{ deviceId: device?.deviceId }}
                height={"480px"}
                width={"640px"}
                ref={webCamRef}
                style={{ position: "absolute", zIndex: -1 }}
              />
              <img ref={virturalRef} alt="123" style={{ display: "none" }} />
              <canvas
                ref={showRef}
                height={"480px"}
                width={"640px"}
                style={{ zIndex: 1 }}
              />
            </>
          )}
        </Box>
        <Stack width={640} paddingLeft="32px" paddingRight="16px" spacing={2}>
          <Stack
            justifyContent={"flex-end"}
            alignItems="center"
            width="100%"
            direction={"row"}
            height="64px"
          >
            {/* <Close /> */}
          </Stack>
          <Stack spacing={3} paddingRight="36px">
            <Autocomplete
              open={open}
              onClose={() => setOpen(false)}
              onBlur={() => setOpen(false)}
              onOpen={() => {
                setOpen(true);
              }}
              options={data || []}
              getOptionLabel={(option) => {
                return option.label;
              }}
              isOptionEqualToValue={(opts, vl) => {
                return opts.deviceId === vl.deviceId;
              }}
              value={
                device || {
                  deviceId: "",
                  groupId: "",
                  kind: "videoinput",
                  label: "",
                  toJSON: () => "",
                }
              }
              onChange={(_event, deviceData) => {
                if (deviceData) {
                  setDevice(deviceData);
                }
              }}
              renderInput={(params) => (
                <TextField {...params} label="Chọn thiết bị" />
              )}
              loading={isLoading}
              disableClearable
            />
            <Stack direction={"row"} spacing={3}>
              <TextField
                label="Khoảng cách bắn (m)"
                type={"number"}
                value={form.distance}
                onChange={(ev) => {
                  setForm((form) => ({
                    ...form,
                    distance: Number(ev.target.value),
                  }));
                }}
                select
                fullWidth
              >
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={25}>25</MenuItem>
              </TextField>
              {/* <TextField
                label="Kích cỡ bia (cm)"
                type={"number"}
                value={form.size}
                onChange={(ev) => {
                  setForm((form) => ({
                    ...form,
                    size: Number(ev.target.value),
                  }));
                }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <Help />
                    </InputAdornment>
                  ),
                }}
              /> */}
            </Stack>
          </Stack>
          <Stack
            height={"100%"}
            width="100%"
            justifyContent={"flex-end"}
            alignItems="end"
            paddingBottom="32px"
            paddingRight="36px"
            direction={"row"}
            spacing={3}
          >
            <Button
              variant="contained"
              sx={{ width: "120px", padding: "8px" }}
              disableRipple
              endIcon={<RocketLaunch />}
              onClick={() => {
                toggleCalib();
              }}
              color={calib ? "error" : "warning"}
              disabled={started}
            >
              <Typography variant="subtitle2">
                {calib ? "Hoàn tất" : "Căn chỉnh"}
              </Typography>
            </Button>
            <Button
              variant="contained"
              sx={{ width: "120px", padding: "8px" }}
              disableRipple
              endIcon={<RocketLaunch />}
              onClick={() => {
                toggleStart();
              }}
              color={started ? "error" : "info"}
              disabled={calib}
            >
              <Typography variant="subtitle2">
                {started ? "Stop" : "Start"}
              </Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}
