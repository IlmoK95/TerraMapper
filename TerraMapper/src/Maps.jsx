import React, { useEffect, useRef, useState, useReducer} from 'react';
import H from '@here/maps-api-for-javascript';
import SetDataComp from './components/CreateModelComp';
import ElevationService from './sources/GETelevations'
import SoftSearchService from './sources/GETsoftSearch'
import MsgBox from './components/MessageBox';
import Download from './components/DownloadComp';
import ThreeDview from './components/3Dview';
import VisibilityButton from './components/VisibilityButton';
import MapOptionButtons from './components/MapOptionButtons';
import ThreeDoptionButtons from './components/ThreeDoptionButtons';
import ThreeDinfo from './components/3DInfo';
import Search from './components/searchInput';
import OptionButtons from './components/OptionButtons';
import AutoCompleteService from './sources/GETautoComplete'
import { VisibilityContext } from './contexts/VisibilityContext';
import { OrientationContext } from './contexts/OrientationContext';
import './index.css';





const Map = ( props ) => {


    const limit  = useRef(50000)
    const bottomMid = useRef()
    const rightMid = useRef()
    const resMax = useRef(0.09)
    const resAbsMax = useRef(0.09)
    const mapRef = useRef(null);
    const map = useRef(null);
    const ThreeDRef = useRef(null);
    const APIelevations = useRef([])
    const Resref = useRef(3.5)
    const wgsCoords = useRef([])
    const recRef = useRef(null);
    const outlineRef = useRef(null)
    const platform = useRef(null)
    const { apikey } = props;
    const coordinatesList = useRef([])
    const markerRef = useRef(null)
    const earthRad  = useRef(6371)
    const directX = useRef(null)
    const directY = useRef(null)
    const rectHeight = useRef(null)
    const rectWidth = useRef(null)
    const recGroupRef = useRef(null)
    const TopLeftCorner = useRef(null)
    const BottomRightCorner = useRef(null)
    const behaviorRef  =useRef(null)
    const isMobile = useRef(false)
    const defaultZoom = useRef(12)


    
   

    const [heightDir, setHeight] = useState(0)
    const [widthDir, setWidth] = useState(0)

    const [show3D, setShow3D] = useState(false)
    const [download3D, setDownload3D] = useState(false)
    const [Coords, setWgsCoords] = useState([{data : 'no data'}])
    const [Messages, setMessages] = useState([])
    const [newMod, setShowNewMod] = useState(false)
    const [res, setRes] = useState(3.5)
    const [NewResMax, setResMax] = useState(0.09)
    const [BottomRight, SetBottomRight] = useState(null)
    const [TopLeft, SetTopLeft] = useState(null)
    const [textureDims, setTextureDims] = useState({h : 0, w : 0})
    const [pointAmount, setPointAmount] = useState(0)
    const [pending, setPendingStatus] = useState(false)
    const [currentMax, setCurrentMax] = useState(limit.current)
    const [TopoMod, SetTopoMod] = useState(null)
    const [TextureFile, setTextureFile] = useState(null)
    const [fitToScreen, SetFitToScreen] = useState(false)
    const [Orientation, setOrientation] = useState(window.innerWidth < window.innerHeight? 'vertical' : 'horizontal')
    const [layers, setLayers] = useState(null)
    const [hideLayer, setHideLayer] = useState(false)
    const [showCreateMod, setShowCreateMod] = useState(false)
    const [ThreeDReady, setThreeDReady] = useState(false)
    const [ShowDownloads, setShowDownloads] = useState(false)
    const [ModType, setModType] = useState('detailed')
    const [invalidMes, SetInvalidMes] = useState(false)
    const [invalidPoints, SetInvalidPoints] = useState(false)
    const [showThreeDinfo, setShowThreeDinfo] = useState(false)
    const [modPointAmount, setModPointAmount] = useState(null)
    const [modRes, setModRes] = useState(null)
    const [memUsed, setMemUsed] = useState(null)
    const [searchVisible, setSearchVisible] = useState(null)
    const [searchFieldVal, setSearchFieldVal] = useState(null)
    const [center, setCenter] = useState({lat: 35.3606,lng: 138.7274})
    const [autoSuggestions, setAutoSuggestions] = useState([])


 
    
    //Commonly shared, not component specific CSS styles:
    const BigButtonStyle = { 
                             marginLeft:'10px',
                             marginTop:'10px',
                             fontSize: '15px', 
                             zIndex:'2', 
                             borderColor:'red', 
                             borderWidth: '5px', 
                             borderRadius: '10px', 
                             paddingTop : '10px', 
                             paddingBottom : '10px'
                            }
    
    const Options_Horizontal = {
                                position: 'absolute', 
                                height: "100vh", 
                                width:'fit-content', 
                                left:'0',  zIndex: "400",  
                                display:'flex', 
                                flexDirection:'row'
                              } 
                                
    const Options_Vertical = { 
                               position: 'absolute',
                               width:'100vw',
                               bottom: '0',
                               zIndex: "100",
                               display:'flex',
                               flexDirection:'column-reverse'
                              } 

    
    const OptionTableView = {
                              backgroundColor : 'white',
                              borderStyle : 'solid',borderColor : 'grey',
                              borderWidth : '1px',
                              borderRadius : Orientation==='horizontal'? '0px 20px 20px 0px' : '20px 20px 0px 0px',
                              boxShadow: Orientation==='horizontal'? '15px 15px 15px 15px rgba(0, 0, 0, .1)' : '15px 15px 15px 30px rgba(0, 0, 0, .1)',
                              margin:'auto', width : Orientation==='horizontal'? '20vw' : 'auto',
                              height : Orientation==='horizontal'? '100%' : 'auto' ,
                              paddingRight : '15px',
                              paddingLeft : '15px'
                            }
    

    useEffect(() => {

      let buttons = document.getElementsByTagName('button')
      if(buttons.length === 0) return
      for(let b of buttons){

       b.addEventListener('pointerenter', (e)=>{
          if(e.target.disabled) return
          e.target.style.backgroundColor = 'rgb(210,210,210)'
          console.log('enter')
  
        } ) 
        
        b.addEventListener('pointerleave', (e)=>{
          if(e.target.disabled) return
          e.target.style.backgroundColor = 'rgb(240,240,240)'
  
        } ) 

      }
      

    }, [])


    useEffect(() => {
      if(/|tablet|Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)){
        isMobile.current = true
      }

      if(navigator.userAgent.indexOf('iPhone') > -1 )
        {
            document
              .querySelector("[name=viewport]")
              .setAttribute("content","width=device-width, initial-scale=1, maximum-scale=1");
        }

    }, [])

    useEffect(
      () => {
        if (!map.current) {

          platform.current = new H.service.Platform({ apikey });
          setMessages([`Welcome to use Terra Mapper 🌎`])

          const engineType = H.Map.EngineType['WEBGL']

          const defaultLayers = platform.current.createDefaultLayers({
            engineType: engineType
        });

        setLayers(defaultLayers)

        const newMap = new H.Map(
          document.getElementById("myMap"),
          defaultLayers.raster.satellite.xbase, {
              engineType: engineType,
              zoom: defaultZoom.current,
              pixelRatio: window.devicePixelRatio,
              center: center
          });
          
          const behavior = new H.mapevents.Behavior(
            new H.mapevents.MapEvents(newMap)
          )
          behaviorRef.current = behavior
          map.current = newMap;
          markerRef.current = new H.map.Group();
          map.current.addObject(markerRef.current)
          behaviorRef.current.disable(H.mapevents.Behavior.Feature.TILT | H.mapevents.Behavior.Feature.HEADING)
          createResizableRect()
        }
  
      },

      [apikey]
    );


