import { exportToExcel } from 'react-json-to-excel';
import { forwardRef, useContext } from 'react';
import { OBJExporter } from 'three/addons/exporters/OBJExporter.js';
import { STLExporter } from 'three/addons/exporters/STLExporter.js';
import fileDownload from 'js-file-download';
import { VisibilityContext } from '../contexts/VisibilityContext';

const Download = forwardRef(function SaveExcel (props, ref){

    const visibility = useContext(VisibilityContext)

    const DownloadTopoMod =()=>{

        let ObjName = `${props.getDate()} topo.obj`
        const exporter = new OBJExporter()
        const data = exporter.parse( props.TopoMod )
        fileDownload(data, ObjName)
        props.setMessage([`⬇️ '${ObjName}'`])
    }

    const DownloadExcel =()=>{
        let XlsxName = `${props.getDate()} wgs_coordinates`
        exportToExcel(ref.current, XlsxName)
        props.setMessage([`⬇️ '${XlsxName}.xlsx'`])

    }

  const DownloadTexture =()=>{

        let textureName = `${props.getDate()} texture.jpeg`
        fileDownload(props.texture, textureName)
        props.setMessage([`⬇️ '${textureName}'`])

    } 

    const DownloadTopoSTL =()=>{

        let ObjName = `${props.getDate()} topo.stl`
        const exporter = new STLExporter()
        const data = exporter.parse( props.TopoMod )
        fileDownload(data, ObjName)
        props.setMessage([`⬇️ '${ObjName}'`])
    }



    return (
        <div style={{size:'100% 100%', display: visibility.ShowDownloads?'block' : 'none'}}>
            <div style = {props.backgroundStyle}>
                <h4>Download</h4>
                    <div>     
                        <button style = {props.buttonStyle} disabled ={props.Coords.length > 1 && props.pending===false? false : true} onClick={DownloadExcel}> Coordinates as .xlsx</button>
                        <button style = {props.buttonStyle} disabled ={props.Coords.length > 1 && props.pending===false? false : true} onClick={DownloadTopoMod}>Model as .OBJ</button>
                        <button style = {props.buttonStyle} disabled ={props.Coords.length > 1 && props.pending===false? false : true} onClick={DownloadTopoSTL}>Model as .stl</button>
                        <button style = {props.buttonStyle} disabled ={props.Coords.length > 1 && props.pending===false && props.texture? false : true} onClick={DownloadTexture}>Texture as .jpeg</button>
                        <br></br>
                        <br></br>

                    </div>
        </div>


        </div>
        
    )
})
export default Download