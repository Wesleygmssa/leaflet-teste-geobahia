import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";

function App() {
  const [map, setMap] = useState(null);
  const [layerName, setLayerName] = useState("");
  const [layerUrl, setLayerUrl] = useState("");
  const [layerType, setLayerType] = useState("");

  useEffect(() => {
    if (!map) {
      let newMap = L.map("mapa", {
        center: [-12.9545232, -38.4006917],
        zoom: 13,
        maxZoom: 20,
      });

      setMap(newMap);
    }
  }, [map]);

  const addLayer = () => {
    console.log(layerType);
    switch (layerType) {
      case "tileLayer": {
        let newLayer = L.tileLayer(layerUrl, {
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        });

        newLayer.addTo(map);
        break;
      }

      case "tileLayer.wms":
        {
          var newLayer = L.tileLayer.wms(layerUrl, {
            layers: layerName,
            format: "image/png",
            transparent: true,
            attribution: "Weather data © 2012 IEM Nexrad",
          });

          newLayer.addTo(map);
          break;
        }
        L.geoJSON();
      default:
        return null;
    }
  };

  return (
    <div className="App">
      <div>
        <input
          type="text"
          placeholder="nome"
          value={layerName}
          onChange={(event) => setLayerName(event.target.value)}
        />
        <input
          type="text"
          placeholder="url"
          value={layerUrl}
          onChange={(event) => setLayerUrl(event.target.value)}
        />

        <select
          value={layerType}
          onChange={(e) => setLayerType(e.target.value)}
        >
          <option value=""></option>
          <option value="tileLayer">tileLayer</option>
          <option value="tileLayer.wms">tileLayer.wms</option>
          <option value="geoJSON">geoJSON</option>
        </select>
        <button type="button" onClick={addLayer}>
          Add
        </button>
      </div>
      <div id="mapa" style={{ width: "60vw", height: "50vh" }}></div>
    </div>
  );
}

export default App;
