import axios from "axios";

const GetElevationData = (lat, lon)=> {

    return axios.get(`https://api.open-meteo.com/v1/elevation?latitude=${lat}&longitude=${lon}`)

}


export default {GetElevationData}