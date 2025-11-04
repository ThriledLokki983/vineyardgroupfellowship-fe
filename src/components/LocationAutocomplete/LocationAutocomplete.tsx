import { useRef, useEffect } from 'react';
import type { LocationAutocompleteProps, PlaceData } from 'types/components/location';
import { APIProvider, useMapsLibrary } from '@vis.gl/react-google-maps';
import styles from './LocationAutocomplete.module.scss';

const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

function LocationAutocompleteInput({
  value,
  onChange,
  onPlaceSelect,
  placeholder = 'Enter your location',
  className = '',
  disabled = false,
  label,
  error,
  required = false,
}: LocationAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const places = useMapsLibrary('places');

  // Initialize Google Places Autocomplete
  // Note: Using legacy Autocomplete API (deprecated as of March 2025)
  // Google will provide 12+ months notice before discontinuation
  // TODO: Migrate to PlaceAutocompleteElement when @vis.gl/react-google-maps supports it
  useEffect(() => {
    if (!places || !inputRef.current) return;

    // Extract structured data from Google Place
    const extractPlaceData = (place: google.maps.places.PlaceResult): PlaceData => {
      const addressComponents = place.address_components || [];

      const getComponent = (type: string): string | undefined => {
        const component = addressComponents.find((comp) =>
          comp.types.includes(type)
        );
        return component?.long_name;
      };

      return {
        formattedAddress: place.formatted_address || '',
        city: getComponent('locality') || getComponent('administrative_area_level_2'),
        state: getComponent('administrative_area_level_1'),
        country: getComponent('country'),
        postalCode: getComponent('postal_code'),
        latitude: place.geometry?.location?.lat(),
        longitude: place.geometry?.location?.lng(),
      };
    };

    const autocompleteInstance = new places.Autocomplete(inputRef.current);

    // Handle place selection
    const handlePlaceChanged = () => {
      const place = autocompleteInstance.getPlace();

      if (place.geometry && place.formatted_address) {
        const placeData = extractPlaceData(place);
        onChange(place.formatted_address, placeData);

        if (onPlaceSelect) {
          onPlaceSelect(placeData);
        }
      }
    };

    autocompleteInstance.addListener('place_changed', handlePlaceChanged);

    return () => {
      if (autocompleteInstance) {
        google.maps.event.clearInstanceListeners(autocompleteInstance);
      }
    };
  }, [places, onChange, onPlaceSelect]);

  // Handle manual input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className={`${styles.container} ${className}`}>
      {label && (
        <label htmlFor="location-input" className={styles.label}>
          {label}
          {required && <span className={styles.required}>*</span>}
        </label>
      )}

      <div className={styles.inputWrapper}>
        <input
          ref={inputRef}
          id="location-input"
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`${styles.input} ${error ? styles.inputError : ''}`}
          aria-label={label || 'Location'}
          aria-describedby={error ? 'location-error' : undefined}
          aria-invalid={!!error}
          aria-required={required}
          autoComplete="off"
        />
      </div>

      {error && (
        <p id="location-error" className={styles.errorMessage} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

export default function LocationAutocomplete(props: LocationAutocompleteProps) {
  if (!API_KEY) {
    console.error('Google Maps API key is missing. Please add VITE_GOOGLE_MAPS_API_KEY to your .env file.');
    return (
      <div className={styles.error}>
        <p>Location autocomplete is not configured. Please contact support.</p>
      </div>
    );
  }

  return (
    <APIProvider apiKey={API_KEY} libraries={['places']}>
      <LocationAutocompleteInput {...props} />
    </APIProvider>
  );
}
