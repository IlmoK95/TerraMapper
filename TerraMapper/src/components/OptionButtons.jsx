import {useContext} from 'react';
import { OrientationContext } from '../contexts/OrientationContext';




const OptionButtons =(props)=>{

    const Orientation = useContext(OrientationContext)

    const LeftOptionBigButtonStyle = {
        flex: '1',
        width: Orientation==='horizontal'? '80px' : '100vw', 
        height : Orientation==='horizontal'? '100vh' : '75px',
        boxSizing: 'border-box',
        verticalAlign: 'middle', 
        boxShadow: Orientation==='horizontal'? '5px 5px 5px 5px rgba(0, 0, 0, .1)' : '0px 0px 0px 0px rgba(0, 0, 0, .1)',
        borderWidth: '1px',
        borderStyle : 'solid',
        borderColor:'black',
  
      
    
      }
    


    return (
        <div  style={{height: '100%', display:'flex', flexDirection:  Orientation==='horizontal' ? 'column' : 'row'  }} >

                   <button  onClick={props.CreateModelOption} style={LeftOptionBigButtonStyle}><img style={{width:'100%', height:'70%', objectFit : 'contain'}} src={'../symbols/create_mod.png'}></img></button>
                    <button  onClick={props.DownloadsOption} style={LeftOptionBigButtonStyle}><img style={{width:'100%', height:'70%', objectFit : 'contain'}} src={'../symbols/download.png'} ></img></button>

        </div>
    )
}
export default  OptionButtons