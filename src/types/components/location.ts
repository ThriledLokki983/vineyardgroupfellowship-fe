/**
 * Location Autocomplete Component Types
 * Types for Google Places Autocomplete integration
 */

export interface PlaceData {
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}

export interface LocationAutocompleteProps {
  value: string;
  onChange: (location: string, placeData?: PlaceData) => void;
  onPlaceSelect?: (placeData: PlaceData) => void;
  placeholder?: string;
  className?: string;
  disabled?: boolean;
  label?: string;
  error?: string;
  required?: boolean;
}