useEffect(()=>{
      window.addEventListener('resize', resizeMap )    
      
      return ()=>  window.removeEventListener('resize', resizeMap )})



useEffect(()=>{
        window.addEventListener('fetch', logMethod )    
        
        return ()=>  window.removeEventListener('fetch', logMethod )})




const logMethod =(event)=>{

  console.log(event.request.method)


}






useEffect(()=>{
  resizeInputField()
 
}, [searchVisible, showCreateMod, ShowDownloads, Orientation])


const resizeMap=()=>{
      map.current.getViewPort().resize()
      resizeInputField()      
}


const resizeInputField =()=>{

  let search = document.getElementById('search')

  if(Orientation==='horizontal' && (showCreateMod || ShowDownloads) && searchVisible){

    let percentage = (document.getElementById('Options_Left').offsetWidth / window.innerWidth) * 100 
    search.style.left = `${percentage}%`
    search.style.transform = 'translate(0%)'
    search.style.width = `${window.innerWidth - document.getElementById('Options_Left').offsetWidth}px`
 
  }else{

    search.style.left = `50%`
    search.style.transform = `translate(-50%)`

  }
}



 const getElevationData=()=>{

      setPendingStatus(true)
      wgsCoords.current = []
      APIelevations.current = []
      setWgsCoords([{data : 'pending data...'}])
  
      if (coordinatesList.current) {
        let lat = []
        let lng = []
        let pointAmount = 0
        coordinatesList.current.forEach( (coord, index)=>{

          lat.push(coord.lat)
          lng.push(coord.lng)
          pointAmount += 1
  
  
        }) 

        //number of API calls:
        let length = pointAmount / 100

        let APICalls = 1
        if (length >= 1) {
          APICalls = Math.ceil(length)
        }
        
        let start = 0
        let end = 100
        setNewMessage([`loading...`])
        APICall(start, end, APICalls, 0, lat, lng, pointAmount)
      
      }


function APICall (start, end, APIcallNmb, call, lat, lng, pointAmount){

          let APICallCoords_lat = lat.slice(start, end)
          let APICallCoords_lng = lng.slice(start, end)

          ElevationService
          .GetElevationData(APICallCoords_lat, APICallCoords_lng)
          .then(response => {

            let data = response.data.elevation
            let array = []
            
            for (let i = 0; i <  APICallCoords_lat.length; i++){
              array.push({
                                        lat: APICallCoords_lat[i],
                                        lng: APICallCoords_lng[i],
                                        elevation: data[i]
                      })
            }

            wgsCoords.current =  wgsCoords.current.concat(array)
     
          })
          .catch(error => {
            
            setPendingStatus(false)
            setNewMessage([' ',`❌ Loading elevation data failed: ${error.message}`])
          })
          .finally( ()=>{

              start += 100
              end += 100
              call++ 
              let percentage = Math.floor((call / APIcallNmb)*100)
              let loadSign1 = '🔄'
              let loadSign2 = '🔃'
              setNewMessage([`${percentage % 4 === 0 ? loadSign1 : loadSign2} loading data - ${percentage}%`])

            if ( percentage >= 100){

               setWgsCoords(wgsCoords.current)
               setPendingStatus(false)
               showNewMod()
               setNewMessage([`✅ Data loaded.`])
               setNewMessage([`Creating 3D...`])
     
            }
            else {             
              APICall(start, end, APIcallNmb, call, lat, lng, pointAmount)
            }
          })}

}




