# SocialMediaLocationBar Component

A fully customizable React component for displaying social media icons and location button with extensive styling and behavior options.

## Features

- **Social Media Support**: Facebook, Instagram, Twitter, WhatsApp, Telegram
- **Location Integration**: Google Maps integration with coordinates or custom URL
- **Fully Customizable**: Sizes, spacing, orientation, colors, and styles
- **Theme Support**: Integrates with existing theme system
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Custom Handlers**: Override default click behaviors
- **Responsive**: Works on all screen sizes
- **TypeScript**: Full type safety

## Props

### Core Props

| Prop          | Type                | Default     | Description                     |
| ------------- | ------------------- | ----------- | ------------------------------- |
| `socialMedia` | `SocialMediaConfig` | `undefined` | Social media URLs configuration |
| `location`    | `LocationConfig`    | `undefined` | Location configuration          |
| `className`   | `string`            | `""`        | Additional CSS classes          |

### Styling Props

| Prop            | Type                            | Default        | Description                                |
| --------------- | ------------------------------- | -------------- | ------------------------------------------ |
| `iconSize`      | `"sm" \| "md" \| "lg"`          | `"md"`         | Size of the icons                          |
| `spacing`       | `"tight" \| "normal" \| "wide"` | `"normal"`     | Space between elements                     |
| `orientation`   | `"horizontal" \| "vertical"`    | `"horizontal"` | Layout direction                           |
| `showSeparator` | `boolean`                       | `true`         | Show separator between social and location |

### Customization Props

| Prop              | Type                                      | Default     | Description                       |
| ----------------- | ----------------------------------------- | ----------- | --------------------------------- |
| `customStyles`    | `CustomStyles`                            | `{}`        | Override default styles           |
| `onSocialClick`   | `(platform: string, url: string) => void` | `undefined` | Custom social media click handler |
| `onLocationClick` | `(url: string) => void`                   | `undefined` | Custom location click handler     |

## Type Definitions

```typescript
interface SocialMediaConfig {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  telegram?: string;
}

interface LocationConfig {
  address?: {
    ku: string;
    ar: string;
    en: string;
  };
  coordinates?: {
    lat: number;
    lng: number;
  };
  googleMapsUrl?: string;
}

interface CustomStyles {
  container?: string;
  socialContainer?: string;
  locationContainer?: string;
  iconButton?: string;
  separator?: string;
}
```

## Usage Examples

### Basic Usage

```tsx
import SocialMediaLocationBar from "./SocialMediaLocationBar";

<SocialMediaLocationBar
  socialMedia={{
    facebook: "https://facebook.com/restaurant",
    instagram: "https://instagram.com/restaurant",
    whatsapp: "https://wa.me/1234567890",
  }}
  location={{
    address: {
      ku: "سلێمانی، عێراق",
      ar: "السليمانية، العراق",
      en: "Sulaymaniyah, Iraq",
    },
    coordinates: { lat: 35.5617, lng: 45.4355 },
  }}
/>;
```

### Custom Styling

```tsx
<SocialMediaLocationBar
  socialMedia={{ facebook: "https://facebook.com/restaurant" }}
  location={{ googleMapsUrl: "https://goo.gl/maps/example" }}
  iconSize="lg"
  spacing="wide"
  customStyles={{
    container: "bg-gray-100 p-6 rounded-xl",
    iconButton: "p-4 bg-blue-500 text-white hover:bg-blue-600 rounded-full",
    separator: "h-px w-8 bg-gray-300",
  }}
/>
```

### Vertical Layout

```tsx
<SocialMediaLocationBar
  socialMedia={{
    facebook: "https://facebook.com/restaurant",
    instagram: "https://instagram.com/restaurant",
  }}
  orientation="vertical"
  spacing="tight"
  iconSize="sm"
/>
```

### Custom Event Handlers

```tsx
<SocialMediaLocationBar
  socialMedia={{ facebook: "https://facebook.com/restaurant" }}
  location={{ coordinates: { lat: 35.5617, lng: 45.4355 } }}
  onSocialClick={(platform, url) => {
    // Custom analytics tracking
    analytics.track("social_click", { platform, url });
    window.open(url, "_blank");
  }}
  onLocationClick={(url) => {
    // Open custom map modal
    openMapModal(url);
  }}
/>
```

## Size Reference

### Icon Sizes

- `sm`: 12px × 12px (w-3 h-3)
- `md`: 16px × 16px (w-4 h-4) - Default
- `lg`: 20px × 20px (w-5 h-5)

### Padding Sizes

- `sm`: 8px (p-2)
- `md`: 10px (p-2.5) - Default
- `lg`: 12px (p-3)

### Spacing

- `tight`: 8px gap (gap-2)
- `normal`: 12px gap (gap-3) - Default
- `wide`: 16px gap (gap-4)

## Accessibility

The component includes:

- Proper ARIA labels for each social platform
- Title attributes for location with address information
- Keyboard navigation support
- Screen reader friendly structure

## Integration with Existing Systems

### Theme Integration

The component automatically uses the existing theme system:

- `themeClasses.bgCard` for background
- `themeClasses.textMain` for text color
- Responsive to dark/light theme changes

### Language Support

Location addresses automatically use the current language context:

- Kurdish (ku)
- Arabic (ar)
- English (en)

## Best Practices

1. **Performance**: Only include social media platforms you actually use
2. **Accessibility**: Always provide location addresses in all supported languages
3. **Analytics**: Use custom click handlers to track user engagement
4. **Design**: Match icon size to your overall design scale
5. **Mobile**: Test different spacing options on mobile devices

## Browser Support

- Modern browsers supporting ES6+
- Mobile browsers (iOS Safari, Chrome Mobile)
- Supports touch interactions
- Keyboard navigation compatible
