const MapOptionButtons =(props)=>{

    return (
        <div>
            <button style = {props.buttonStyle} onClick={props.reCenterBox}>recenter box</button> 
            <button style = {props.buttonStyle} onClick={props.showNormalMap}> { props.hideLayer? 'hide overlay' : ' show overlay' }</button> 
        </div>
    )
}
export default  MapOptionButtons