const createResizableRect=()=> {

      var center_x = window.innerWidth / 2
      var center_y = window.innerHeight / 2

      var right_x = center_x + 150
      var left_x = center_x - 150 

      var bottom_y = center_y + 150
      var top_y = center_y - 150

      var right_bottom_wgs =  map.current.screenToGeo(right_x ,bottom_y)
      var left_top_wgs = map.current.screenToGeo(left_x ,top_y)


      var rect =  new H.map.Rect(
            new H.geo.Rect(left_top_wgs.lat, left_top_wgs.lng, right_bottom_wgs.lat, right_bottom_wgs.lng),
            {
              style: {fillColor: 'rgba(255, 255, 255, 0.3)', lineWidth: 0}
            }
          ),
          rectOutline = new H.map.Polyline(
            rect.getGeometry().getExterior(),
            {
              style: {lineWidth: 6, strokeColor: 'rgba(255, 0, 0, 0.5)', fillColor: 'rgba(0, 0, 0, 0)', lineCap: 'square', padding: '3px'}
            }
          );
        /*  recRef.current = rect
         outlineRef.current = rectOutline */
         var rectGroup = new H.map.Group({
            volatility: true, // mark the group as volatile for smooth dragging of all it's objects
            objects: [rect, rectOutline]
          }),
          rectTimeout;
    
      // ensure that the objects can receive drag events
      recRef.current = rect
      outlineRef.current = rectOutline
      rect.draggable = true;
      rectOutline.draggable = true;

      var  currentGeoRect = rect.getGeometry().getBoundingBox();
      var objectTopLeftScreen = map.current.geoToScreen(currentGeoRect.getTopLeft());
      var objectBottomRightScreen = map.current.geoToScreen(currentGeoRect.getBottomRight());

      TopLeftCorner.current = objectTopLeftScreen
      BottomRightCorner.current = objectBottomRightScreen
      CalcMaxPointAmount()
      setToMaxRes()
      CalcPointAmount(false)

      // extract first point of the rect's outline polyline's LineString and
      // push it to the end, so the outline has a closed geometry
      rectOutline.getGeometry().pushPoint(rectOutline.getGeometry().extractPoint(0));
    
      // add group with rect and it's outline (polyline)
      recGroupRef.current = rectGroup
      map.current.addObject( recGroupRef.current);
    
      // event listener for rectangle group to show outline (polyline) if moved in with mouse (or touched on touch devices)
      rectGroup.addEventListener('pointerenter', function(event) {
    
        
        var currentStyle = rectOutline.getStyle(),
            newStyle = currentStyle.getCopy({
              strokeColor: 'rgb(255, 0, 0)',
              padding: '10px'
            });
    
        if (rectTimeout) {
          clearTimeout(rectTimeout);
          rectTimeout = null;
        }
        // show outline
        rectOutline.setStyle(newStyle);
        document.body.style.cursor = 'move';
      }, true);
    
      // event listener for rectangle group to hide outline if moved out with mouse (or released finger on touch devices)
      // the outline is hidden on touch devices after specific timeout
      rectGroup.addEventListener('pointerleave', function(event) {

        var currentStyle = rectOutline.getStyle(),
            newStyle = currentStyle.getCopy({
              strokeColor: 'rgba(255, 0, 0, 0.5)',
              padding: '10px'
            }),
            timeout = (event.currentPointer.type === 'touch') ? 1000 : 0;
    
          rectTimeout = setTimeout(function() {
            rectOutline.setStyle(newStyle);
          }, timeout);
    
    
        document.body.style.cursor = 'default';
      }, true);

    
      // event listener for rectangle group to change the cursor if mouse position is over the outline polyline (resizing is allowed)
      rectGroup.addEventListener('pointermove', function(event) {
     
        let [X, Y] = screen_XY(event)
        if(!X || !Y){
          return
        }
        var  objectTopLeftScreen = map.current.geoToScreen(event.target.getGeometry().getBoundingBox().getTopLeft()),
            objectBottomRightScreen = map.current.geoToScreen(event.target.getGeometry().getBoundingBox().getBottomRight()),
            draggingType = ''

    
        // only set cursor and draggingType if target is outline polyline
        if (event.target === rect) {
          document.body.style.cursor = 'move';
        }
    
        // change document cursor depending on the mouse position
        if (X < (objectTopLeftScreen.x + 4)) {
          document.body.style.cursor = 'ew-resize'; // mouse position is at left side
          draggingType = 'left';
        } else if (X> (objectBottomRightScreen.x - 4)) {
          document.body.style.cursor = 'ew-resize'; // mouse position is at right side
          draggingType = 'right';
        } else if (Y < (objectTopLeftScreen.y + 4)) {
          document.body.style.cursor = 'ns-resize'; // mouse position is at top side
          draggingType = 'top';
        } else if (Y > (objectBottomRightScreen.y - 4)) {
          document.body.style.cursor = 'ns-resize'; // mouse position is at the bottom side
          draggingType = 'bottom';
        } else {
          document.body.style.cursor = 'move'
        }
    
        if (draggingType === 'left') {
          if (Y < (objectTopLeftScreen.y + 4)) {
            document.body.style.cursor = 'nwse-resize'; // mouse position is at the top-left corner
            draggingType = 'left-top';
          } else if (Y > (objectBottomRightScreen.y - 4)) {
            document.body.style.cursor = 'nesw-resize'; // mouse position is at the bottom-left corner
            draggingType = 'left-bottom';
          }
        }  else if (draggingType === 'right') {
          if (Y < (objectTopLeftScreen.y + 4)) {
            document.body.style.cursor = 'nesw-resize'; // mouse position is at the top-right corner
            draggingType = 'right-top';
          } else if (Y > (objectBottomRightScreen.y - 4)) {
            document.body.style.cursor = 'nwse-resize'; // mouse position is at the bottom-right corner
            draggingType = 'right-bottom';
          }
        }
    
        rectGroup.setData({'draggingType': draggingType});
      }, true);


    // Event listener for user resizing the rectangle on mobile / touchscreen
     if(isMobile.current){

      rectOutline.addEventListener('pointerenter', function(event) {

     
        let [X, Y] = screen_XY(event)
        if(!X || !Y){
          return
        }
        var  objectTopLeftScreen = map.current.geoToScreen(event.target.getGeometry().getBoundingBox().getTopLeft()),
            objectBottomRightScreen = map.current.geoToScreen(event.target.getGeometry().getBoundingBox().getBottomRight()),
            draggingType = ''

    
        // only set cursor and draggingType if target is outline polyline
        if (event.target === rect) {
          document.body.style.cursor = 'move';
        }
    
        // change document cursor depending on the mouse position
        if (X < (objectTopLeftScreen.x + 20)) {
          document.body.style.cursor = 'ew-resize'; // mouse position is at left side
          draggingType = 'left';
        } else if (X> (objectBottomRightScreen.x - 20)) {
          document.body.style.cursor = 'ew-resize'; // mouse position is at right side
          draggingType = 'right';
        } else if (Y < (objectTopLeftScreen.y + 20)) {
          document.body.style.cursor = 'ns-resize'; // mouse position is at top side
          draggingType = 'top';
        } else if (Y > (objectBottomRightScreen.y - 20)) {
          document.body.style.cursor = 'ns-resize'; // mouse position is at the bottom side
          draggingType = 'bottom';
        } else {
          document.body.style.cursor = 'move'
        }
    
        if (draggingType === 'left') {
          if (Y < (objectTopLeftScreen.y + 20)) {
            document.body.style.cursor = 'nwse-resize'; // mouse position is at the top-left corner
            draggingType = 'left-top';
          } else if (Y > (objectBottomRightScreen.y - 20)) {
            document.body.style.cursor = 'nesw-resize'; // mouse position is at the bottom-left corner
            draggingType = 'left-bottom';
          }
        }  else if (draggingType === 'right') {
          if (Y < (objectTopLeftScreen.y + 20)) {
            document.body.style.cursor = 'nesw-resize'; // mouse position is at the top-right corner
            draggingType = 'right-top';
          } else if (Y > (objectBottomRightScreen.y - 20)) {
            document.body.style.cursor = 'nwse-resize'; // mouse position is at the bottom-right corner
            draggingType = 'right-bottom';
          }
        }
    
        rectGroup.setData({'draggingType': draggingType});
   
      }, true)

     }

      // disable the map's behavior if resizing started so map doesn't pan in the situation
      // when we try to set rect size to 0 or negative and mouse cursor leaves the map object
      rectGroup.addEventListener('dragstart', function(event) {

        let [X, Y] = screen_XY(event)
        if(!X || !Y){
          return
        }
        if (event.target === rect) {

          var object = rect

  
      // store the starting geo position


        object.setData({
          startCoord: map.current.screenToGeo(X, Y)
        });
         event.stopPropagation();
        }
      }, true);
    
      // event listener for rect group to resize the geo rect object if dragging over outline polyline
      rectGroup.addEventListener('drag', function(event) {

      let [X, Y] = screen_XY(event)
      if(!X || !Y){
        return
      }
  
      var pointerGeoPoint = map.current.screenToGeo(X, Y);
      var  currentGeoRect = rect.getGeometry().getBoundingBox(),
      objectTopLeftScreen = map.current.geoToScreen(currentGeoRect.getTopLeft()),
      objectBottomRightScreen = map.current.geoToScreen(currentGeoRect.getBottomRight());
        
      if (event.target === rect){
        let [X, Y] = screen_XY(event)
        if(!X || !Y){
            return
        }


        var object = event.target,
        startCoord = object.getData()['startCoord'],
        newCoord = map.current.screenToGeo(X, Y);
  
      // create new Rect with updated coordinates
      if (!newCoord.equals(startCoord)) {
          
          var currentGeoRect = object.getGeometry().getBoundingBox(),
              newTop = currentGeoRect.getTop() + newCoord.lat - startCoord.lat,
              newLeft = currentGeoRect.getLeft() + newCoord.lng - startCoord.lng,
              newBottom = currentGeoRect.getBottom() + newCoord.lat - startCoord.lat,
              newRight = currentGeoRect.getRight() + newCoord.lng - startCoord.lng,
              newGeoRect = new H.geo.Rect(newTop, newLeft, newBottom, newRight);
          // prevent dragging to latitude over 90 or -90 degrees to prevent loosing altitude values
          if (newTop >= 90 || newBottom <= -90) {
            return;
          }
  
          object.setBoundingBox(newGeoRect);
          outlineLinestring = rect.getGeometry().getExterior();
          outlineLinestring.pushPoint(outlineLinestring.extractPoint(0));
          rectOutline.setGeometry(outlineLinestring);
          object.setData({
            startCoord: newCoord
          });

      }
      event.stopPropagation();
        }
    

        if (event.target instanceof H.map.Polyline) {
          var currentTopLeft = currentGeoRect.getTopLeft(),
              currentBottomRight = currentGeoRect.getBottomRight(),
              newGeoRect,
              outlineLinestring;
    
          // update rect's size depending on dragging type:
          switch(rectGroup.getData()['draggingType']) {
            case 'left-top':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lng >= currentBottomRight.lng || pointerGeoPoint.lat <= currentBottomRight.lat) {
                return;
              }
              newGeoRect = H.geo.Rect.fromPoints(pointerGeoPoint, currentGeoRect.getBottomRight());
              break;
            case 'left-bottom':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lng >= currentBottomRight.lng || pointerGeoPoint.lat >= currentTopLeft.lat) {
                return;
              }
              currentTopLeft.lng = pointerGeoPoint.lng;
              currentBottomRight.lat = pointerGeoPoint.lat;
              newGeoRect = H.geo.Rect.fromPoints(currentTopLeft, currentBottomRight);
              break;
            case 'right-top':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lng <= currentTopLeft.lng || pointerGeoPoint.lat <= currentBottomRight.lat) {
                return;
              }
              currentTopLeft.lat = pointerGeoPoint.lat;
              currentBottomRight.lng = pointerGeoPoint.lng;
              newGeoRect = H.geo.Rect.fromPoints(currentTopLeft, currentBottomRight);
              break;
            case 'right-bottom':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lng <= currentTopLeft.lng || pointerGeoPoint.lat >= currentTopLeft.lat) {
                return;
              }
              newGeoRect = H.geo.Rect.fromPoints(currentGeoRect.getTopLeft(), pointerGeoPoint);
              break;
            case 'left':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lng >= currentBottomRight.lng) {
                return;
              }
              currentTopLeft.lng = pointerGeoPoint.lng;
              newGeoRect = H.geo.Rect.fromPoints(currentTopLeft, currentGeoRect.getBottomRight());
              break;
            case 'right':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lng <= currentTopLeft.lng) {
                return;
              }
              currentBottomRight.lng = pointerGeoPoint.lng;
              newGeoRect = H.geo.Rect.fromPoints(currentGeoRect.getTopLeft(), currentBottomRight);
              break;
            case 'top':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lat <= currentBottomRight.lat) {
                return;
              }
              currentTopLeft.lat = pointerGeoPoint.lat;
              newGeoRect = H.geo.Rect.fromPoints(currentTopLeft, currentGeoRect.getBottomRight());
              break;
            case 'bottom':
              // we don't allow resizing to 0 or to negative values
              if (pointerGeoPoint.lat >= currentTopLeft.lat) {
                return;
              }
              currentBottomRight.lat = pointerGeoPoint.lat;
              newGeoRect = H.geo.Rect.fromPoints(currentGeoRect.getTopLeft(), currentBottomRight);
              break;
          }
    
          // set the new bounding box for rect object
          if(newGeoRect===undefined){
            return
          }
          rect.setBoundingBox(newGeoRect);
    
          // extract first point of the outline LineString and push it to the end, so the outline has a closed geometry
          outlineLinestring = rect.getGeometry().getExterior();
          outlineLinestring.pushPoint(outlineLinestring.extractPoint(0));
          rectOutline.setGeometry(outlineLinestring);
    
          // prevent event from bubling, so map doesn't receive this event and doesn't pan
          event.stopPropagation();
        }
        var currentGeoRect = rect.getGeometry().getBoundingBox();
        var objectTopLeftScreen = map.current.geoToScreen(currentGeoRect.getTopLeft());
        var objectBottomRightScreen = map.current.geoToScreen(currentGeoRect.getBottomRight());

        TopLeftCorner.current = objectTopLeftScreen
        BottomRightCorner.current = objectBottomRightScreen
        CalcMaxPointAmount()
        setToMaxRes()
        CalcPointAmount(true)
      }, true);
    
      // event listener for rect group to enable map's behavior
      rectGroup.addEventListener('dragend', function(event) {
        
        // enable behavior
        behaviorRef.current.enable();
        behaviorRef.current.disable(H.mapevents.Behavior.Feature.TILT | H.mapevents.Behavior.Feature.HEADING)
        var  currentGeoRect = rect.getGeometry().getBoundingBox();
        var objectTopLeftScreen = map.current.geoToScreen(currentGeoRect.getTopLeft());
        var objectBottomRightScreen = map.current.geoToScreen(currentGeoRect.getBottomRight());

        TopLeftCorner.current = objectTopLeftScreen
        BottomRightCorner.current = objectBottomRightScreen
        CalcMaxPointAmount()
        setToMaxRes()
        CalcPointAmount(true)

      }, true);
}


