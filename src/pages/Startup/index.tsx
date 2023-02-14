import {
  AppBar,
  Autocomplete,
  Box,
  Button,
  CircularProgress,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import { getUserCamera } from "services/getUserCamera";
import colors from "const/colors";
import { Close, RocketLaunch } from "@mui/icons-material";
import { useToggle, useUpdateEffect } from "usehooks-ts";
export default function StartUp() {
  const queryClient = useQueryClient();
  const [open, _toggleOpen, setOpen] = useToggle(false);
  const { data, isLoading } = useQuery(["devices"], async () => {
    return await getUserCamera();
  });
  const [device, setDevice] = useState<MediaDeviceInfo | undefined>(undefined);
  useUpdateEffect(() => {
    if ((data || [])[0]) {
      if (!data?.some((_device) => _device.deviceId === device?.deviceId)) {
        setDevice((data || [])[0]);
      }
    }
  }, [data]);
  useEffect(() => {
    const deviceChangeListener = () => {
      queryClient.invalidateQueries(["devices"]);
    };
    navigator.mediaDevices.addEventListener(
      "devicechange",
      deviceChangeListener
    );
    return () => {
      navigator.mediaDevices.removeEventListener(
        "devicechange",
        deviceChangeListener
      );
    };
  }, [queryClient]);
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
            <Webcam
              mirrored
              screenshotFormat="image/jpeg"
              videoConstraints={{ deviceId: device?.deviceId }}
              height={"480px"}
              width={"640px"}
            />
          )}
        </Box>
        <Stack width={640} paddingLeft="32px" paddingRight="16px" spacing={2}>
          <Stack
            justifyContent={"flex-end"}
            alignItems="center"
            width="100%"
            direction={"row"}
            height="48px"
          >
            <Close />
          </Stack>
          <Stack>
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
          </Stack>
          <Stack marginTop={"auto"}>
            <Button
              variant="contained"
              sx={{ width: "120px", padding: "8px" }}
              disableRipple
              endIcon={<RocketLaunch />}
            >
              <Typography variant="subtitle2">Start</Typography>
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
}