import '../index.css';
import { useEffect, useState, useContext } from 'react';
import { OrientationContext } from '../contexts/OrientationContext';


const MessageBox =(props)=>{

    const orientation = useContext(OrientationContext)

   const [showMessage, setShowMessage] = useState(false)

   const MessageBoxStyle = {boxShadow: '5px 5px 2px 1px rgba(0, 0, 0, .2)', 
                            position:'absolute', 
                            borderStyle : 'solid', 
                            borderColor : 'black', 
                            borderWidth : '1px', top: 
                            orientation==='horizontal'? '85%': '40%', 
                            left:'50%',transform:'translate(-50%)',
                            width: 'fit-content', zIndex: "300", 
                            fontSize:'20px', backgroundColor : 'white', 
                            borderRadius : '20px', 
                            padding: '10px',
                            whiteSpace: 'pre-wrap'
                        }

   useEffect(()=>{
    if((props.message && props.pending===false)){
        setShowMessage(true)
        setTimeout(() => {
            setShowMessage(false)
          }, 3000)
    }else if (props.message && props.pending){
        setShowMessage(true)
    }else if (!props.ThreeDReady){
        setShowMessage(true)
    }
    
    }, [props.message, props.pending])


    return (
    <div style = {{ display : showMessage? 'block' : 'none'}}>
        <div style = {MessageBoxStyle} >     
                <span>{props.message}</span>  
        </div>
    </div>
    )
}
export default MessageBox