useEffect(()=>{ 
  map.current.addEventListener('mapviewchangeend', setMeasurementMarkers )    
  return ()=>  map.current.removeEventListener('mapviewchangeend', setMeasurementMarkers )
}) 


useEffect(()=>{
  window.addEventListener('resize', setStyles)
  return ()=> window.removeEventListener('resize', setStyles)
})


const setStyles=()=>{

    setOrientation(checkOrientation())
}

const checkOrientation=()=>{
  if (window.innerWidth < window.innerHeight){
    return 'vertical'
  }
  return 'horizontal'

}


const autoComplete =(searchFieldVal)=>{

  var autoSuggestions = []
  AutoCompleteService
                    .GetAutoComplete(searchFieldVal, props.apikey)
                    .then( response =>{
                      autoSuggestions = response.data.items.map( loc => { return loc.title} )
                      setAutoSuggestions(autoSuggestions)

                    })
                    .catch(error => setNewMessage([' ',`❌ Search failed: ${error.message}`]))
}

const reformat1 =(coord)=>{

  const reformatPos=( pos, posName )=>{

      let multiPlier = /S|W/.test(pos) ? -1 : 1
      let posChunks = pos.split(/[°′″NSEW]/)

      
      posChunks = posChunks.filter(n => n!== '')
      
      let reformattedCoord = null
      if( posChunks.length === 1 ){
        
        reformattedCoord =  Number(posChunks[0]) * multiPlier

        
      }else if( posChunks.length===3 ){
        
         reformattedCoord = (Number(posChunks[0]) + (Number(posChunks[1]) * 60 + Number(posChunks[2])) / 3600) * multiPlier
         
      }

      if (posName === 'lat'){

        reformattedCoord = reformattedCoord > 90 || reformattedCoord < -90 ? null : reformattedCoord

      }else{

        reformattedCoord = reformattedCoord > 180 || reformattedCoord < -180 ? null : reformattedCoord
        
      }
      
      return reformattedCoord
  }

  let latLng = coord.split(" ")
  
  let reformattedCoords = {lat: reformatPos(latLng[0], 'lat'), lng: reformatPos(latLng[1], 'lng')}
  reformattedCoords = reformattedCoords.lat === null || reformattedCoords.lng === null ? null : reformattedCoords
  return reformattedCoords
}



