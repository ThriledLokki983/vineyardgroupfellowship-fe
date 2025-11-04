# LocationAutocomplete Component

A Google Places Autocomplete integration component for location input with accessibility-first design.

## Features

- ✅ Real-time Google Places autocomplete suggestions
- ✅ Extracts structured location data (city, state, country, coordinates)
- ✅ Accessible (WCAG 2.1 AA compliant with ARIA labels)
- ✅ Loading states with visual feedback
- ✅ Error handling for API failures
- ✅ Keyboard navigation support
- ✅ Mobile-friendly
- ✅ Follows Vineyard Group Fellowship design system

## Usage

### Basic Example

```tsx
import LocationAutocomplete from 'components/LocationAutocomplete';
import type { PlaceData } from 'types/components/location';
import { useState } from 'react';

function MyComponent() {
  const [location, setLocation] = useState('');
  const [placeData, setPlaceData] = useState<PlaceData | null>(null);

  const handleLocationChange = (newLocation: string, data?: PlaceData) => {
    setLocation(newLocation);
    if (data) {
      setPlaceData(data);
      console.log('Selected:', data);
      // {
      //   formattedAddress: "123 Main St, New York, NY 10001, USA",
      //   city: "New York",
      //   state: "New York",
      //   country: "United States",
      //   postalCode: "10001",
      //   latitude: 40.7128,
      //   longitude: -74.0060
      // }
    }
  };

  return (
    <LocationAutocomplete
      label="Location"
      value={location}
      onChange={handleLocationChange}
      placeholder="Enter your city or location"
    />
  );
}
```

### With Form Validation

```tsx
<LocationAutocomplete
  label="Location"
  value={formData.location}
  onChange={handleLocationChange}
  placeholder="Enter your city or location"
  required
  error={errors.location}
  disabled={isSaving}
/>
```

### Custom Styling

```tsx
<LocationAutocomplete
  label="Location"
  value={location}
  onChange={handleLocationChange}
  className={styles.customLocationInput}
/>
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `value` | `string` | - | **Required.** Current location value |
| `onChange` | `(location: string, placeData?: PlaceData) => void` | - | **Required.** Called when location changes |
| `onPlaceSelect` | `(placeData: PlaceData) => void` | - | Optional callback when a place is selected from autocomplete |
| `placeholder` | `string` | `'Enter your location'` | Input placeholder text |
| `label` | `string` | - | Label text displayed above input |
| `error` | `string` | - | Error message to display |
| `required` | `boolean` | `false` | Whether the field is required |
| `disabled` | `boolean` | `false` | Disable the input |
| `className` | `string` | - | Additional CSS classes |

## PlaceData Type

```typescript
interface PlaceData {
  formattedAddress: string;
  city?: string;
  state?: string;
  country?: string;
  postalCode?: string;
  latitude?: number;
  longitude?: number;
}
```

## Environment Setup

The component requires the Google Maps API key to be configured:

```env
VITE_GOOGLE_MAPS_API_KEY=your_api_key_here
```

**Important:** The API key must be restricted in Google Cloud Console:
- **Application restrictions:** HTTP referrers (localhost:3000, your production domain)
- **API restrictions:** Places API (New), Maps JavaScript API, Geocoding API

## Styling

The component uses SCSS modules with Open Props design tokens. The autocomplete dropdown is styled using global classes:

- `.pac-container` - Dropdown container
- `.pac-item` - Individual suggestion
- `.pac-item-query` - Main text in suggestion
- `.pac-matched` - Highlighted matching text

Custom styling example:

```scss
.customLocationInput {
  :global(.pac-container) {
    border-color: var(--brand);
  }
}
```

## Accessibility

- Proper ARIA labels for screen readers
- Keyboard navigation support (arrow keys, enter, escape)
- Focus management
- Error announcements with `role="alert"`
- Required field indicator

## Error Handling

The component handles several error scenarios:

1. **Missing API Key:** Shows error message asking user to contact support
2. **Network Errors:** Gracefully degrades to plain text input
3. **No Results:** User can still type custom location

## Usage in ProfilePage

Already integrated in ProfilePage:

```tsx
<LocationAutocomplete
  label="Location"
  value={formData?.location || ''}
  onChange={handleLocationChange}
  placeholder="Enter your city or location"
  className={styles.locationInput}
/>
```

The structured location data is stored for future backend integration (city, state, country, coordinates).

## API Usage & Billing

**Free Tier:** $200/month credit = ~28,000 autocomplete requests

**Optimization Techniques:**
- Autocomplete triggers after 3+ characters (configurable)
- Results limited to 5 suggestions
- sessionToken used for billing optimization
- No unnecessary API calls on every keystroke

## Future Enhancements

Potential improvements:

1. **Group Location Autocomplete** - Add to CreateGroupModal
2. **Map View** - Show locations on interactive map
3. **Distance Calculation** - Find groups near user
4. **Location-based Search** - Filter groups by proximity
5. **Geolocation Button** - "Use My Current Location" feature
6. **Country Restrictions** - Limit autocomplete to specific regions

## Browser Support

Compatible with:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile Safari (iOS)
- Chrome Mobile (Android)

## Dependencies

- `@vis.gl/react-google-maps` - Modern React wrapper for Google Maps
- `@types/google.maps` - TypeScript definitions

### Deprecation Notice

This component currently uses the legacy `google.maps.places.Autocomplete` API, which Google deprecated as of March 1st, 2025. However:

- ✅ **Still fully functional** - The API continues to work without issues
- ✅ **12+ months support** - Google guarantees at least 12 months notice before discontinuation
- ✅ **Bug fixes** - Major regressions will still be fixed
- ⚠️ **Console warning** - You'll see a deprecation warning in the browser console (this is expected)

**Future Migration Path:**
When `@vis.gl/react-google-maps` adds support for `PlaceAutocompleteElement` (the new recommended API), we will migrate. The migration is tracked in the component's TODO comments.

For more information, see:
- [Google Maps Legacy APIs](https://developers.google.com/maps/legacy)
- [Places Migration Guide](https://developers.google.com/maps/documentation/javascript/places-migration-overview)

## Testing

Manual testing checklist:
- [ ] Autocomplete appears when typing
- [ ] Suggestions are relevant
- [ ] Selecting suggestion populates input
- [ ] Structured data captured correctly
- [ ] Keyboard navigation works
- [ ] Mobile-friendly
- [ ] Error states display
- [ ] Accessible with screen readers

## Troubleshooting

### "Location autocomplete is not configured"
- Verify `VITE_GOOGLE_MAPS_API_KEY` is set in `.env`
- Restart dev server after adding env variable

### Autocomplete not showing
- Check API key restrictions in Google Cloud Console
- Verify domain is in allowed referrers list
- Check browser console for API errors

### "This API key is not authorized"
- Add current domain to API key restrictions
- Enable required APIs (Places, Maps JavaScript, Geocoding)

## Resources

- [Google Places API Docs](https://developers.google.com/maps/documentation/places/web-service/overview)
- [React Google Maps Library](https://visgl.github.io/react-google-maps/)
- [Google Maps Platform Pricing](https://mapsplatform.google.com/pricing/)
