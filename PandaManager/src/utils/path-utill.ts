export const getPathUrl = (url: string) => {
  const myUrl = new URL(url)

  return myUrl.origin + myUrl.pathname
}
