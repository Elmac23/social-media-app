import { AxiosResponse } from "axios";

async function extractDataFromAxios<T>(fn: Promise<AxiosResponse<T>>) {
  const data = await fn;

  return data.data;
}

export default extractDataFromAxios;
