import axios from "axios";



const SendCoords =(port, data, height, width)=> {
    return axios.post(`http://localhost:${port}/`, {coordinates: data, width : width*1000, height : height*1000})

}


export default {SendCoords}