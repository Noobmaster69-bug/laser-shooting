export async function getUserCamera() {
  return await (
    await navigator.mediaDevices.enumerateDevices()
  ).filter(({ kind }) => kind === "videoinput");
}