const sortInput =(searchTarget = searchFieldVal)=> {

  //40°26′46″N 079°58′56″W
  const regex1 = { exp : /^[0-9]{1,2}(°)[1-9]{1,2}(′)[1-9]{0,2}(″N|″S)(\s)[0-9]{1,3}(°)[0-9]{1,3}(′)[0-9]{1,2}(″E|″W)/dgi,
    func : reformat1
  }
    
  //402646302N 0795855903W
  //formatting function doesnt exist for this wgs expression yet
  const regex3 = { exp : /^[0-9]{1,}(N|S)(\s)[0-9]{1,}(E|W)/dgi,
    func : reformat1
  }

  //40.446195N 79.982195W
  const regex4 = { exp : /^[0-9]{1,2}(\.)[0-9]{1,}(N|S)(\s)[0-9]{1,3}(\.)[0-9]{1,}(E|W)/dgi,
    func : reformat1
  }

  //40N 79W
  const regex5 = { exp : /^[0-9]{1,2}(N|S)(\s)[0-9]{1,3}(E|W)/dgi,
    func : reformat1
  }  
    
  //40.446195 -79.982195
  const regex6 = { exp : /^(-){0,1}[0-9]{1,2}(\.)[0-9]{1,}(\s)(-){0,1}[0-9]{1,3}(\.)[0-9]{0,}/dgi,
    func : reformat1
  } 

  //40 -79
  const regex7 = { exp : /^(-){0,1}[0-9]{1,2}(\s)(-){0,1}[0-9]{1,3}/dgi,
    func : reformat1
  } 

  const regexArray = [regex1, regex4, regex5, regex6, regex7]

  //check whether the query is supported coordinate expression:
  let isCoordinate = false
  regexArray.forEach(regEx =>{
    
    var res = regEx.exp.test(searchTarget)
    if(res){
      isCoordinate = true
      var targetCoord = regEx.func(searchTarget)
      !targetCoord? setNewMessage([`❌ unrecognized coordinate`]) : setCenter( targetCoord )
      setAutoSuggestions([]) 
      return
    }
  })
  //if query is not a recognised coord, value is searched as an address:
  if (!isCoordinate){
    softSearch()
  }

}

const softSearch = (searchTarget = searchFieldVal)=>{

  SoftSearchService
              .GetSoftSearch(searchTarget, props.apikey)
              .then( response => {
                     if (response.data.items.length > 0) {
                        setCenter( response.data.items[0].position ) 
                        setAutoSuggestions([])            
                      }
                      else{
                      setNewMessage([`❌ unrecognized location`])
                      } 
                    })
                                
              .catch(error => setNewMessage([' ',`❌ Search failed: ${error.message}`]))
}

