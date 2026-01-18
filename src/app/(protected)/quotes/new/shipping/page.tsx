"use client";

import { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  DollarSign, 
  MapPin, 
  Cpu,
  Shirt,
  Cog,
  Apple,
  FlaskConical,
  Pill,
  Box,
  Plane, 
  Ship, 
  Truck,
  AlertCircle,
  CheckCircle,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Search,
  Loader2,
  X,
  Building,
  Anchor,
  Navigation,
  Globe
} from 'lucide-react';
import DashboardHeader from '@/app/components/dashboard/DashboardHeader';

// Custom Date Picker Component (Նախորդից)
const CustomDatePicker = ({ 
  value, 
  onChange, 
  placeholder = "Select date",
  minDate,
  maxDate 
}: {
  value: string;
  onChange: (date: string) => void;
  placeholder?: string;
  minDate?: string;
  maxDate?: string;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(
    value ? new Date(value) : null
  );

  const today = new Date();
  const min = minDate ? new Date(minDate) : null;
  const max = maxDate ? new Date(maxDate) : null;

  const daysInMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentMonth.getFullYear(),
    currentMonth.getMonth(),
    1
  ).getDay();

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const handleDateSelect = (day: number) => {
    const selected = new Date(
      currentMonth.getFullYear(),
      currentMonth.getMonth(),
      day
    );
    
    if (min && selected < min) return;
    if (max && selected > max) return;
    
    setSelectedDate(selected);
    onChange(selected.toISOString().split('T')[0]);
    setIsOpen(false);
  };

  const prevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const nextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const isToday = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === today.toDateString();
  };

  const isSelected = (day: number) => {
    if (!selectedDate) return false;
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toDateString() === selectedDate.toDateString();
  };

  const isDisabled = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    if (min && date < min) return true;
    if (max && date > max) return true;
    return false;
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (isOpen && !(e.target as Element).closest('.date-picker-container')) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  return (
    <div className="relative date-picker-container">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors flex items-center justify-between bg-white"
      >
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 text-gray-400" />
          <span className={value ? "text-gray-900" : "text-gray-500"}>
            {value ? formatDate(new Date(value)) : placeholder}
          </span>
        </div>
        <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute z-50 mt-1 bg-white rounded-xl shadow-lg border border-gray-200 p-4 w-80">
          <div className="flex items-center justify-between mb-4">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <div className="font-semibold text-gray-900">
              {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
            </div>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>

          <div className="grid grid-cols-7 gap-1 mb-2">
            {days.map(day => (
              <div key={day} className="text-center text-sm font-medium text-gray-500 py-1">
                {day}
              </div>
            ))}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: firstDayOfMonth }).map((_, index) => (
              <div key={`empty-${index}`} />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const disabled = isDisabled(day);
              const today = isToday(day);
              const selected = isSelected(day);
              
              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  disabled={disabled}
                  className={`
                    h-8 rounded-lg text-sm transition-all duration-200
                    ${selected
                      ? 'bg-blue-500 text-white hover:bg-blue-600'
                      : today
                      ? 'bg-blue-100 text-blue-700 hover:bg-blue-200'
                      : 'hover:bg-gray-100 text-gray-900'
                    }
                    ${disabled ? 'opacity-30 cursor-not-allowed hover:bg-transparent' : ''}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100">
            <button
              type="button"
              onClick={() => {
                setSelectedDate(today);
                onChange(today.toISOString().split('T')[0]);
                setIsOpen(false);
              }}
              className="w-full py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
            >
              Select Today
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// LocationIQ Autocomplete Component
interface LocationIQFeature {
  place_id: string;
  licence: string;
  osm_type: string;
  osm_id: number;
  boundingbox: [string, string, string, string];
  lat: string;
  lon: string;
  display_name: string;
  class: string;
  type: string;
  importance: number;
  icon?: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    state?: string;
    country?: string;
    country_code?: string;
    postcode?: string;
    road?: string;
    suburb?: string;
    county?: string;
    neighbourhood?: string;
    house_number?: string;
  };
}

interface LocationData {
  name: string;
  city: string;
  country: string;
  countryCode: string;
  type: 'port' | 'airport' | 'city' | 'place' | 'harbor' | 'dock';
  portCode?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
  fullAddress: string;
  osmId?: string;
}

const LocationIQAutocomplete = ({
  value,
  onChange,
  placeholder,
  label,
  required = false
}: {
  value: LocationData | null;
  onChange: (location: LocationData | null) => void;
  placeholder: string;
  label: string;
  required?: boolean;
}) => {
  const [inputValue, setInputValue] = useState(value?.name || '');
  const [suggestions, setSuggestions] = useState<LocationIQFeature[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [apiStatus, setApiStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const inputRef = useRef<HTMLInputElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const debounceTimeout = useRef<NodeJS.Timeout>();

  // ✅ CORRECT LocationIQ API Key
  const LOCATIONIQ_API_KEY = process.env.NEXT_PUBLIC_LOCATIONIQ_API_KEY || 'pk.f15b5391da0772168ecba607d5fe3136';

  // Shipping-specific keywords
  const SHIPPING_KEYWORDS = [
    'port', 'harbor', 'dock', 'terminal', 'seaport', 'marina',
    'airport', 'airfield', 'airstrip', 'airbase',
    'logistics', 'freight', 'cargo', 'shipping', 'container'
  ];

  // Local fallback database
  const LOCAL_PORTS_DB = [
      { name: 'Tokyo City', city: 'Tokyo', country: 'Japan', type: 'city' as const, lat: 35.68, lon: 139.76 },
  ];

  // Handle click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Debounced search
  useEffect(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    if (inputValue.length < 2) {
      setSuggestions([]);
      return;
    }

    debounceTimeout.current = setTimeout(async () => {
      await searchLocations(inputValue);
    }, 350);

    return () => {
      if (debounceTimeout.current) {
        clearTimeout(debounceTimeout.current);
      }
    };
  }, [inputValue]);

  useEffect(() => {
  if (value) {
    setInputValue(value.name);
    setShowSuggestions(false);
  }
}, [value]);

 const searchLocations = async (query: string) => {
  if (query.length < 2) return;

  setIsLoading(true);
  setApiStatus('loading');
  
  try {
    // 1. Local results (instant)
    const localResults = searchLocalDatabase(query);
    
    // Show local results immediately
    if (localResults.length > 0) {
      setSuggestions(localResults);
      setApiStatus('success');
      setShowSuggestions(true);
    }

    // 2. Try LocationIQ
    let locationIQResults: LocationIQFeature[] = [];
    try {
      const apiKey = 'pk.f15b5391da0772168ecba607d5fe3136';
      const response = await fetch(
        `https://api.locationiq.com/v1/autocomplete.php?` +
        `key=${apiKey}&` +
        `q=${encodeURIComponent(query)}&` +
        `limit=5&` +
        `format=json`
      );
      
      if (response.ok) {
        const data = await response.json();
        locationIQResults = data || [];
      }
    } catch (locationIQError) {
      console.log('LocationIQ failed, trying OpenStreetMap...');
    }

    // 3. Try OpenStreetMap as fallback
    let osmResults: LocationIQFeature[] = [];
    if (locationIQResults.length === 0) {
      try {
        const response = await fetch(
          `https://nominatim.openstreetmap.org/search?` +
          `format=json&` +
          `q=${encodeURIComponent(query)}&` +
          `addressdetails=1&` +
          `limit=5&` +
          `email=contact@shippingapp.com`
        );
        
        if (response.ok) {
          const data = await response.json();
          osmResults = data.map((place: any) => ({
            place_id: place.place_id,
            licence: place.licence,
            osm_type: place.osm_type,
            osm_id: place.osm_id,
            boundingbox: place.boundingbox,
            lat: place.lat,
            lon: place.lon,
            display_name: place.display_name,
            class: place.class,
            type: place.type,
            importance: place.importance,
            address: place.address
          }));
        }
      } catch (osmError) {
        console.log('OpenStreetMap also failed');
      }
    }

    // Combine all results
    const allResults = [...localResults, ...locationIQResults, ...osmResults]
      .filter((v, i, a) => 
        a.findIndex(t => t.place_id === v.place_id) === i
      )
      .slice(0, 8);

    setSuggestions(allResults);
    setApiStatus(allResults.length > 0 ? 'success' : 'error');
    setShowSuggestions(true);
    
  } catch (error) {
    console.error('Final search error:', error);
    setApiStatus('error');
    
    // Final fallback: just local
    const localResults = searchLocalDatabase(query);
    setSuggestions(localResults);
    setShowSuggestions(localResults.length > 0);
    
  } finally {
    setIsLoading(false);
  }
};
  const searchLocalDatabase = (query: string): LocationIQFeature[] => {
    const normalizedQuery = query.toLowerCase();
    
    return LOCAL_PORTS_DB
      .filter(location =>
        location.name.toLowerCase().includes(normalizedQuery) ||
        location.city.toLowerCase().includes(normalizedQuery) ||
        location.country.toLowerCase().includes(normalizedQuery)
      )
      .map(location => ({
        place_id: `local-${location.code || location.name}`,
        licence: 'Local Database',
        osm_type: 'local',
        osm_id: 0,
        boundingbox: ['0', '0', '0', '0'],
        lat: location.lat.toString(),
        lon: location.lon.toString(),
        display_name: location.name,
        class: location.type === 'port' ? 'transport' : location.type === 'airport' ? 'transport' : 'place',
        type: location.type,
        importance: 0.9,
        address: {
          city: location.city,
          country: location.country,
          country_code: location.code?.substring(0, 2) || ''
        }
      }))
      .slice(0, 4);
  };

  const handleSelect = (feature: LocationIQFeature) => {
    const locationData = extractLocationData(feature);
    onChange(locationData);
    setInputValue(locationData.name);
    // setShowSuggestions(false);
  };

  const extractLocationData = (feature: LocationIQFeature): LocationData => {
    const isLocal = feature.osm_type === 'local';
    
    let type: LocationData['type'] = 'place';
    if (feature.class === 'transport') {
      if (feature.type === 'airport' || feature.display_name.toLowerCase().includes('airport')) {
        type = 'airport';
      } else if (['port', 'harbor', 'dock'].includes(feature.type || '') || 
                 feature.display_name.toLowerCase().includes('port')) {
        type = 'port';
      } else {
        type = 'place';
      }
    } else if (['city', 'town', 'village'].includes(feature.type || '')) {
      type = 'city';
    }

    const city = feature.address?.city || feature.address?.town || feature.address?.village || '';
    const country = feature.address?.country || '';
    const countryCode = feature.address?.country_code?.toUpperCase() || '';

    // Generate port code
    let portCode: string | undefined;
    if (type === 'port' || type === 'airport') {
      if (isLocal) {
        const localPort = LOCAL_PORTS_DB.find(p => p.name === feature.display_name);
        portCode = localPort?.code;
      } else {
        const baseCode = feature.display_name
          .replace(/port|airport|international|seaport|harbor|terminal/gi, '')
          .trim()
          .substring(0, 3)
          .toUpperCase();
        portCode = countryCode ? `${baseCode}-${countryCode}` : baseCode;
      }
    }

    return {
      name: feature.display_name.split(',')[0],
      city: city || feature.display_name.split(',')[0],
      country,
      countryCode,
      type,
      portCode,
      coordinates: {
        lat: parseFloat(feature.lat),
        lng: parseFloat(feature.lon)
      },
      fullAddress: feature.display_name,
      osmId: isLocal ? undefined : feature.place_id
    };
  };

  const clearSelection = () => {
    setInputValue('');
    onChange(null);
    setSuggestions([]);
    setShowSuggestions(false);
    inputRef.current?.focus();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case 'port':
      case 'harbor':
      case 'dock':
        return <Anchor className="h-4 w-4" />;
      case 'airport':
        return <Plane className="h-4 w-4" />;
      case 'city':
        return <Building className="h-4 w-4" />;
      default:
        return <MapPin className="h-4 w-4" />;
    }
  };

  const getTypeLabel = (type: string): string => {
    switch (type) {
      case 'port': return 'Sea Port';
      case 'airport': return 'Airport';
      case 'city': return 'City';
      default: return 'Location';
    }
  };

  return (
    <div className="relative" ref={containerRef}>
      <label className="block text-sm font-medium text-[#868686] mb-2">
        {label} {required && '*'}
      </label>
      
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <MapPin className="h-5 w-5 text-gray-400" />
        </div>
        
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onFocus={() => setShowSuggestions(true)}
          onBlur={() => {
            // Add a small delay to allow click event to register
            setTimeout(() => {
              if (!inputRef.current?.matches(':focus')) {
                setShowSuggestions(false);
              }
            }, 200);
          }}
          placeholder={placeholder}
          className="pl-10 pr-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
          required={required && !value}
        />
        
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
          {isLoading ? (
            <Loader2 className="h-4 w-4 text-gray-400 animate-spin" />
          ) : inputValue ? (
            <button
              type="button"
              onClick={clearSelection}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X className="h-4 w-4 text-gray-400" />
            </button>
          ) : (
            <Search className="h-4 w-4 text-gray-400" />
          )}
        </div>
      </div>

      {/* Selected location details */}
      {value && (
        <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-100">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div className="flex items-center gap-1">
                  {getIcon(value.type)}
                  <span className="text-sm font-medium text-blue-900 ml-1">
                    {value.name}
                  </span>
                </div>
                <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
                  value.type === 'port' 
                    ? 'bg-blue-100 text-blue-800'
                    : value.type === 'airport'
                    ? 'bg-purple-100 text-purple-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {getTypeLabel(value.type)}
                </span>
              </div>
              <div className="text-xs text-gray-600">
                {value.city}, {value.country}
              </div>
              {value.portCode && (
                <div className="mt-1 text-xs font-medium text-gray-700">
                  Port Code: <code className="bg-white px-1.5 py-0.5 rounded border">{value.portCode}</code>
                </div>
              )}
              {apiStatus === 'success' && (
                <div className="mt-1 text-xs text-gray-500 flex items-center gap-1">
                  <Globe className="h-3 w-3" />
                  Powered by LocationIQ
                </div>
              )}
            </div>
            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
          </div>
        </div>
      )}

      {/* Suggestions dropdown */}
      {showSuggestions && suggestions.length > 0 && (
        <div className="absolute z-50 mt-1 w-full bg-white rounded-xl shadow-lg border border-gray-200 max-h-64 overflow-y-auto">
          <div className="py-2">
            {suggestions.map((feature) => {
              const type = feature.class === 'transport' 
                ? (feature.display_name.toLowerCase().includes('airport') ? 'airport' : 'port')
                : feature.type || 'place';
              
              const isLocal = feature.osm_type === 'local';
              
              return (
                <button
                  key={`${feature.place_id}-${feature.osm_id}`}
                  type="button"
                  onClick={() => handleSelect(feature)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 transition-colors flex items-start gap-3"
                >
                  <div className="flex-shrink-0 mt-0.5">
                    <div className={`h-6 w-6 rounded-full flex items-center justify-center ${
                      type === 'port' ? 'bg-blue-100' :
                      type === 'airport' ? 'bg-purple-100' :
                      'bg-gray-100'
                    }`}>
                      {getIcon(type)}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-medium text-gray-900 truncate">
                      {feature.display_name.split(',')[0]}
                    </div>
                    <div className="text-sm text-gray-500 truncate">
                      {feature.display_name.split(',').slice(1).join(',').trim() || 
                       `${feature.address?.city || ''}, ${feature.address?.country || ''}`}
                    </div>
                    <div className="mt-1 flex items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                        type === 'port' ? 'bg-blue-100 text-blue-800' :
                        type === 'airport' ? 'bg-purple-100 text-purple-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {getTypeLabel(type)}
                      </span>
                      {isLocal && (
                        <span className="text-xs text-gray-500">📋 Local</span>
                      )}
                      {!isLocal && feature.importance > 0.6 && (
                        <span className="text-xs text-gray-500">✓ Good match</span>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
          
          <div className="px-4 py-2 border-t border-gray-100 bg-gray-50 rounded-b-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Navigation className="h-3 w-3" />
                <span>Powered by LocationIQ</span>
              </div>
              <div className="text-xs text-gray-400">
                10,000 free requests/day
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function ShippingValuePage() {
  // State-ներ
  const [cargoType, setCargoType] = useState('');
  const [shipmentValue, setShipmentValue] = useState('');
  const [origin, setOrigin] = useState<LocationData | null>(null);
  const [destination, setDestination] = useState<LocationData | null>(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [transportationMode, setTransportationMode] = useState('');
  const [step, setStep] = useState(1);

  // Get dates
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowFormatted = tomorrow.toISOString().split('T')[0];

  // Cargo options
  const cargoOptions = [
    { value: 'electronics', label: 'Electronics', icon: Cpu },
    { value: 'clothing', label: 'Clothing', icon: Shirt },
    { value: 'machinery', label: 'Machinery', icon: Cog },
    { value: 'food', label: 'Food Products', icon: Apple },
    { value: 'chemicals', label: 'Chemicals', icon: FlaskConical },
    { value: 'pharma', label: 'Pharmaceuticals', icon: Pill },
    { value: 'other', label: 'Other', icon: Box },
  ];

  // Transport modes
  const transportModes = [
    { id: 'sea', name: 'Sea Freight', icon: Ship, color: 'blue' },
    { id: 'air', name: 'Air Freight', icon: Plane, color: 'emerald' },
    { id: 'road', name: 'Road Freight', icon: Truck, color: 'amber' },
  ];

  // Progress steps
  const steps = [
    { id: 1, name: 'Shipment Details', status: 'current' },
    { id: 2, name: 'Coverage Options', status: 'upcoming' },
    { id: 3, name: 'Quote Review', status: 'upcoming' },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const formData = {
      cargoType,
      shipmentValue: parseFloat(shipmentValue),
      origin: origin ? {
        name: origin.name,
        city: origin.city,
        country: origin.country,
        countryCode: origin.countryCode,
        portCode: origin.portCode,
        type: origin.type,
        coordinates: origin.coordinates,
        fullAddress: origin.fullAddress,
      } : null,
      destination: destination ? {
        name: destination.name,
        city: destination.city,
        country: destination.country,
        countryCode: destination.countryCode,
        portCode: destination.portCode,
        type: destination.type,
        coordinates: destination.coordinates,
        fullAddress: destination.fullAddress,
      } : null,
      coveragePeriod: {
        startDate,
        endDate,
        durationDays: Math.ceil(
          (new Date(endDate).getTime() - new Date(startDate).getTime()) / (1000 * 60 * 60 * 24)
        )
      },
      transportationMode,
      timestamp: new Date().toISOString()
    };
    
    console.log('Shipping Quote Form Submitted:', formData);
    setStep(2);
  };

  const handleCancel = () => {
    if (window.confirm('Are you sure you want to cancel? All entered data will be lost.')) {
      setCargoType('');
      setShipmentValue('');
      setOrigin(null);
      setDestination(null);
      setStartDate('');
      setEndDate('');
      setTransportationMode('');
      setStep(1);
    }
  };

  // Calculate completion
  const completedFields = [
    !!cargoType,
    !!shipmentValue,
    !!origin,
    !!destination,
    !!startDate,
    !!endDate,
    !!transportationMode
  ].filter(Boolean).length;

  const totalFields = 7;
  const completionPercentage = Math.round((completedFields / totalFields) * 100);
  const isFormComplete = completedFields === totalFields;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <DashboardHeader userEmail="client@example.com" />
      
      <div className="max-w-[100%] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
            <button 
              onClick={() => window.history.back()}
              className="flex items-center gap-2 hover:text-gray-700 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Quotes</span>
            </button>
            <span>/</span>
            <span className="text-gray-900 font-medium">New Quote</span>
          </div>
          
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h1 className="text-2xl font-bold text-gray-900">Create Shipping Insurance Quote</h1>
              <span className="text-sm text-gray-500">Step {step} of 3</span>
            </div>
            
            <div className="flex items-center">
              {steps.map((stepItem, index) => (
                <div key={stepItem.id} className="flex items-center">
                  <div className={`
                    flex items-center justify-center w-8 h-8 rounded-full border-2
                    ${stepItem.id === step 
                      ? 'border-blue-600 bg-blue-600 text-white' 
                      : stepItem.id < step
                      ? 'border-green-500 bg-green-500 text-white'
                      : 'border-gray-300 bg-white text-gray-400'
                    }
                  `}>
                    {stepItem.id < step ? (
                      <CheckCircle className="w-4 h-4" />
                    ) : (
                      stepItem.id
                    )}
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    stepItem.id === step ? 'text-blue-600' : 
                    stepItem.id < step ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {stepItem.name}
                  </span>
                  {index < steps.length - 1 && (
                    <div className={`h-0.5 w-16 mx-4 ${
                      stepItem.id < step ? 'bg-green-500' : 'bg-gray-300'
                    }`} />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[2fr_0.02fr_0.7fr]">
          <div className="lg:col-span-2 w-[99%]">
            <div className="bg-[#FFFFFE] rounded-2xl shadow-lg border border-gray-200 p-8">
              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Cargo Type Section */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Cargo Information</h2>
                  </div>
                  
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-[#868686] mb-2">
                        Cargo Type *
                      </label>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                        {cargoOptions.map((option) => {
                          const Icon = option.icon;
                          return (
                            <button
                              key={option.value}
                              type="button"
                              onClick={() => setCargoType(option.value)}
                              className={`
                                p-4 rounded-xl border-2 transition-all duration-200
                                ${cargoType === option.value
                                  ? 'border-blue-500 bg-blue-50'
                                  : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                }
                              `}
                            >
                              <div className="flex flex-col items-center gap-2">
                                <div className={`
                                  p-3 rounded-lg
                                  ${cargoType === option.value
                                    ? 'bg-blue-100 text-blue-600'
                                    : 'bg-gray-100 text-gray-600'
                                  }
                                `}>
                                  <Icon className="w-4 h-4" />
                                </div>
                                <span className="text-sm font-medium text-[#868686]">
                                  {option.label}
                                </span>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-[#868686] mb-2">
                        Shipment Value (USD) *
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                          <DollarSign className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          type="number"
                          value={shipmentValue}
                          onChange={(e) => setShipmentValue(e.target.value)}
                          placeholder="Enter total value"
                          className="pl-10 w-full h-12 px-4 rounded-xl border border-gray-300 focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none transition-colors"
                          required
                          min="0"
                          step="0.01"
                        />
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <span className="text-gray-500 text-sm">USD</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Route Information */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <h2 className="text-lg font-semibold text-gray-900">Route Information</h2>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <LocationIQAutocomplete
                        value={origin}
                        onChange={setOrigin}
                        placeholder="Search port, airport, or city..."
                        label="Origin *"
                        required
                      />
                    </div>

                    <div>
                      <LocationIQAutocomplete
                        value={destination}
                        onChange={setDestination}
                        placeholder="Search port, airport, or city..."
                        label="Destination *"
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Dates & Transport */}
                <div className="">
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Coverage Period</h2>
                    </div>
                    
                    <div className="space-y-4 flex justify-between">
                      <div className='w-[49%]'>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Start Date *
                        </label>
                        <CustomDatePicker
                          value={startDate || today}
                          onChange={setStartDate}
                          placeholder="Select start date"
                          minDate={today}
                        />
                      </div>

                      <div className='w-[48.8%]'>
                        <label className="block text-sm font-medium text-[#868686] mb-2">
                          End Date *
                        </label>
                        <CustomDatePicker
                          value={endDate || tomorrowFormatted}
                          onChange={setEndDate}
                          placeholder="Select end date"
                          minDate={startDate || today}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <h2 className="text-lg font-semibold text-gray-900">Transport Mode *</h2>
                    </div>
                    
                    <div className="space-y-3 flex justify-between">
                      {transportModes.map((mode) => {
                        const Icon = mode.icon;
                        return (
                          <button
                            key={mode.id}
                            type="button"
                            onClick={() => setTransportationMode(mode.id)}
                            className={`
                              w-[32.7%] relative p-4 rounded-xl border-2 transition-all duration-200
                              flex flex-col items-center gap-4 mb-0
                              ${transportationMode === mode.id
                                ? 'border-blue-500 bg-blue-50'
                                : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                              }
                            `}
                          >
                            <div className={`
                              p-3 rounded-lg
                              ${transportationMode === mode.id
                                ? `bg-blue-100 text-blue-600`
                                : 'bg-gray-100 text-gray-500'
                              }
                            `}>
                              <Icon className="w-4 h-4" />
                            </div>
                            <div className="flex-1 text-center">
                              <div className="font-medium text-gray-900">{mode.name}</div>
                              <div className="text-sm text-gray-500">
                                {mode.id === 'sea' && 'Most economical, 20-40 days'}
                                {mode.id === 'air' && 'Fastest option, 2-7 days'}
                                {mode.id === 'road' && 'Regional delivery, 3-10 days'}
                              </div>
                            </div>
                            {transportationMode === mode.id && (
                              <div className="w-5 h-5 absolute top-2 right-2 rounded-full bg-blue-500 flex items-center justify-center">
                                <CheckCircle className="w-3 h-3 text-white" />
                              </div>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-between pt-6 border-t border-gray-200">
                  <button
                    type="button"
                    onClick={handleCancel}
                    className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                  >
                    Cancel
                  </button>
                  
                  <div className="flex items-center gap-4">
                    <button
                      type="button"
                      onClick={() => setStep(step - 1)}
                      className="px-6 py-3 rounded-xl border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors font-medium"
                    >
                      Previous
                    </button>
                    <button
                      type="submit"
                      disabled={!isFormComplete}
                      className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium hover:from-blue-700 hover:to-blue-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-lg hover:shadow-xl"
                    >
                      Continue to Coverage Options
                    </button>
                  </div>
                </div>
              </form>
            </div>
          </div>

          {/* Right Column - Tips & Help */}
          <div className="space-y-6">
            <div className="bg-[url('/quotes/new/shipping-wd-back.png')] bg-cover flex flex-col gap-8 rounded-2xl shadow-lg p-6 text-white">
              <div className="flex items-center gap-2 mb-4">
                <h3 className="text-lg font-semibold">Smart Quote Tips</h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Full Coverage:</span> Include all freight charges and duties in shipment value for complete protection.
                  </p>
                </div>
                
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="w-3 h-3" />
                  </div>
                  <p className="text-sm leading-relaxed">
                    <span className="font-semibold">Lower Premiums:</span> Accurate cargo classification can reduce premiums by up to 30%.
                  </p>
                </div>

                <div>
                  <div className="pt-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm text-gray-600 text-white">Progress</span>
                      <span className="text-sm font-semibold text-white">
                        {completedFields} of {totalFields}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div 
                        className="bg-white h-3 rounded-full transition-all duration-300"
                        style={{ width: `${completionPercentage}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
              <div className="flex items-center gap-2 mb-3">
                <AlertCircle className="w-5 h-5 text-amber-500" />
                <h3 className="text-lg font-semibold text-gray-900">Need Help?</h3>
              </div>
              <p className="text-sm text-gray-600 mb-4">
                Our team is here to assist you with any questions about your shipment insurance.
              </p>
              <button className="w-full py-3 rounded-xl border-2 border-blue-600 text-blue-600 font-medium hover:bg-blue-50 transition-colors">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}