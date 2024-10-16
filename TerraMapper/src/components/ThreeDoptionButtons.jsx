import { useContext } from "react"
import { VisibilityContext } from "../contexts/VisibilityContext"


const ThreeDoptionButtons =(props)=>{

    const visibility = useContext(VisibilityContext)

    const buttonStyle = {fontSize: '15px', 
                                            display: visibility.show3D?"block":"none", 
                                            width : '80px', 
                                            padding : '10px', 
                                            height: '80px',
                                            borderWidth: '2px',
                                            borderStyle : 'solid',
                                            borderColor:'black', }

    const buttonStyleTop = { 
                                                fontSize: '15px', 
                                                display: visibility.show3D?"block":"none", 
                                                width : '80px', 
                                                padding : '10px', 
                                                height: '80px',
                                                boxShadow: '-5px -5px -5px -5px rgba(0, 0, 0, .1)',
                                                borderWidth: '2px',
                                                borderStyle : 'solid',
                                                borderColor:'black',
                                                borderRadius:'15px 0px 0px 0px'
                }

    return (
        <div >
            <div>
                <button style = {buttonStyleTop} onClick={props.ThreeDfitToScreen}><img style={{width:'60px', height:'90%', objectFit : 'contain'}} src={'../symbols/zoomToFit.png'}></img></button> 
                <button style = {buttonStyle} onClick={props.ChangeModType}><img style={{width:'60px', height:'90%', objectFit : 'contain'}} src={'../symbols/modType.png'}></img></button>
                <button style = {buttonStyle} onClick={props.showThreeDinfoFunc}><img style={{width:'60px', height:'90%', objectFit : 'contain'}} src={'../symbols/info.png'}></img></button> 
            </div>
             
        </div>
    )
}
export default  ThreeDoptionButtons