useEffect(()=>{

  if(map.current){
    map.current.setCenter(center)
    map.current.setZoom(defaultZoom.current)
    reCenterBox()
  }

},[center])


const setToMaxRes =()=>{

  if (Resref.current < resMax.current){
    Resref.current = resMax.current
    setRes(Resref.current)
  }

}

const screen_XY =(event)=>{
  return [event.currentPointer.viewportX, event.currentPointer.viewportY]
}

  //straight line distance between the coordinates
const DirectDistance=(coord_1, coord_2)=>{

    let angle1 = coord_1 * Math.PI / 180
    let angle2 = coord_2 * Math.PI / 180

    var r = earthRad.current
    let angle = angle1 - angle2
    let dist = Math.sqrt(2*Math.pow(r, 2) - 2 * Math.pow(r, 2) * Math.cos(angle))

    return dist

  }


  const SetTexture_Size=(h, w)=>{

    let h_new
    let w_new

    if (h >= w){
      h_new = 2048
      w_new = Math.floor(2048 / (h / w))

    }else{
      w_new = 2048
      h_new = Math.floor(2048 * (h / w))
    }

    setTextureDims({h : h_new, w : w_new})
  }

  const CalcMaxPointAmount=()=>{

    rectHeight.current = BottomRightCorner.current.y - TopLeftCorner.current.y 
    rectWidth.current = BottomRightCorner.current.x - TopLeftCorner.current.x

    

    let BottomRightCoord = map.current.screenToGeo(BottomRightCorner.current.x , BottomRightCorner.current.y)
    let TopLeftCoord = map.current.screenToGeo(TopLeftCorner.current.x , TopLeftCorner.current.y )

    let h =  DirectDistance(BottomRightCoord.lat, TopLeftCoord.lat)
    let w =  h * (rectWidth.current / rectHeight.current)

    SetInvalidMes(false)
    if(w <= 0 || h<= 0 || isNaN(h) || isNaN(h)){
      SetInvalidMes(true) 
      setNewMessage([`❌ Invalid dimensions : h = ${isNaN(h)? h : Math.floor(h)}, w = ${isNaN(w)? w : Math.floor(w)} km`]) 
    }

    let A_limit = 50000 /  Math.pow(1 / resAbsMax.current, 2 )
    let A = h * w
    let rezNew

    if (A > A_limit){

      rezNew = Math.sqrt(A / 50000)  

    }else{
      rezNew = resAbsMax.current
    }
  
    resMax.current = rezNew
    setResMax(rezNew)


    let Y_limit = h / rezNew
    let X_limit = w / rezNew

    let y_start = TopLeftCorner.current.y 
    let y_max = BottomRightCorner.current.y
    let y_step = rectHeight.current / Y_limit

    let x_start = TopLeftCorner.current.x
    let x_max =  BottomRightCorner.current.x
    let x_step = rectWidth.current / X_limit

    let columnRange = Math.abs(x_max - x_start)
    let rowRange = Math.abs(y_max - y_start)

    let columns = Math.ceil(columnRange / x_step + 1)
    let rows = Math.ceil(rowRange / y_step + 1)

    let pointAmount = columns * rows - 1


    setCurrentMax(pointAmount)

    

  }

  const CalcPointAmount =()=>{

    rectHeight.current = BottomRightCorner.current.y - TopLeftCorner.current.y 
    rectWidth.current = BottomRightCorner.current.x - TopLeftCorner.current.x

    let BottomRightCoord = map.current.screenToGeo(BottomRightCorner.current.x , BottomRightCorner.current.y)
    let TopLeftCoord = map.current.screenToGeo(TopLeftCorner.current.x , TopLeftCorner.current.y )


    let h =  DirectDistance(BottomRightCoord.lat, TopLeftCoord.lat)
    let w =  h * (rectWidth.current / rectHeight.current)

    let Y_limit = h / Resref.current
    let X_limit = w / Resref.current


    let y_start = TopLeftCorner.current.y 
    let y_max = BottomRightCorner.current.y
    let y_step = rectHeight.current / Y_limit

    
    let x_start = TopLeftCorner.current.x
    let x_max =  BottomRightCorner.current.x
    let x_step = rectWidth.current / X_limit

    let columns = Math.ceil(Math.abs(x_max - x_start) / x_step) + 1
    let rows = Math.ceil(Math.abs(y_max - y_start) / y_step) + 1
    

    let pointAmount = columns * rows - 1
    setPointAmount(pointAmount)
    SetInvalidPoints(false)
    if (pointAmount <= 0){
      SetInvalidPoints(true)
      setNewMessage([`❌ Invalid point amount: ${pointAmount}`])
    }

    getDistances(TopLeftCorner.current, BottomRightCorner.current)

    var Y_midPoint_1 =BottomRightCorner.current.y - (rectHeight.current / 2)
    var X_midPoint_2 = BottomRightCorner.current.x - (rectWidth.current / 2)

    var Y_midPoint_2 = BottomRightCorner.current.y
    var X_midPoint_1 = BottomRightCorner.current.x 

    bottomMid.current = map.current.screenToGeo(X_midPoint_2 ,Y_midPoint_2)
    rightMid.current = map.current.screenToGeo(X_midPoint_1 ,Y_midPoint_1)
    
    //add markers showing the rectangle measurements
    setMeasurementMarkers()


    return [y_start, y_max, y_step, x_start, x_max, x_step]

  }

  const getDate =()=>{
    const currentdate = new Date();
    const time = "[ " 
                + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds()
                +" ]" 
    return time
  }

  /* const resizeInputField =()=>{

    var inputWidth = document.getElementById('Options_Left').offsetWidth
    setinputWidth(inputWidth)

  }
 */


  const SetMeasurements=(h, w)=>{
    setHeight(h)
    setWidth(w)
  }

  const SetLngLat=()=>{

      setThreeDReady(false)
      setModRes(Resref.current)

      while (coordinatesList.current.length > 0) {
        coordinatesList.current.pop();
      }

     let [y_start, y_max, y_step, x_start, x_max, x_step] = CalcPointAmount()

     let BottomRightCoord = map.current.screenToGeo(BottomRightCorner.current.x , BottomRightCorner.current.y)
     let TopLeftCoord = map.current.screenToGeo(TopLeftCorner.current.x , TopLeftCorner.current.y )

     SetTopLeft(TopLeftCoord)
     SetBottomRight(BottomRightCoord)

     let texture_h = BottomRightCorner.current.y - TopLeftCorner.current.y 
     let texture_w = BottomRightCorner.current.x - TopLeftCorner.current.x

     SetTexture_Size(texture_h, texture_w)

     let model_h =  DirectDistance(BottomRightCoord.lat, TopLeftCoord.lat)
     let model_w =  model_h * (rectWidth.current / rectHeight.current)

     SetMeasurements(model_h, model_w)

     let grid_X_axises = []
     let grid_Y_axises = []

     for (let y = y_start; y <= y_max ; y+=y_step){
       
        let grid_X_axis  =[]
        grid_X_axis.push(map.current.screenToGeo(x_start , y))
        grid_X_axis.push(map.current.screenToGeo(x_max , y))

        grid_X_axises.push(grid_X_axis)

        if (y + y_step > y_max){
          let last_X_axis  =[]
          last_X_axis.push(map.current.screenToGeo(x_start , y_max))  
          last_X_axis.push(map.current.screenToGeo(x_max , y_max))
          grid_X_axises.push(last_X_axis)  
        }
        

        for (let x = x_start; x <= x_max ; x+=x_step){ 

          let grid_Y_axis  =[] 
          grid_Y_axis.push(map.current.screenToGeo(x , y_start))
          grid_Y_axis.push(map.current.screenToGeo(x , y_max))
          grid_X_axises.push(grid_Y_axis)

          if (x + x_step > x_max){
            let last_Y_axis  =[]
            last_Y_axis.push(map.current.screenToGeo(x_max , y_start))  
            last_Y_axis.push(map.current.screenToGeo(x_max , y_max))
            grid_Y_axises.push(last_Y_axis)  
          }

          var coord = map.current.screenToGeo(x , y)
          coordinatesList.current.push(coord)
    

          if (x + x_step > x_max){
            var coord_last = map.current.screenToGeo(x_max, y)
            coordinatesList.current.push(coord_last)
        
          }
          if (y + y_step > y_max){
            var coord_last_2 = map.current.screenToGeo(x, y_max)
            coordinatesList.current.push(coord_last_2)
          
          } 

          if (y + y_step > y_max && x + x_step > x_max){
            var coord_last_3 = map.current.screenToGeo(x_max, y_max)
            coordinatesList.current.push(coord_last_3)
        
          } 
        }   
      } 

      getElevationData()

    }

