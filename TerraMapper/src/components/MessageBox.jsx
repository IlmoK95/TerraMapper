import '../index.css';
import { useEffect, useState } from 'react';


const MessageBox =(props)=>{

   const [showMessage, setShowMessage] = useState(false)



   useEffect(()=>{
    if((props.message && props.pending===false) ){
        setShowMessage(true)
        setTimeout(() => {
            setShowMessage(false)
          }, 5000)
    }else if (props.message && props.pending){
        setShowMessage(true)
    }else if (!props.ThreeDReady){
        setShowMessage(true)
    }
    
    }, [props.message, props.pending])


    return (
    <div style = {{ display : showMessage? 'block' : 'none'}}>
        <div style = {props.layoutStyle} >     
      
                <span>{props.message}</span>  

        </div>
    </div>
    )
}
export default MessageBox