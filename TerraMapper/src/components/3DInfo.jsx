import { useContext } from "react"
import { VisibilityContext } from "../contexts/VisibilityContext"


const ThreeDinfo =(props)=>{

    const visibility = useContext(VisibilityContext)


    const infoTextStyle = {color : 'red', fontStyle : 'bold'}

    const ThreeDinfoBubble = { flexWrap: 'wrap', 
                            background : 'white', 
                            marginRight : '10px', 
                            borderRadius:'20px 5px 5px 20px', 
                            height : '100%', 
                            width : 'fit-content', 
                            padding : '2px 10px 2px 10px', 
                            fontSize: '15px', 
                            display: visibility.show3D && visibility.showThreeDinfo ?"flex":"none"
    }



    return (
        <div style={ThreeDinfoBubble}>
            <div>
                <h3>Geometry</h3>
                <p>vertex-points: <span style = {infoTextStyle}>{props.modPointAmount}</span></p>
                <p>resolution: <span style = {infoTextStyle}>{props.modRes} km</span></p>
                <p>file-size: <span style = {infoTextStyle}>{props.memUsed}</span></p>
            </div>

        </div>
    )
}
export default  ThreeDinfo