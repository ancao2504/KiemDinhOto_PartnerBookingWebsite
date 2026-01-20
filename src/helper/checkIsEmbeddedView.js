import { PARAM_IS_HEADER_MINI_APP, PARAM_IS_WEB_VIEW } from "../constants/params";

export const checkIsWebView = (url) => {
  const parsedUrl = new URL(url)
  const isWebview =
    parsedUrl.searchParams.get(PARAM_IS_WEB_VIEW) === 'true' ||
    parsedUrl.searchParams.get(PARAM_IS_WEB_VIEW) === '1'
  return isWebview
}

export const checkHeaderMiniApp = (url) => {
  const parsedUrl = new URL(url)
  const isHeaderMiniApp =
    parsedUrl.searchParams.get(PARAM_IS_HEADER_MINI_APP) === 'true' ||
    parsedUrl.searchParams.get(PARAM_IS_HEADER_MINI_APP) === '1'
  return isHeaderMiniApp
}
