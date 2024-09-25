const ThreeDoptionButtons =(props)=>{

    return (
        <div >
            <div>
                <button style = {props.buttonStyle} onClick={props.ThreeDfitToScreen}>zoom to fit</button> 
                <button style = {props.buttonStyle} onClick={props.ChangeModType}>{props.ModType==='.obj' ? 'refined view' : '.obj view' }</button>
                <button style = {props.buttonStyle} onClick={props.showThreeDinfoFunc}>{props.showThreeDinfo ? 'hide info' : 'show info' }</button> 
            </div>
             
        </div>
    )
}
export default  ThreeDoptionButtons