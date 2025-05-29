import addKeyLocalStorage from '../../helper/localStorage'
import { ReactComponent as LogoTTDK } from './../../assets/icons/Logo.svg'

export default function MainLogo({
    ...rest
}) {
    const localLogo = (JSON.parse(localStorage.getItem(addKeyLocalStorage('dataTheme'))) || {})?.stationsLogo
    return (
        localLogo
        ? <img src={localLogo} alt='' {...rest}/>
        : <LogoTTDK {...rest} />
    )

}