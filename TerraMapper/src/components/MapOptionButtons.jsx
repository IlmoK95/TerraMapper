import { useContext } from "react"
import { VisibilityContext } from "../contexts/VisibilityContext"

const MapOptionButtons =(props)=>{

    const visibility = useContext(VisibilityContext)

    const buttonStyleTop = { 
                                    fontSize: '15px', 
                                    display: visibility.show3D?"none":"block", 
                                    width : '80px', 
                                    padding : '10px', 
                                    height: '80px',
                                    boxShadow: '-5px -5px -5px -5px rgba(0, 0, 0, .1)',
                                    borderWidth: '2px',
                                    borderStyle : 'solid',
                                    borderColor:'black',
                                    borderRadius:'15px 0px 0px 0px'
    }

    const buttonStyle = { 
        fontSize: '15px', 
        display: visibility.show3D?"none":"block", 
        width : '80px', 
        padding : '10px', 
        height: '80px',
        boxShadow: '-5px -5px -5px -5px rgba(0, 0, 0, .1)',
        borderWidth: '2px',
        borderStyle : 'solid',
        borderColor:'black',
}

    return (
        <div>
            
            <button style = {buttonStyleTop} onClick={props.reCenterBox}><img style={{width:'50px', height:'90%', objectFit : 'contain'}} src={'../symbols/reCenter.png'}></img></button> 
            <button style = {buttonStyle} onClick={props.showNormalMap}><img style={{width:'50px', height:'90%', objectFit : 'contain'}} src={'../symbols/layers.png'}></img></button> 
        </div>
    )
}
export default  MapOptionButtons