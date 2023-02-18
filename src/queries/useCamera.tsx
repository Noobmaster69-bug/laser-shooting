import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { getUserCamera } from "services/getUserCamera";

export default function useCamera() {
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery(["devices"], async () => {
    return await getUserCamera();
  });
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
  return { data, isLoading };
}
