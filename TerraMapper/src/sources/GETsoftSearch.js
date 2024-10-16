import axios from "axios";

const GetSoftSearch = (target, apikey)=> {

    return axios.get(`https://geocode.search.hereapi.com/v1/geocode?q=${target}&apiKey=${apikey}`)

}


export default {GetSoftSearch}