// Map.js
import React, { useState, useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import StoreForm from './StoreForm';
import SearchForm from './SearchForm';
import 'mapbox-gl/dist/mapbox-gl.css';
import './Map.css';

mapboxgl.accessToken = 'pk.eyJ1Ijoic2FoaWxrcnJhaiIsImEiOiJjbHYzbjgyemQwcmtmMmpwOHd0OTg5eW9sIn0.Dtuo5qqHCxv_01nK7YHVkg';

const Map = () => {
  const [storeLocations, setStoreLocations] = useState(
    JSON.parse(localStorage.getItem('storeLocations')) || []
  );
  const mapContainerRef = useRef(null);
  const mapRef = useRef(null);

  useEffect(() => {
    const map = new mapboxgl.Map({
      container: mapContainerRef.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: [-98.5795, 39.8283],
      zoom: 4,
    });

    mapRef.current = map;

    return () => map.remove();
  }, []);

  const handleAddStore = (store) => {
    setStoreLocations([...storeLocations, store]);
    localStorage.setItem('storeLocations', JSON.stringify([...storeLocations, store]));
  };

  const handleSearchStore = (name) => {
    const store = storeLocations.find((store) => store.name.toLowerCase() === name.toLowerCase());
    if (store) {
      mapRef.current.flyTo({
        center: [store.longitude, store.latitude],
        zoom: 14,
      });
      new mapboxgl.Popup()
        .setLngLat([store.longitude, store.latitude])
        .setHTML(`<h3>${store.name}</h3>`)
        .addTo(mapRef.current);
    } else {
      alert('Store not found');
    }
  };

  const findShortestPath = async (startStoreName, endStoreName) => {
    const startStore = storeLocations.find((store) => store.name.toLowerCase() === startStoreName.toLowerCase());
    const endStore = storeLocations.find((store) => store.name.toLowerCase() === endStoreName.toLowerCase());
    if (!startStore || !endStore) {
      alert('Start or end store not found');
      return [];
    }

    const directionsResponse = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${startStore.longitude},${startStore.latitude};${endStore.longitude},${endStore.latitude}?geometries=geojson&access_token=${mapboxgl.accessToken}`
    );

    const directionsData = await directionsResponse.json();
    const route = directionsData.routes[0].geometry;

    // Draw the route on the map
    mapRef.current.addLayer({
      id: 'route',
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'Feature',
          geometry: route,
        },
      },
      layout: {
        'line-join': 'round',
        'line-cap': 'round',
      },
      paint: {
        'line-color': '#3887be',
        'line-width': 5,
        'line-opacity': 0.75,
      },
    });

    return [startStore, endStore];
  };

  return (
    <div className="map-container">
      <div ref={mapContainerRef} className="map" />
      <div className="form-container">
        <StoreForm onAddStore={handleAddStore} />
        <SearchForm onSearchStore={handleSearchStore} />
        <div>
          <h2>Find Shortest Path Between Stores</h2>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const startStore = e.target.startStore.value;
              const endStore = e.target.endStore.value;
              console.log(await findShortestPath(startStore, endStore));
            }}
          >
            <input type="text" name="startStore" placeholder="Start Store Name" required />
            <input type="text" name="endStore" placeholder="End Store Name" required />
            <button type="submit">Find Path</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Map;
