function getResponse<T>(data: T[], count: number) {
  return {
    data,
    count,
  };
}

export default getResponse;
