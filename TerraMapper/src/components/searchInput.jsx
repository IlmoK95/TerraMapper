import React, { useEffect } from 'react';
import { useContext } from 'react';
import { VisibilityContext } from '../contexts/VisibilityContext';


const SearchInput =(props)=>{

    const visibility = useContext( VisibilityContext)

    const listStyle  = { 
                        borderWidth : '1px',
                        borderStyle : 'solid', 
                        borderColor:'black',
                        display : props.autoSuggestions.length > 0 ? 'block' : 'none',
                        listStyle : 'none', background : 'white', 
                        height : 'fit-content',
                        width : '50vw', 
                        right : '0',
                        marginTop : '0%',
                        margin: 'auto',
                        borderRadius : ' 0px 0px 10px 10px', 
                        fontSize:'15px',
                        overflow : 'hidden',
                        paddingLeft : '0',
                        boxShadow: '5px 5px 2px 1px rgba(0, 0, 0, .2)',
    

            
                      }

    const listElStyle  = { 
                        borderWidth : '1px 0px 0px 0px',
                        width : '100%',
                        borderStyle : 'solid', 
                        borderColor:'black',
                        padding : '10px',
                        marginLeft : '0%',
                         
                      }

    const SearchBarBut1  = { 

                   
                        height: '45px',
                        width: 'fit-content',
                        fontSize:'20px',
                        paddingLeft: '1vw',
                        paddingRight: '1vw',
                        borderRadius : ' 0px 22px 22px 0px',
                        boxShadow: '5px 5px 2px 1px rgba(0, 0, 0, .2)',
    
                      }

    const SearchBarBut2  = { 

                   
                        height: '45px',
                        width: 'fit-content',
                        fontSize:'20px',
                        paddingLeft: '1vw',
                        paddingRight: '1vw',
                        borderRadius : ' 22px 0px 0px 22px',
                        boxShadow: '5px 5px 2px 1px rgba(0, 0, 0, .2)',
    
                      }


     const SearchBarBut3  = { 

                        height: '45px',
                        fontSize:'20px',
                        width: '120px',
                        borderRadius : ' 22px 22px 22px 22px',
                        paddingRight : '10px',
                        paddingLeft : '10px',
                        boxShadow: '5px 5px 2px 1px rgba(0, 0, 0, .2)',
    
                      }

    const inputStyle  = {
                         height:'40px',
                         width:'50vw',                 
                         fontSize:'15px',
                         borderStyle : 'solid',
                         boxShadow: '5px 5px 2px 1px rgba(0, 0, 0, .2)'
                        }
    const searchHidden = { 
                        position: 'absolute',
                        display : visibility.searchVisible || visibility.show3D ? "none" :"block",
                        height:'fit-content',
                        width:'fit-content',
                        margin:'10px',
                        left : '50%',
                        transform : 'translate(-50%)'
                    }
    
    const searchBarStyle = {
                        position:'absolute',
                        marginRight:'30px',
                        flexDirection : 'row',
                        zIndex:'3',
                        justifyContent: 'center',
                        display :  visibility.show3D===false && visibility.searchVisible ? "flex" :"none",
                        height:'fit-content', width: '100%', margin:'10px', 
                    }

    
     const ChangeBackGround =(e)=>{
        e.type==='pointerenter'? e.target.style.backgroundColor = 'rgb(232,232,232)' : e.target.style.backgroundColor= 'rgb(255,255,255)'
     }

    return (
            <div style={{position: 'absolute', zIndex:'110', width :'100%'}}>
                <div id = 'search_visibility_button' style = {searchHidden}>
                    <button style={SearchBarBut3} onClick={props.setSearchVisibleFunc}><img style={{width:'40px', height:'90%', objectFit : 'contain'}} src={'../symbols/search.png'}></img></button>
                </div>
                <div id = 'search' style={searchBarStyle}>

                        <button style={SearchBarBut2} onClick={()=>props.sortInput()}><img style={{width:'40px', height:'90%', objectFit : 'contain'}} src={'../symbols/search.png'}></img></button> 
                        <div>
                            <input id='searchBar' onChange={props.searchFieldinput} type="text" defaultValue='Mount Fuji, Japan' style ={inputStyle}></input>
                            <ul style = {listStyle}>
                                {props.autoSuggestions.map( (loc, index) => {
                                    return <li key = {index} onPointerEnter={ChangeBackGround} onPointerLeave={ChangeBackGround} onClick={()=>props.searchAutoSuggestion(loc)} style = {listElStyle} id = {index}>{loc}</li>
                                })}
                            </ul>
                        </div>
                        <button style={SearchBarBut1} onClick={props.setSearchVisibleFunc}><img style={{width:'40px', height:'90%', objectFit : 'contain'}} src={'../symbols/close.png'}></img></button>     
                </div>
            </div>
            
  
    )
}
export default  SearchInput