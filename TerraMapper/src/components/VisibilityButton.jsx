const VisibilityButton =(props)=>{

    return (
        <div>
            <button style ={props.style} disabled = {props.ThreeDReady  && props.pending===false ? false : true} onClick={props.ThreeDVisibility}>{props.show3D===false ? 'show 3D' : 'hide 3D'}</button> 
            <br></br>   
        </div>
    )
}
export default  VisibilityButton