
import React, { useEffect, useRef, useState } from 'react';
import { Report, UserLocation, NavigationState } from '../types';

interface MapViewProps {
  reports: Report[];
  userLocation: UserLocation;
  navigation: NavigationState;
  onAuthError?: () => void;
}

declare global {
  interface Window {
    google: any;
    gm_authFailure: () => void;
  }
}

const MapView: React.FC<MapViewProps> = ({ reports, userLocation, navigation, onAuthError }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const [map, setMap] = useState<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const markersRef = useRef<any[]>([]);
  const trafficLayerRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);

  useEffect(() => {
    window.gm_authFailure = () => {
      console.error("Google Maps API Authentication Failure");
      setLoadError("Harita yetkilendirme hatası. API anahtarını kontrol edin.");
      if (onAuthError) onAuthError();
    };

    const loadGoogleMaps = () => {
      if (!process.env.API_KEY) {
        setLoadError("API Anahtarı bulunamadı.");
        return;
      }

      if (window.google && window.google.maps) {
        initMap();
        return;
      }

      const scriptId = 'google-maps-script';
      if (document.getElementById(scriptId)) return;

      const script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://maps.googleapis.com/maps/api/js?key=${process.env.API_KEY}&libraries=places,geometry,marker`;
      script.async = true;
      script.defer = true;
      script.onload = () => {
        console.log("Google Maps script loaded");
        initMap();
      };
      script.onerror = () => {
        setLoadError("Google Maps yüklenemedi.");
      };
      document.head.appendChild(script);
    };

    const initMap = () => {
      if (!mapRef.current || !window.google || !window.google.maps) {
        console.warn("InitMap failed: mapRef or google.maps missing");
        return;
      }

      try {
        const newMap = new window.google.maps.Map(mapRef.current, {
          center: { lat: userLocation.lat, lng: userLocation.lng },
          zoom: 14,
          disableDefaultUI: true,
          styles: [
            { featureType: "poi", elementType: "labels", stylers: [{ visibility: "off" }] },
            { featureType: "all", elementType: "geometry", stylers: [{ color: "#242f3e" }] },
            { featureType: "all", elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
            { featureType: "all", elementType: "labels.text.fill", stylers: [{ color: "#746855" }] }
          ],
          mapId: 'DEMO_MAP_ID'
        });

        const trafficLayer = new window.google.maps.TrafficLayer();
        trafficLayer.setMap(newMap);
        trafficLayerRef.current = trafficLayer;

        const directionsRenderer = new window.google.maps.DirectionsRenderer({
          suppressMarkers: false,
          polylineOptions: {
            strokeColor: "#2563eb",
            strokeWeight: 6,
            strokeOpacity: 0.8
          }
        });
        directionsRenderer.setMap(newMap);
        directionsRendererRef.current = directionsRenderer;

        setMap(newMap);
        console.log("Map initialized successfully");
      } catch (err) {
        console.error("Error during map init:", err);
        setLoadError("Harita başlatılamadı.");
      }
    };

    loadGoogleMaps();

    return () => {
      delete (window as any).gm_authFailure;
    };
  }, []);

  useEffect(() => {
    if (map && !navigation.isNavigating) {
      map.panTo({ lat: userLocation.lat, lng: userLocation.lng });
    }
  }, [userLocation, map]);

  useEffect(() => {
    if (!map || !window.google || !directionsRendererRef.current) return;

    if (navigation.isNavigating && navigation.destination) {
      const directionsService = new window.google.maps.DirectionsService();
      const request = {
        origin: new window.google.maps.LatLng(userLocation.lat, userLocation.lng),
        destination: navigation.destination,
        waypoints: navigation.waypoints?.map(wp => ({ location: wp, stopover: true })) || [],
        travelMode: window.google.maps.TravelMode.DRIVING,
        optimizeWaypoints: true
      };

      directionsService.route(request, (result: any, status: any) => {
        if (status === window.google.maps.DirectionsStatus.OK) {
          directionsRendererRef.current.setDirections(result);
        }
      });
    } else {
      directionsRendererRef.current.setDirections({ routes: [] });
    }
  }, [navigation.isNavigating, navigation.destination, navigation.waypoints, map]);

  useEffect(() => {
    if (!map || !window.google) return;

    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];

    reports.forEach(report => {
      const getIconUrl = (type: string) => {
        const icons: Record<string, string> = {
          police: 'https://cdn-icons-png.flaticon.com/512/1022/1022330.png',
          radar: 'https://cdn-icons-png.flaticon.com/512/2983/2983751.png',
          accident: 'https://cdn-icons-png.flaticon.com/512/2913/2913454.png',
          traffic: 'https://cdn-icons-png.flaticon.com/512/2913/2913444.png',
          gas_price: 'https://cdn-icons-png.flaticon.com/512/3103/3103284.png',
        };
        return icons[type] || 'https://cdn-icons-png.flaticon.com/512/684/684908.png';
      };

      const marker = new window.google.maps.Marker({
        position: { lat: report.lat, lng: report.lng },
        map: map,
        icon: {
          url: getIconUrl(report.type),
          scaledSize: new window.google.maps.Size(32, 32),
        },
        animation: window.google.maps.Animation.DROP
      });

      const infoWindow = new window.google.maps.InfoWindow({
        content: `<div style="padding:10px;color:#000;"><b>${report.userName}</b><br/>${report.description}</div>`
      });

      marker.addListener('click', () => infoWindow.open(map, marker));
      markersRef.current.push(marker);
    });
  }, [reports, map]);

  return (
    <div className="absolute inset-0 w-full h-full bg-slate-900 z-0">
      {loadError ? (
        <div className="flex items-center justify-center h-full p-8 text-center text-white flex-col gap-4">
          <i className="fa-solid fa-circle-exclamation text-4xl text-orange-500"></i>
          <p className="font-bold">{loadError}</p>
        </div>
      ) : (
        <div ref={mapRef} className="w-full h-full" />
      )}
      
      <div className="absolute right-4 bottom-24 flex flex-col gap-3 z-10">
        <button 
          onClick={() => map?.setMapTypeId('satellite')}
          className="bg-white/95 backdrop-blur-md w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-slate-700 active:scale-90 transition-all border border-white"
        >
          <i className="fa-solid fa-layer-group text-xl"></i>
        </button>
        <button 
          onClick={() => map?.panTo({ lat: userLocation.lat, lng: userLocation.lng })}
          className="bg-white/95 backdrop-blur-md w-12 h-12 rounded-2xl shadow-xl flex items-center justify-center text-blue-600 active:scale-90 transition-all border border-white"
        >
          <i className="fa-solid fa-location-crosshairs text-xl"></i>
        </button>
      </div>

      <div className="absolute left-4 bottom-24 bg-slate-900/90 backdrop-blur-md p-3 rounded-2xl shadow-xl border border-white/10 text-[10px] space-y-2 font-black text-slate-400 uppercase tracking-tighter z-10">
        <div className="flex items-center gap-2"><div className="w-3 h-1 bg-green-500 rounded"></div> Akıcı</div>
        <div className="flex items-center gap-2"><div className="w-3 h-1 bg-orange-500 rounded"></div> Yoğun</div>
        <div className="flex items-center gap-2"><div className="w-3 h-1 bg-red-600 rounded"></div> Kapalı</div>
      </div>
    </div>
  );
};

export default MapView;
