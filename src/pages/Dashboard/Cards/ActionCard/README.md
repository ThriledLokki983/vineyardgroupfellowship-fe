# Action Card Component

A reusable Action component for displaying actionable items in the dashboard. Supports both missing profile fields and supporter next steps.

## Props

| Prop | Type | Required | Description |
|------|------|----------|-------------|
| `type` | `'missing' \| 'support'` | Yes | Type of action card |
| `action` | `string` | No | For 'missing' type - the field name that's missing |
| `nextStep` | `SupporterNextStep` | No | For 'support' type - the next step object |

## Types

### SupporterNextStep
```typescript
interface SupporterNextStep {
  step: string;
  title: string;
  description: string;
  url: string;
  priority: 'high' | 'medium' | 'low';
}
```

## Usage Examples

### Missing Profile Field
```tsx
import Action from '../Cards/ActionCard/Action';

// Display missing recovery stage
<Action
  type="missing"
  action="recovery_stage"
/>
```

### Supporter Next Steps
```tsx
import Action from '../Cards/ActionCard/Action';
import { useSupporterStatus } from 'hooks/useSupporterBackground';

const SupporterDashboard = () => {
  const { nextSteps } = useSupporterStatus();

  return (
    <div>
      {nextSteps.map((step, index) => (
        <Action
          key={step.step}
          type="support"
          nextStep={step}
        />
      ))}
    </div>
  );
};
```

### Real-world Example with Supporter Info
```tsx
// Example next_steps from supporter_info:
const exampleNextSteps = [
  {
    "step": "complete_training",
    "title": "Complete Supporter Training",
    "description": "Complete required training to start supporting others",
    "url": "/training/supporter/",
    "priority": "high"
  },
  {
    "step": "verify_credentials",
    "title": "Verify Professional Credentials",
    "description": "Upload and verify your professional credentials",
    "url": "/profile/credentials",
    "priority": "medium"
  }
];

// Usage:
{exampleNextSteps.map((step) => (
  <Action
    key={step.step}
    type="support"
    nextStep={step}
  />
))}
```

## Visual Design

### Priority Indicators
- **High Priority** (🔴): Red border, primary button
- **Medium Priority** (🟡): Yellow border, secondary button
- **Low Priority** (🟢): Green border, secondary button

### Layout
- **Missing Type**: Simple flex layout with description + fix button
- **Support Type**: Rich layout with icon, title, description + action button

## Integration with useSupporterBackground

```tsx
import { useSupporterStatus } from 'hooks/useSupporterBackground';
import Action from '../Cards/ActionCard/Action';

const MyComponent = () => {
  const { nextSteps, needsBackgroundSetup } = useSupporterStatus();

  return (
    <div>
      {/* Show background setup if needed */}
      {needsBackgroundSetup && (
        <Action
          type="missing"
          action="background_setup"
        />
      )}

      {/* Show supporter next steps */}
      {nextSteps.map((step) => (
        <Action
          key={step.step}
          type="support"
          nextStep={step}
        />
      ))}
    </div>
  );
};
```

## Button Integration

The component uses the updated Button component with URL support:
- Automatically renders as React Router Links for internal URLs
- Handles external URLs appropriately
- Maintains consistent button styling across variants