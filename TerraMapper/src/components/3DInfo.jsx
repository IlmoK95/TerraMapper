const ThreeDinfo =(props)=>{
    const infoTextStyle = {color : 'red', fontStyle : 'bold'}
    return (
        <div style={props.infoBubbleStyle}>
            <div>
                <h3>Geometry</h3>
                <p>vertex-points: <span style = {infoTextStyle}>{props.modPointAmount}</span></p>
                <p>resolution: <span style = {infoTextStyle}>{props.modRes} km</span></p>
                <p>file-size: <span style = {infoTextStyle}>{props.memUsed}</span></p>
            </div>
            {/* <div style={{marginLeft:'20px'}}>
                <h3>Location</h3>
                <p>center wgs: </p>
                <p>country: </p>
            </div> */}

        </div>
    )
}
export default  ThreeDinfo