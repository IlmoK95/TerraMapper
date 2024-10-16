import axios from "axios";

const GetAutoComplete = (target, apikey)=> {
    let suggestions = 3
    return axios.get(`https://autocomplete.search.hereapi.com/v1/autocomplete?q=${target}&limit=${suggestions}&apiKey=${apikey}`)

}


export default {GetAutoComplete}