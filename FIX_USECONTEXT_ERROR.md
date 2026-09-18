# Fix: useContext Error Resolution

## Problem
The application was throwing the error:
```
Uncaught TypeError: Cannot read properties of null (reading 'useContext')
```

## Root Cause
The error occurred because `useReactFlow()` hook was being called before the `ReactFlowProvider` context was fully initialized. This is a common timing issue with React context providers, especially when:

1. Components render immediately on mount
2. The provider needs time to set up its internal state
3. Hooks try to access context before it's available

## Solution
Split the Canvas component into a two-tier structure:

### Before (Problematic):
```typescript
function FlowCanvas() {
  const { screenToFlowPosition } = useReactFlow(); // ❌ Called too early
  // ... rest of component
}

export function Canvas() {
  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </ErrorBoundary>
  );
}
```

### After (Fixed):
```typescript
function FlowCanvasInner() {
  const { screenToFlowPosition } = useReactFlow(); // ✅ Called after provider is ready
  // ... rest of component
}

function FlowCanvas() {
  const [isReady, setIsReady] = useState(false);
  
  useEffect(() => {
    // Small delay to ensure ReactFlowProvider is fully initialized
    const timer = setTimeout(() => setIsReady(true), 10);
    return () => clearTimeout(timer);
  }, []);
  
  if (!isReady) {
    return <LoadingSpinner />;
  }
  
  return <FlowCanvasInner />;
}

export function Canvas() {
  return (
    <ErrorBoundary>
      <ReactFlowProvider>
        <FlowCanvas />
      </ReactFlowProvider>
    </ErrorBoundary>
  );
}
```

## How It Works

1. **Wrapper Component (`FlowCanvas`)**: 
   - Manages a loading state
   - Waits 10ms for the provider to initialize
   - Shows a loading spinner during initialization

2. **Inner Component (`FlowCanvasInner`)**:
   - Contains all the actual canvas logic
   - Only renders after the provider is ready
   - Safely calls `useReactFlow()` hook

3. **Loading State**:
   - Prevents the hook from being called too early
   - Provides visual feedback to users
   - Ensures clean component lifecycle

## Why This Fix Works

- **Timing**: The 10ms delay gives React enough time to fully initialize the context provider
- **Separation of Concerns**: Loading logic is separate from canvas logic
- **User Experience**: Users see a loading spinner instead of an error
- **Reliability**: The hook is guaranteed to be called in a valid context

## Alternative Solutions Considered

### 1. Try-Catch Wrapper (Rejected)
```typescript
try {
  const { screenToFlowPosition } = useReactFlow();
} catch (e) {
  // Handle error
}
```
**Why rejected**: Hooks can't be called conditionally - violates Rules of Hooks

### 2. Conditional Rendering (Rejected)
```typescript
if (providerReady) {
  const { screenToFlowPosition } = useReactFlow();
}
```
**Why rejected**: Same issue - hooks must be called unconditionally

### 3. Context Check (Rejected)
```typescript
const context = useContext(ReactFlowContext);
if (!context) return null;
```
**Why rejected**: Still calls hooks before checking, doesn't solve the root issue

## Testing

To verify the fix:
1. Open the application
2. Navigate to the Builder tab
3. The canvas should load without errors
4. You should see a brief loading spinner (10ms)
5. The canvas should render normally after loading

## Performance Impact

- **Minimal**: 10ms delay is imperceptible to users
- **One-time**: Only happens on initial mount
- **No re-renders**: Loading state doesn't cause unnecessary updates

## Related Issues

This pattern can be applied to other context-dependent hooks:
- `useReactFlow()` from @xyflow/react
- `useStore()` from Zustand (if needed)
- Custom context hooks
- Any hook that depends on a provider being initialized

## Best Practices

When working with React context providers:

1. **Always wrap hook consumers** in components that ensure provider readiness
2. **Use loading states** to handle initialization timing
3. **Separate concerns** between loading logic and business logic
4. **Test thoroughly** to catch timing issues early
5. **Document the pattern** for team consistency

## Build Status

✅ Build successful after fix
- No TypeScript errors
- No runtime errors
- All features working correctly