const setNewMessage=(message)=>{

  setMessages(message)

}


  const setMeasurementMarkers=()=>{

      markerRef.current.forEach(element => {
        markerRef.current.removeObject(element)
      })

      var height = document.createElement('div')
      height.style.backgroundColor = 'white'
      height.style.borderRadius = '5px'
      height.innerHTML = Math.floor(directY.current)+'km'

      var width = document.createElement('div')
      width.style.backgroundColor = 'white'
      width.style.borderRadius = '5px'
      width.innerHTML = Math.floor(directX.current)+'km'

      var heightIcon = new H.map.DomIcon(height)
      var heightMarker = new H.map.DomMarker(rightMid.current , {icon: heightIcon})
      
      var widthIcon = new H.map.DomIcon(width)
      var widthMarker = new H.map.DomMarker(bottomMid.current, {icon: widthIcon})

      var lat = rightMid.current.lat
      var lng = bottomMid.current.lng
      var center = {lat:lat, lng:lng}

      var image = document.createElement('img')
      var imgDims = 25
      image.src = "../symbols/cross.png"
      image.style.width = `${imgDims}px`
      image.style.height = `${imgDims}px`
      image.style.cursor = 'move'
      image.style.pointerEvents = 'none'

      var centerXY = map.current.geoToScreen(center);

      centerXY.x = centerXY.x - (imgDims / 2)
      centerXY.y = centerXY.y - (imgDims / 2)

      let MidCoord = map.current.screenToGeo(centerXY.x , centerXY.y)

      var centerIcon = new H.map.DomIcon(image)
      var CenterMarker = new H.map.DomMarker(MidCoord, {icon: centerIcon})
      CenterMarker.draggable = true

      markerRef.current.addObject(widthMarker)
      markerRef.current.addObject(heightMarker)
      markerRef.current.addObject(CenterMarker)

  }

  const getDistances=(TopLeft, BottomRight)=>{

      if (coordinatesList.current) {

        let BottomRightCoord = map.current.screenToGeo(BottomRight.x , BottomRight.y)
        let TopLeftCoord = map.current.screenToGeo(TopLeft.x , TopLeft.y)

        let h =  DirectDistance(BottomRightCoord.lat, TopLeftCoord.lat)
        let w = h * (rectWidth.current / rectHeight.current)

        directX.current = w
        directY.current = h
 
      }

  } 

  const showNewMod =()=>{
      setShowNewMod(!newMod)
  }

  const set_Resolution=(e)=>{

      Resref.current = Math.abs(e.target.value)
      setRes(Math.abs(e.target.value))
      updateResolution()
     
  }


  const ThreeDfitToScreen=()=>{
      SetFitToScreen(!fitToScreen)
  }

  const ChangeModTypeFunc=()=>{
      if(ModType==='detailed'){
        setModType('.obj')
      }else{
        setModType('detailed')
      }  
  }

  const searchFieldinput=(e)=>{
      var inputVal = e.target.value
      setSearchFieldVal(inputVal)
      if(inputVal!==''){
        autoComplete(inputVal)
      }else{
        setAutoSuggestions([])
      }

  }


  const searchAutoSuggestion =(autosuggestion)=>{
    
      const searchBar = document.getElementById("searchBar")
      searchBar.value = autosuggestion
      setSearchFieldVal(autosuggestion)
      softSearch(autosuggestion)
      setAutoSuggestions([])

  }

  const updateResolution=()=>{

        var  currentGeoRect = recRef.current.getGeometry().getBoundingBox();
        var objectTopLeftScreen = map.current.geoToScreen(currentGeoRect.getTopLeft());
        var objectBottomRightScreen = map.current.geoToScreen(currentGeoRect.getBottomRight());
        TopLeftCorner.current =  objectTopLeftScreen
        BottomRightCorner.current = objectBottomRightScreen
        CalcMaxPointAmount()
        CalcPointAmount(false)
 

  }

  const ThreeDVisibility = ()=>{
      setShow3D(!show3D)
     
  }


  const DownloadThreeD =()=>{
      setDownload3D(!download3D)

  }


  const reCenterBox=()=>{

      recGroupRef.current.forEach(element => {
        recGroupRef.current.removeObject(element)
      })
      
      markerRef.current.forEach(element => {
        markerRef.current.removeObject(element)
      })

      createResizableRect(map.current, behaviorRef.current)
      
  }


  const showNormalMapLayer=()=>{

      hideLayer?  map.current.removeLayer(layers.raster.terrain.map) : map.current.addLayer(layers.raster.terrain.map)
      setHideLayer(!hideLayer)


  }

  const DownloadsOption=()=>{
      setShowDownloads(!ShowDownloads)
      setShowCreateMod(false)
  }

  const show3DinfoFunc =()=>{
      setShowThreeDinfo(!showThreeDinfo)
  }

  const CreateModelOption=()=>{
      setShowCreateMod(!showCreateMod)
      setShowDownloads(false)

  }




  
  const setSearchVisibleFunc=()=>{
      setSearchVisible(!searchVisible)
  }

    return (
      <div >

        <div id='myMap' style={ {userSelect : 'none', WebkitUserSelect: 'none', width: "100vw", height: '100vh',  zIndex: show3D?"-1":"1", position: 'absolute'  }} ref={mapRef} />

        <VisibilityContext.Provider value = {{show3D, ShowDownloads, showCreateMod, showThreeDinfo, searchVisible, hideLayer}}>
          <OrientationContext.Provider value = {Orientation}> 
      
              <div id='UI_elements'>

                <MsgBox 
                              message={Messages}
                              pending = {pending}
                              ThreeDReady = {ThreeDReady}
                            >
                </MsgBox>

                <div id='Options_Left' style={ Orientation==='horizontal'? Options_Horizontal : Options_Vertical }>

                   <OptionButtons
                              CreateModelOption = {CreateModelOption}
                              DownloadsOption = {DownloadsOption}>
                  </OptionButtons> 
                  <Download 
                              texture={TextureFile} 
                              getDate = {getDate} 
                              setMessage={setNewMessage} 
                              TopoMod  ={TopoMod} 
                              Coords = {Coords} 
                              pending = {pending} 
                              ref = {wgsCoords}
                              buttonStyle = {BigButtonStyle}
                              backgroundStyle = {OptionTableView}>
                    </Download>
                    <SetDataComp 
                              invalidMes  = {invalidMes}
                              invalidPoints  = {invalidPoints}
                              pointAmount  = {pointAmount} 
                              currentMax = {currentMax} 
                              res  = {res} 
                              pending = {pending} 
                              set_Resolution = {set_Resolution}
                              SetLngLat = {SetLngLat}
                              NewResMax = {NewResMax}
                              resAbsMax = {resAbsMax.current}
                              Coords = {Coords}
                              ThreeDVisibility = {ThreeDVisibility}
                              buttonStyle = {BigButtonStyle}
                              backgroundStyle = {OptionTableView}
                              >
                    </SetDataComp>
          
                </div >

                    <Search                  
                               searchFieldinput = {searchFieldinput}
                               sortInput  = {sortInput}
                               autoSuggestions = {autoSuggestions}
                               searchAutoSuggestion = {searchAutoSuggestion}
                               setSearchVisibleFunc = {setSearchVisibleFunc}>
                    </Search> 
                      
                <div id='Elements_Right' style = {{position: 'absolute',
                                                display : 'flex',
                                                flexWrap : 'wrap',
                                                top:  Orientation==='horizontal'? '50%' : '30%',
                                                transform : 'translate(0%, -50%)', 
                                                right:'0',
                                                zIndex:'100'}}
                    >

                    <ThreeDinfo
                                  memUsed = {memUsed}
                                  modRes = {modRes}
                                  modPointAmount = {modPointAmount}
                                  >           
                    </ThreeDinfo> 
                    <div id='Buttons_Right'>
                      <MapOptionButtons
                                            reCenterBox = {reCenterBox}
                                            showNormalMap = {showNormalMapLayer}
                                            >
                      </MapOptionButtons>  
                      <ThreeDoptionButtons
                                        ThreeDfitToScreen = {ThreeDfitToScreen}       
                                        ModType = {ModType}
                                        ChangeModType = {ChangeModTypeFunc}
                                        showThreeDinfoFunc = {show3DinfoFunc}>                                   
                        </ThreeDoptionButtons>

                        <VisibilityButton   
                                        pending = {pending}
                                        ThreeDVisibility = {ThreeDVisibility}
                                        ThreeDReady  ={ThreeDReady} >
                        </VisibilityButton>
                    </div>

                </div>
              </div>    
              <ThreeDview
                              setModPointAmount = {setModPointAmount}
                              setModRes = {setModRes}
                              setMemUsed = {setMemUsed}
                              modRes = {modRes}
                              setTexture = {setTextureFile}
                              setMessage = {setNewMessage}
                              SetTopoMod = {SetTopoMod}
                              ref={ThreeDRef} 
                              coordinates={Coords} 
                              NewMod = {newMod} 
                              showNewModFunc = {showNewMod} 
                              DownloadFunc = {DownloadThreeD} 
                              Download3DVar = {download3D} 
                              ShowThreeD = {ThreeDVisibility} 
                              dimensionX = {widthDir} 
                              dimensionY = {heightDir}
                              apikey = {apikey}
                              TopLeft = {TopLeft}
                              BottomRight = {BottomRight}
                              dims = {textureDims}   
                              FitToScreen = {fitToScreen}
                              ThreeDfitToScreen = {ThreeDfitToScreen}
                              setThreeDReady  ={setThreeDReady}
                              ModType = {ModType}
                              ChangeModTypeFunc = {ChangeModTypeFunc}> 
                  </ThreeDview>
              </OrientationContext.Provider>
          </VisibilityContext.Provider> 
            
      </div>
      )
    
   }

   export default Map;
  