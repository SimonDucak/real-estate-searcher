import { Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { AdvancedMarker, APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';

const API_KEY = import.meta.env.VITE_MAP_API_KEY as string;
const MAP_ID = import.meta.env.VITE_MAP_ID as string;

type DataItem = {
  coors: [number, number];
  [key: string]: any;
}

function App() {
  const [loading, setLoading] = useState(true);

  const [saleData, setSaleData] = useState<DataItem[]>([]);

  const [rentData, setRentData] = useState<DataItem[]>([]);

  const fetchJson = async (path: string): Promise<any> => {
    const response = await fetch(path);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${path}: ${response.statusText}`);
    }
    const json = await response.json();
    console.log(json);
    return json;
  }

  const loadData = async () => {
    const [saleData, rentData] = await Promise.all([
      fetchJson('/for-sale-minified.json'),
      fetchJson('/for-rent-minified.json'),
    ]);

    setSaleData(saleData);

    setRentData(rentData.slice(0, 10));

    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <span>Application loading...</span>

  const initCoors = saleData[0].coors;

  const initPosition = { lat: initCoors[1], lng: initCoors[0] };

  return (
    <APIProvider apiKey={API_KEY}>
      <div style={{ height: "100vh", width: "100vw" }}>
        <Map defaultCenter={initPosition} defaultZoom={6} mapId={MAP_ID}>
          <Markers saleData={saleData} rentData={rentData} />
        </Map>
      </div>
    </APIProvider>
  );
}

type MarkerProps = {
  saleData: DataItem[];
  rentData: DataItem[];
}

function Markers(props: MarkerProps) {
  const map = useMap();

  const [markers, setMarkers] = useState<{ [key: string]: Marker }>({});

  const clusterer = useRef<MarkerClusterer | null>(null);

  useEffect(() => {
    if (!map) return;
    if (!clusterer.current) {
      clusterer.current = new MarkerClusterer({ map });
    }
  }, [map]);

  useEffect(() => {
    clusterer.current?.clearMarkers();
    clusterer.current?.addMarkers(Object.values(markers));
  }, [markers]);

  const setMarkerRef = (marker: Marker | null, key: string) => {
    if (marker && markers[key]) return;
    if (!marker && !markers[key]) return;

    setMarkers((prev) => {
      if (marker) {
        return { ...prev, [key]: marker };
      } else {
        const newMarkers = { ...prev };
        delete newMarkers[key];
        return newMarkers;
      }
    });
  };

  return <>
    {props.saleData.map((item, index) => (
      <AdvancedMarker
        key={`sale-${index}`}
        position={{ lat: item.coors[1], lng: item.coors[0] }}
        ref={(marker) => setMarkerRef(marker, `sale-${index}`)}
      />
    ))}
    {props.rentData.map((item, index) => (
      <AdvancedMarker
        key={`rent-${index}`}
        position={{ lat: item.coors[1], lng: item.coors[0] }}
        ref={(marker) => setMarkerRef(marker, `rent-${index}`)}
      />
    ))}
  </>
}

export default App;
