'use client';

import { useState, useEffect, useRef } from 'react';
import { reverseGeocodeCoordinates, searchLocations, fetchPincodeDetails, SearchPlaceItem } from '@/lib/api';

export interface LocationPickerResult {
  address: string;
  locality: string;
  city: string;
  state: string;
  pincode: string;
  coordinates: {
    latitude: number;
    longitude: number;
  };
}

interface LocationPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (location: LocationPickerResult) => void;
  initialCoords?: { lat: number; lon: number };
  initialAddress?: {
    address?: string;
    locality?: string;
    city?: string;
    state?: string;
    pincode?: string;
  };
}

export default function LocationPickerModal({
  isOpen,
  onClose,
  onConfirm,
  initialCoords,
  initialAddress,
}: LocationPickerModalProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const streetLayerRef = useRef<any>(null);
  const satelliteLayerRef = useRef<any>(null);

  const [mapMode, setMapMode] = useState<'street' | 'satellite'>('street');

  // Default to New Delhi coordinates if none provided
  const [currentCoords, setCurrentCoords] = useState<{ lat: number; lon: number }>(
    initialCoords || { lat: 28.6139, lon: 77.209 }
  );

  const [addressDetails, setAddressDetails] = useState({
    address: initialAddress?.address || '',
    locality: initialAddress?.locality || '',
    city: initialAddress?.city || '',
    state: initialAddress?.state || '',
    pincode: initialAddress?.pincode || '',
    houseNumber: '',
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<SearchPlaceItem[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isReverseGeocoding, setIsReverseGeocoding] = useState(false);
  const [isLocatingGps, setIsLocatingGps] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const handleToggleMapMode = (mode: 'street' | 'satellite') => {
    setMapMode(mode);
    if (!mapInstanceRef.current || !streetLayerRef.current || !satelliteLayerRef.current) return;
    if (mode === 'street') {
      mapInstanceRef.current.removeLayer(satelliteLayerRef.current);
      mapInstanceRef.current.addLayer(streetLayerRef.current);
    } else {
      mapInstanceRef.current.removeLayer(streetLayerRef.current);
      mapInstanceRef.current.addLayer(satelliteLayerRef.current);
    }
  };

  // Debounced search
  useEffect(() => {
    if (!searchQuery || searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await searchLocations(searchQuery.trim());
        if (res.success && res.results) {
          setSearchResults(res.results);
        }
      } catch (err) {
        console.warn('Search error:', err);
      } finally {
        setIsSearching(false);
      }
    }, 350);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Reverse geocode given coordinates
  const resolveCoordinates = async (lat: number, lon: number) => {
    setIsReverseGeocoding(true);
    setStatusMessage('Resolving exact address details...');
    try {
      const res = await reverseGeocodeCoordinates(lat, lon);
      if (res.success && res.data) {
        const d = res.data;
        setAddressDetails((prev) => ({
          ...prev,
          address: d.address || prev.address,
          locality: d.locality || prev.locality,
          city: d.city || prev.city,
          state: d.state || prev.state,
          pincode: d.pincode || prev.pincode,
        }));
        setStatusMessage('Location pinpointed.');
      } else {
        setStatusMessage('Pin placed. You can adjust details below.');
      }
    } catch {
      setStatusMessage('Pin placed.');
    } finally {
      setIsReverseGeocoding(false);
    }
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    // Dynamically load Leaflet on client-side
    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default Leaflet icon paths in Next.js
      delete (L.Icon.Default.prototype as any)._getIconUrl;

      // Custom luxury golden pin icon
      const goldPinIcon = L.divIcon({
        className: 'tb-map-pin',
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: grab;">
            <div style="background: linear-gradient(135deg, #F3E5AB 0%, #D4AF37 50%, #AA771C 100%); color: #12100E; width: 36px; height: 36px; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 14px rgba(0,0,0,0.5); border: 2.5px solid #FFFFFF;">
              <span style="transform: rotate(45deg); font-size: 16px; font-weight: 900;">★</span>
            </div>
            <div style="width: 10px; height: 5px; background: rgba(0,0,0,0.35); border-radius: 50%; margin-top: 3px; filter: blur(1px);"></div>
          </div>
        `,
        iconSize: [36, 44],
        iconAnchor: [18, 44],
      });

      // Cleanup previous instance if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const initialLat = currentCoords.lat;
      const initialLon = currentCoords.lon;

      // Initialize map instance
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLon],
        zoom: 16,
        zoomControl: false,
      });

      // Official OpenStreetMap tiles (100% free, no API key, zero watermarks)
      const streetLayer = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
        maxZoom: 19,
      });

      // Esri World Imagery (high-resolution satellite rooftop view)
      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19,
        }
      );

      streetLayerRef.current = streetLayer;
      satelliteLayerRef.current = satelliteLayer;

      if (mapMode === 'satellite') {
        satelliteLayer.addTo(map);
      } else {
        streetLayer.addTo(map);
      }

      // Add zoom control to top-right
      L.control.zoom({ position: 'topright' }).addTo(map);

      // Add draggable marker
      const marker = L.marker([initialLat, initialLon], {
        icon: goldPinIcon,
        draggable: true,
        autoPan: true,
      }).addTo(map);

      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setCurrentCoords({ lat: pos.lat, lon: pos.lng });
        resolveCoordinates(pos.lat, pos.lng);
      });

      // Click anywhere to move marker
      map.on('click', (e: any) => {
        marker.setLatLng(e.latlng);
        setCurrentCoords({ lat: e.latlng.lat, lon: e.latlng.lng });
        resolveCoordinates(e.latlng.lat, e.latlng.lng);
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;

      // Initial resolution: auto-detect GPS if first time, or resolve initial coordinates
      if (!initialAddress?.address) {
        handleUseGps();
      } else if (!addressDetails.address) {
        resolveCoordinates(initialLat, initialLon);
      }

      // Invalidate map size after animation / render
      setTimeout(() => {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      }, 250);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [isOpen]);

  // "Use My GPS" handler with high accuracy hardware/Wi-Fi triangulation
  const handleUseGps = () => {
    setIsLocatingGps(true);
    setStatusMessage('Querying exact GPS & Wi-Fi location...');

    if (typeof navigator === 'undefined' || !('geolocation' in navigator)) {
      setIsLocatingGps(false);
      setStatusMessage('Device geolocation not supported. Please search or drag the pin.');
      return;
    }

    const applyGpsCoords = (lat: number, lon: number, isHighAccuracy: boolean) => {
      setCurrentCoords({ lat, lon });

      if (mapInstanceRef.current && markerRef.current) {
        mapInstanceRef.current.flyTo([lat, lon], 18, { duration: 1.2 });
        markerRef.current.setLatLng([lat, lon]);
      }

      resolveCoordinates(lat, lon);
      setIsLocatingGps(false);
      setStatusMessage(
        isHighAccuracy
          ? '✓ Exact GPS location detected.'
          : 'Approximate location found. Drag the pin to your exact building.'
      );
    };

    const tryLowAccuracyFallback = () => {
      setStatusMessage('Trying network triangulation...');
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          applyGpsCoords(pos.coords.latitude, pos.coords.longitude, false);
        },
        async (err) => {
          console.warn('Geolocation fallback error:', err);
          if (err.code === 1) {
            setStatusMessage('📍 Location blocked. Please allow browser location or search above.');
            setIsLocatingGps(false);
            return;
          }

          try {
            setStatusMessage('Resolving network location fallback...');
            const fallback = await reverseGeocodeCoordinates();
            if (fallback.success && fallback.data) {
              const { latitude, longitude } = fallback.data.coordinates;
              applyGpsCoords(latitude, longitude, false);
            } else {
              setStatusMessage('Please drag the pin to your residence or search your area.');
            }
          } catch {
            setStatusMessage('Please drag the pin to your residence or search your area.');
          } finally {
            setIsLocatingGps(false);
          }
        },
        { timeout: 5000, enableHighAccuracy: false, maximumAge: 30000 }
      );
    };

    // 1. First attempt: High Accuracy (GPS / Wi-Fi BSSID)
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        applyGpsCoords(pos.coords.latitude, pos.coords.longitude, true);
      },
      (err) => {
        console.warn('High accuracy geolocation error:', err);
        if (err.code === 1) {
          // Permission denied
          setStatusMessage('📍 Location blocked. Please allow browser location or search above.');
          setIsLocatingGps(false);
        } else {
          // Timeout or unavailable on desktop — try low accuracy
          tryLowAccuracyFallback();
        }
      },
      { timeout: 8000, enableHighAccuracy: true, maximumAge: 0 }
    );
  };

  // Select place from search autocomplete
  const handleSelectPlace = (place: SearchPlaceItem) => {
    setSearchQuery('');
    setSearchResults([]);

    setCurrentCoords({ lat: place.lat, lon: place.lon });

    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([place.lat, place.lon], 17, { duration: 1.2 });
      markerRef.current.setLatLng([place.lat, place.lon]);
    }

    setAddressDetails((prev) => ({
      ...prev,
      address: place.shortName || prev.address,
      locality: place.locality || prev.locality,
      city: place.city || prev.city,
      state: place.state || prev.state,
      pincode: place.pincode || prev.pincode,
    }));

    resolveCoordinates(place.lat, place.lon);
  };

  // Handle manual pincode lookup
  const handlePincodeChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.replace(/\D/g, '').slice(0, 6);
    setAddressDetails((prev) => ({ ...prev, pincode: code }));

    if (code.length === 6) {
      try {
        const res = await fetchPincodeDetails(code);
        if (res.success && res.data) {
          setAddressDetails((prev) => ({
            ...prev,
            city: res.data?.district || prev.city,
            state: res.data?.state || prev.state,
          }));
          setStatusMessage(`PIN Code verified (${res.data.district}, ${res.data.state})`);
        }
      } catch (err) {
        console.warn('Pincode check error:', err);
      }
    }
  };

  // Confirm final location
  const handleConfirm = () => {
    const fullStreetAddress = [
      addressDetails.houseNumber ? `Flat/House ${addressDetails.houseNumber}` : '',
      addressDetails.address,
    ]
      .filter(Boolean)
      .join(', ');

    onConfirm({
      address: fullStreetAddress || addressDetails.address || 'Selected Residence',
      locality: addressDetails.locality,
      city: addressDetails.city,
      state: addressDetails.state,
      pincode: addressDetails.pincode,
      coordinates: {
        latitude: currentCoords.lat,
        longitude: currentCoords.lon,
      },
    });

    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-black/75 backdrop-blur-md animate-fadeIn">
      <div className="bg-surface-container w-full max-w-4xl h-[92vh] max-h-[820px] rounded-none border border-outline-variant/60 shadow-2xl flex flex-col overflow-hidden text-on-surface">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-outline-variant/40 flex items-center justify-between bg-surface-container-low shrink-0">
          <div>
            <div className="flex items-center gap-2">
              <span className="material-symbols-outlined text-[#E6C594] text-lg">pin_drop</span>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#E6C594] font-bold">
                Interactive Residence Pin
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-serif font-medium text-on-surface mt-0.5">
              Drag Pin to Your Exact Home or Society
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-on-surface-variant hover:text-on-surface transition-colors rounded-full hover:bg-surface-container"
            aria-label="Close"
          >
            <span className="material-symbols-outlined text-2xl">close</span>
          </button>
        </div>

        {/* Map Workspace Area */}
        <div className="relative flex-1 min-h-[300px] w-full overflow-hidden bg-[#e5e3df]">
          {/* Map DOM Element */}
          <div ref={mapContainerRef} className="w-full h-full z-0" />

          {/* Floating Search Bar */}
          <div className="absolute top-3 left-3 right-3 sm:left-4 sm:right-auto sm:w-[380px] z-[1000]">
            <div className="relative shadow-xl">
              <div className="flex items-center bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/80 px-3 py-2.5">
                <span className="material-symbols-outlined text-on-surface-variant text-lg mr-2">search</span>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search society, landmark, or area..."
                  className="w-full bg-transparent text-xs text-on-surface placeholder:text-on-surface-variant/50 outline-none"
                />
                {isSearching && (
                  <span className="material-symbols-outlined text-sm text-[#E6C594] animate-spin mr-1">
                    progress_activity
                  </span>
                )}
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('');
                      setSearchResults([]);
                    }}
                    className="text-on-surface-variant hover:text-on-surface text-xs"
                  >
                    <span className="material-symbols-outlined text-base">cancel</span>
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 bg-surface-container-lowest border border-outline-variant/80 shadow-2xl max-h-56 overflow-y-auto divide-y divide-outline-variant/30">
                  {searchResults.map((item, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => handleSelectPlace(item)}
                      className="w-full text-left p-3 hover:bg-surface-container transition-colors text-xs flex items-start gap-2.5"
                    >
                      <span className="material-symbols-outlined text-[#E6C594] text-base mt-0.5 shrink-0">
                        location_on
                      </span>
                      <div className="flex-1 min-w-0">
                        <div className="font-semibold text-on-surface truncate">{item.shortName}</div>
                        <div className="text-[11px] text-on-surface-variant/80 line-clamp-1">
                          {item.displayName}
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Map Layer Switcher (Street vs Satellite) */}
          <div className="absolute top-3 right-14 z-[1000] hidden sm:flex bg-surface-container-lowest/95 backdrop-blur-md border border-outline-variant/80 p-0.5 shadow-xl">
            <button
              type="button"
              onClick={() => handleToggleMapMode('street')}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mapMode === 'street'
                  ? 'bg-[#E6C594] text-[#12100E] shadow-sm'
                  : 'text-on-surface hover:text-[#E6C594]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">map</span>
              <span>Street</span>
            </button>
            <button
              type="button"
              onClick={() => handleToggleMapMode('satellite')}
              className={`flex items-center gap-1 px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider transition-all cursor-pointer ${
                mapMode === 'satellite'
                  ? 'bg-[#E6C594] text-[#12100E] shadow-sm'
                  : 'text-on-surface hover:text-[#E6C594]'
              }`}
            >
              <span className="material-symbols-outlined text-sm">satellite_alt</span>
              <span>Satellite</span>
            </button>
          </div>

          {/* Quick "Use My GPS" Button */}
          <div className="absolute bottom-4 right-4 z-[1000]">
            <button
              type="button"
              onClick={handleUseGps}
              disabled={isLocatingGps}
              className="flex items-center gap-2 px-4 py-2.5 bg-surface-container-lowest/95 hover:bg-surface-container border border-outline-variant/80 shadow-xl text-on-surface text-xs font-semibold uppercase tracking-wider transition-all disabled:opacity-50 cursor-pointer"
            >
              <span className={`material-symbols-outlined text-[#E6C594] text-base ${isLocatingGps ? 'animate-spin' : ''}`}>
                {isLocatingGps ? 'progress_activity' : 'my_location'}
              </span>
              <span>{isLocatingGps ? 'Detecting...' : 'Current GPS'}</span>
            </button>
          </div>

          {/* Live Status Pill */}
          {statusMessage && (
            <div className="absolute top-16 left-3 sm:left-4 z-[1000] bg-black/80 backdrop-blur-md text-[#E6C594] text-[11px] font-medium px-3 py-1.5 border border-[#E6C594]/40 shadow-lg flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-[#E6C594] animate-pulse"></span>
              <span>{statusMessage}</span>
            </div>
          )}
        </div>

        {/* Address Confirmation & Refinement Drawer */}
        <div className="p-4 sm:p-5 bg-surface-container-low border-t border-outline-variant/40 shrink-0 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Flat / House No */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Flat / House / Tower (Optional)
              </label>
              <input
                type="text"
                value={addressDetails.houseNumber}
                onChange={(e) =>
                  setAddressDetails((prev) => ({ ...prev, houseNumber: e.target.value }))
                }
                placeholder="e.g. Tower B, Flat 402"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface transition-colors"
              />
            </div>

            {/* Street / Road */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Detected Street / Road *
              </label>
              <input
                type="text"
                required
                value={addressDetails.address}
                onChange={(e) =>
                  setAddressDetails((prev) => ({ ...prev, address: e.target.value }))
                }
                placeholder="Street name"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface transition-colors"
              />
            </div>

            {/* Locality */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                Area / Colony / Society
              </label>
              <input
                type="text"
                value={addressDetails.locality}
                onChange={(e) =>
                  setAddressDetails((prev) => ({ ...prev, locality: e.target.value }))
                }
                placeholder="Locality"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface transition-colors"
              />
            </div>

            {/* City */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                City *
              </label>
              <input
                type="text"
                required
                value={addressDetails.city}
                onChange={(e) =>
                  setAddressDetails((prev) => ({ ...prev, city: e.target.value }))
                }
                placeholder="City"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface transition-colors"
              />
            </div>

            {/* State */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                State *
              </label>
              <input
                type="text"
                required
                value={addressDetails.state}
                onChange={(e) =>
                  setAddressDetails((prev) => ({ ...prev, state: e.target.value }))
                }
                placeholder="State"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface transition-colors"
              />
            </div>

            {/* PIN Code with auto verification */}
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-bold text-on-surface-variant mb-1">
                PIN Code *
              </label>
              <input
                type="text"
                required
                maxLength={6}
                value={addressDetails.pincode}
                onChange={handlePincodeChange}
                placeholder="6-digit PIN"
                className="w-full bg-surface-container-lowest border border-outline-variant px-3 py-2 text-xs text-on-surface outline-none focus:border-on-surface transition-colors font-mono"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between pt-2 border-t border-outline-variant/30 flex-wrap gap-3">
            <div className="text-[11px] text-on-surface-variant flex items-center gap-1.5">
              <span className="material-symbols-outlined text-sm text-[#E6C594]">info</span>
              <span>
                Coordinates: {currentCoords.lat.toFixed(5)}, {currentCoords.lon.toFixed(5)}
              </span>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="text-xs uppercase tracking-widest font-semibold px-4 py-2.5 text-on-surface-variant hover:text-on-surface transition-colors"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirm}
                disabled={isReverseGeocoding || !addressDetails.address || !addressDetails.city}
                className="inline-flex items-center gap-2 bg-[#E6C594] hover:bg-[#d4b07d] text-[#12100E] font-bold text-xs uppercase tracking-[0.2em] px-7 py-2.5 transition-all shadow-md disabled:opacity-50 cursor-pointer"
              >
                <span className="material-symbols-outlined text-base">check</span>
                <span>Confirm &amp; Use Address</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
