function withToken(token?: string) {
  return token
    ? {
        headers: { Authorization: `Bearer ${token}` },
      }
    : undefined;
}

export default withToken;
