import axios from "axios";

const GetTexture = (TopLeftLng, BottomRightLat, BottomRightLng, TopLeftLat, w, h, apiKey)=> {

    return axios.get(`https://image.maps.hereapi.com/mia/v3/base/mc/bbox:${TopLeftLng},${BottomRightLat},${BottomRightLng},${TopLeftLat}/${w}x${h}/jpeg?apiKey=${apiKey}&style=satellite.day`,
         {
            responseType: 'blob',
        
          }
    )

}


export default {GetTexture}