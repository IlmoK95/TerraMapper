const createModelComp =(props)=>{

    return (
        <div style = {props.backgroundStyle}>
             <h4>3D model resolution</h4>
            <span >points: <span style = {{color:props.pointAmount === props.currentMax? 'red' : 'green'}}>{props.pointAmount+2} / {props.currentMax+2}</span></span>
            <br></br> 
            <span >resolution (km): {props.res.toFixed(3)} {props.res===props.resAbsMax? 'max.resolution' : ''}</span> 
            <input disabled={props.show3D || props.pending? true : false} style={{width : '90%'}} type="range" min={-props.NewResMax-5} max={-props.NewResMax} defaultValue={-3.5} step="0.0001" id="myRange" onChange={props.set_Resolution}></input>
            <button style = {props.buttonStyle} disabled={props.show3D || props.pending || props.invalidMes || props.invalidPoints? true : false} onClick={props.SetLngLat}>create new topo-model</button>
            <br></br>
            <br></br>   
        </div>
    )
}
export default createModelComp