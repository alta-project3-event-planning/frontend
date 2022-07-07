import { MapContainer, Marker, Popup, TileLayer,useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'
import 'leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.webpack.css'; // Re-uses images from ~leaflet package
import 'leaflet-defaulticon-compatibility';
const Map = ({ position,setPosition }) => {
  const Markers = () => {
    useMapEvents({
        click(e) {
            if (setPosition) {
              setPosition([e.latlng.lat, e.latlng.lng]);                
            }
        },            
    })
    return (
        position ? 
            <Marker           
            position={position}
            />
        : null
    )   
  }
  return (
    <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{height: 300, width: "100%"}}>
      <TileLayer
        attribution=''
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Markers />
    </MapContainer>
  )
}
export default Map