import React, { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, Circle } from 'react-leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster';
import 'leaflet/dist/leaflet.css';
import { type Question } from '../services/questions.service';
import { Link } from 'react-router-dom';
import L from 'leaflet';
import { MapPin, User, MessageCircle, Heart, ExternalLink } from 'lucide-react';
import { renderToStaticMarkup } from 'react-dom/server';

// Fix for default leaflet icons in Vite
import iconRetina from 'leaflet/dist/images/marker-icon-2x.png';
import iconUrl from 'leaflet/dist/images/marker-icon.png';
import shadowUrl from 'leaflet/dist/images/marker-shadow.png';

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: iconRetina,
  iconUrl: iconUrl,
  shadowUrl: shadowUrl,
});

// Custom Icons with new design
const createCustomIcon = (icon: React.ReactNode, gradient: string, pulse: boolean = false) => {
  const html = renderToStaticMarkup(
    <div className="relative">
      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-3 border-white shadow-xl ${gradient} ${pulse ? 'animate-pulse' : ''}`}>
        {icon}
      </div>
      {pulse && (
        <div className="absolute inset-0 w-10 h-10 rounded-full bg-blue-400 opacity-50 animate-ping"></div>
      )}
    </div>
  );
  
  return L.divIcon({
    html: html,
    className: '',
    iconSize: [40, 40],
    iconAnchor: [20, 40],
    popupAnchor: [0, -40],
  });
};

const UserIcon = createCustomIcon(
  <User size={20} className="text-white" />, 
  "bg-gradient-to-br from-blue-500 to-blue-600",
  true
);

const QuestionIcon = createCustomIcon(
  <MapPin size={20} className="text-white" />, 
  "bg-gradient-to-br from-navy-600 to-teal-500",
  false
);

interface MapProps {
  questions: Question[];
  userLocation: { latitude: number; longitude: number } | null;
}

const MapController = ({ 
  center 
}: { 
  center: { latitude: number; longitude: number } | null 
}) => {
  const map = useMap();
  useEffect(() => {
    if (center) {
      map.flyTo([center.latitude, center.longitude], 14, { duration: 1.5 });
    }
  }, [center, map]);
  return null;
};

const MapComponent: React.FC<MapProps> = ({ questions, userLocation }) => {
  return (
    <div className="h-full w-full relative z-0">
      <MapContainer
        center={[userLocation?.latitude || 51.505, userLocation?.longitude || -0.09]}
        zoom={13}
        className="h-full w-full rounded-2xl"
        scrollWheelZoom={true}
        zoomControl={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {userLocation && (
          <>
            <Marker position={[userLocation.latitude, userLocation.longitude]} icon={UserIcon}>
              <Popup minWidth={200} closeButton={true}>
                <div style={{ textAlign: 'center', padding: '16px' }}>
                  <div style={{
                    background: 'linear-gradient(to bottom right, #3b82f6, #2563eb)',
                    padding: '12px',
                    borderRadius: '12px',
                    marginBottom: '12px',
                    display: 'inline-block'
                  }}>
                    <User style={{ color: 'white' }} size={24} />
                  </div>
                  <p style={{ fontWeight: 'bold', color: '#061E29', fontSize: '16px', marginBottom: '4px' }}>
                    Your Location
                  </p>
                  <p style={{ fontSize: '12px', color: '#526873' }}>
                    Questions within 3km radius
                  </p>
                </div>
              </Popup>
            </Marker>
            
            {/* Search radius visualization */}
            <Circle 
              center={[userLocation.latitude, userLocation.longitude]} 
              radius={3000} // 3km radius 
              pathOptions={{ 
                color: '#1e3a5f', 
                fillColor: '#14b8a6', 
                fillOpacity: 0.08,
                weight: 2,
                dashArray: '10, 10'
              }}
            />
            <MapController center={userLocation} />
          </>
        )}

        <MarkerClusterGroup
          chunkedLoading
          maxClusterRadius={60}
          spiderfyOnMaxZoom={true}
          showCoverageOnHover={false}
          zoomToBoundsOnClick={true}
          iconCreateFunction={(cluster: any) => {
            const count = cluster.getChildCount();
            const size = count < 10 ? 40 : count < 100 ? 50 : 60;
            const html = `
              <div style="
                width: ${size}px;
                height: ${size}px;
                border-radius: 50%;
                background: linear-gradient(135deg, #1D546D, #5F9598);
                border: 4px solid white;
                box-shadow: 0 4px 12px rgba(0, 0, 0, 0.25);
                display: flex;
                align-items: center;
                justify-content: center;
                font-weight: bold;
                color: white;
                font-size: ${count < 10 ? '16px' : count < 100 ? '18px' : '20px'};
              ">
                ${count}
              </div>
            `;
            return L.divIcon({
              html: html,
              className: '',
              iconSize: [size, size],
              iconAnchor: [size / 2, size / 2],
            });
          }}
        >
          {questions.map((question) => (
            <Marker
              key={question._id}
              position={[question.location.coordinates[1], question.location.coordinates[0]]}
              icon={QuestionIcon}
            >
            <Popup maxWidth={300} minWidth={250} closeButton={true}>
              <div style={{ padding: '16px' }}>
                <div style={{ marginBottom: '16px' }}>
                  <h3 style={{ 
                    fontWeight: 'bold', 
                    fontSize: '18px', 
                    color: '#061E29', 
                    marginBottom: '8px',
                    lineHeight: '1.3'
                  }}>
                    {question.title}
                  </h3>
                  <p style={{ 
                    fontSize: '14px', 
                    color: '#526873', 
                    lineHeight: '1.5',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {question.content}
                  </p>
                </div>
                
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '12px', 
                  marginBottom: '16px',
                  fontSize: '12px',
                  flexWrap: 'wrap'
                }}>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    background: '#e0ecee',
                    color: '#3f6064',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    <MessageCircle size={14} />
                    <span>{question.answers.length}</span>
                  </div>
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '6px',
                    background: '#fee2e2',
                    color: '#dc2626',
                    padding: '6px 12px',
                    borderRadius: '20px',
                    fontWeight: '600'
                  }}>
                    <Heart size={14} />
                    <span>{question.likeCount}</span>
                  </div>
                  <span style={{ color: '#787d82', fontWeight: '500' }}>
                    {new Date(question.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                  </span>
                </div>
                
                <Link 
                  to={`/question/${question._id}`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    width: '100%',
                    background: 'linear-gradient(to right, #1D546D, #5F9598)',
                    color: 'white',
                    padding: '10px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    fontWeight: '600',
                    textDecoration: 'none',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #2d4554, #4a757a)';
                    e.currentTarget.style.boxShadow = '0 10px 15px -3px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.background = 'linear-gradient(to right, #1D546D, #5F9598)';
                    e.currentTarget.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
                  }}
                >
                  View Details
                  <ExternalLink size={14} />
                </Link>
              </div>
            </Popup>
          </Marker>
        ))}
        </MarkerClusterGroup>
      </MapContainer>
    </div>
  );
};

export default MapComponent;
