import { PARAM_IS_BACK_TO_HOME_MINI_APP } from "../constants/params";

export const checkIsBackToHomeMiniApp = (url) => {
  const parsedUrl = new URL(url)
  const result =
    parsedUrl.searchParams.get(PARAM_IS_BACK_TO_HOME_MINI_APP) === 'true' ||
    parsedUrl.searchParams.get(PARAM_IS_BACK_TO_HOME_MINI_APP) === '1'
  return result
}
