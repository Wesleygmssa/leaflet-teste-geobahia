/* eslint-disable no-unreachable */
/* eslint-disable no-lone-blocks */
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { useEffect, useState } from "react";
import axios from "axios";

function App() {
  const [map, setMap] = useState(null);
  const [layerName, setLayerName] = useState("");
  const [layerUrl, setLayerUrl] = useState("");
  const [layerType, setLayerType] = useState("");
  const [camadas, setCamadas] = useState([]);

  console.log(camadas);

  //Exibindo mapa
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

  //Adicionar camadas
  const addLayer = () => {
    switch (layerType) {
      //Tipos de camadas

      case "tileLayer": {
        let newLayer = L.tileLayer(layerUrl, {
          maxZoom: 17,
          attribution:
            'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)',
        });

        let camada = {
          name: layerName,
          leafletLayer: newLayer,
          type: layerType,
          visible: true,
        };

        // setCamadas([...camadas, camada]);
        setCamadas((old) => [...old, camada]);
        newLayer.addTo(map);
        break;
      }

      case "tileLayer.wms": {
        var newLayer = L.tileLayer.wms(layerUrl, {
          layers: layerName,
          format: "image/png",
          transparent: true,
          attribution: "Weather data © 2012 IEM Nexrad",
        });

        let camada = {
          name: layerName,
          leafletLayer: newLayer,
          type: layerType,
          visible: true,
        };
        setCamadas((old) => [...old, camada]);

        newLayer.addTo(map);
        break;
      }

      case "geoJSON": {
        axios.get(layerUrl).then((response) => {
          const geoJSON = response.data;
          let newLayer = L.geoJSON(geoJSON);
          newLayer.addTo(map);

          let camada = {
            name: layerName,
            leafletLayer: newLayer,
            type: layerType,
            visible: true,
          };

          setCamadas((old) => [...old, camada]);
        });

        break;
      }

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
      <div>
        {camadas.map((camada, i) => (
          <div key={i}>
            <p>{camada.name}</p>
            <button
              onClick={() => {
                camada.leafletLayer.remove();
                setCamadas(
                  camadas.filter(
                    (item, index) => item.name !== camada.name && index !== i
                  )
                );
              }}
            >
              Delete
            </button>
            <button
              onClick={() => {
                if (camada.type !== "geoJSON") {
                  if (camada.visible) {
                    camada.leafletLayer.setOpacity(0);
                    camada.visible = false;
                    setCamadas([...camadas]);
                  } else {
                    camada.leafletLayer.setOpacity(1);
                    camada.visible = true;
                    setCamadas([...camadas]);
                  }
                } else {
                  camada.leafletLayer.setStyle({
                    opacity: camada.visible ? "0" : "1",
                  });
                  camada.visible = !camada.visible;
                  setCamadas([...camadas]);
                }
              }}
            >
              {camada.visible ? "Ocultar" : "Exibir"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;

//http://geoserver.inema.ba.gov.br/Vetor_Recursos_Ambientais/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=Vetor_Recursos_Ambientais%3Aguaibim_inema_1993&maxFeatures=50&outputFormat=application%2Fjson
//
