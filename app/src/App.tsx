import { Marker, MarkerClusterer } from '@googlemaps/markerclusterer';
import { AdvancedMarker, APIProvider, Map, useMap } from '@vis.gl/react-google-maps';
import { useEffect, useRef, useState } from 'react';
import { getAdvartises } from '@/api/advartiseApi';
import { AdvertiseGroup, groupByPosition } from '@/schemas/AdvertiseGroup';

const API_KEY = import.meta.env.VITE_MAP_API_KEY;
const MAP_ID = import.meta.env.VITE_MAP_ID;


function App() {
  const [loading, setLoading] = useState(true);

  const [groups, setAdvertises] = useState<AdvertiseGroup[]>([]);

  const [selectedGroup, setSelectedGroup] = useState<AdvertiseGroup | null>(null);

  const loadData = async () => {
    const advertises = await getAdvartises();
    const filtered = advertises.filter((adv) => adv.position && (adv.totalPrice || 0) > 5000)
    const groups = groupByPosition(filtered);
    setAdvertises(groups);
    setLoading(false);
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <span>Application loading...</span>

  const initPosition = groups[0].position;

  if (!initPosition) return <span>Position not found</span>;

  return (
    <>
      <APIProvider apiKey={API_KEY}>
        <div style={{ height: "100vh", width: "100vw", padding: 0, margin: 0 }}>
          <Map
            defaultCenter={initPosition}
            defaultZoom={17}
            minZoom={12}
            maxZoom={18}
            mapId={MAP_ID}
            disableDefaultUI={true}
            zoomControl={false}
            fullscreenControl={false}
          >
            <Markers groups={groups} setSelectedGroup={setSelectedGroup} />
          </Map>
        </div>
      </APIProvider>

      {selectedGroup && (
        <div style={{ position: "fixed", zIndex: 100, top: 0, right: 0, padding: 10, background: "white" }}>
          Has selected group
        </div>
      )}
    </>
  );
}

type MarkerProps = {
  groups: AdvertiseGroup[];
  setSelectedGroup: (group: AdvertiseGroup) => void;
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
    {props.groups.map((group, index) => (
      <AdvancedMarker
        key={`sale-${index}`}
        position={group.position}
        ref={(marker) => setMarkerRef(marker, `sale-${index}`)}
        onClick={() => props.setSelectedGroup(group)}
      />
    ))}
  </>
}

export default App;
