import { useContext } from "react"
import { VisibilityContext } from "../contexts/VisibilityContext"


const VisibilityButton =(props)=>{

    const visibility = useContext(VisibilityContext)

    const buttonStyle = { fontSize: '30px',
                            width : '80px',
                            padding : '10px',
                            height: '80px',
                            borderWidth: '2px',
                            borderStyle : 'solid',
                            borderColor:'black',
                            borderRadius:'0px 0px 0px 15px'
    }

    return (
        <div>
            <button style ={buttonStyle} disabled = {props.ThreeDReady  && props.pending===false ? false : true} onClick={props.ThreeDVisibility}>{visibility.show3D===false ? '3D' : 'Map'}</button> 
            <br></br>   
        </div>
    )
}
export default  VisibilityButton