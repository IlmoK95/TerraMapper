import { useState } from 'react';

const ThreeDoptionButtons =(props)=>{
    const [pressed, setPressed] = useState(false)

    const ChangeShadowPressed=()=>{
        setPressed(!pressed)
        props.ChangeShadowFunc()

    }

    return (
        <div>
            <button style = {props.buttonStyle} onClick={props.ThreeDfitToScreen}>zoom to fit</button> 
            <button style = {props.buttonStyle} onClick={ChangeShadowPressed}>{pressed ? 'soft shadow' : 'flat shadow' }</button> 
        </div>
    )
}
export default  ThreeDoptionButtons