# Booking Animations - Quick Reference Guide 🎨

## 🚀 Quick Start

### 1. Import Required Components
```typescript
import { motion, AnimatePresence } from 'framer-motion';
import { Confetti, type ConfettiRef } from '../../components/common/Confetti';
import { Sparkles, Calculator, Check } from 'lucide-react';
```

### 2. Setup State & Refs
```typescript
const confettiRef = useRef<ConfettiRef>(null);
const [showPriceEstimate, setShowPriceEstimate] = useState(false);
const [animationStage, setAnimationStage] = useState(0);
const [countingPrice, setCountingPrice] = useState(0);
```

### 3. Add Confetti Component
```tsx
<Confetti 
  ref={confettiRef} 
  className="fixed inset-0 pointer-events-none z-50" 
  manualstart 
/>
```

## 🎯 Common Patterns

### Fire Confetti
```typescript
confettiRef.current?.fire({
  particleCount: 150,
  spread: 90,
  origin: { y: 0.6 }
});
```

### Price Animation Handler
```typescript
const handleGeneratePriceEstimate = (e: React.MouseEvent) => {
  e.preventDefault();
  setShowPriceEstimate(true);
  setAnimationStage(1);
  setCountingPrice(0);

  // Stage 1: Loading (1.5s)
  setTimeout(() => setAnimationStage(2), 1500);
  
  // Stage 2: Sparkles (1s)
  setTimeout(() => {
    setAnimationStage(3);
    const price = priceEstimate.total;
    const duration = 2000;
    const steps = 50;
    const increment = price / steps;
    let current = 0;
    const interval = setInterval(() => {
      current += increment;
      if (current >= price) {
        setCountingPrice(price);
        clearInterval(interval);
      } else {
        setCountingPrice(Math.floor(current));
      }
    }, duration / steps);
  }, 2500);
  
  // Stage 4: Success + Confetti
  setTimeout(() => {
    setAnimationStage(4);
    confettiRef.current?.fire({ 
      particleCount: 100, 
      spread: 70, 
      origin: { y: 0.6 } 
    });
  }, 4500);
};
```

### Progress Steps Component
```tsx
<div className="flex items-center justify-center gap-4 mb-8">
  {[1, 2, 3].map((step) => (
    <div key={step} className="flex items-center">
      <motion.div 
        animate={{ scale: currentStep === step ? 1.1 : 1 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center font-bold ${
          currentStep > step 
            ? 'bg-gradient-to-r from-green-500 to-emerald-500 text-white' 
            : currentStep === step
            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
            : 'bg-white/10 text-gray-400 border-2 border-gray-600'
        }`}
      >
        {currentStep > step ? <Check className="w-6 h-6" /> : step}
      </motion.div>
      {step < 3 && (
        <div className={`w-16 h-1 mx-2 rounded-full ${
          currentStep > step ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gray-600'
        }`} />
      )}
    </div>
  ))}
</div>
```

### Animated Step Transitions
```tsx
<AnimatePresence mode="wait">
  {currentStep === 1 && (
    <motion.div
      key="step1"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Step 1 content */}
    </motion.div>
  )}
  
  {currentStep === 2 && (
    <motion.div
      key="step2"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
    >
      {/* Step 2 content */}
    </motion.div>
  )}
</AnimatePresence>
```

### Animated Buttons
```tsx
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  type="button"
  onClick={handleClick}
  className="bg-gradient-to-r from-blue-600 to-purple-600..."
>
  Button Text
</motion.button>
```

### Floating Background Orbs
```tsx
<div className="fixed inset-0 overflow-hidden pointer-events-none">
  <motion.div 
    animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
    transition={{ duration: 8, repeat: Infinity }}
    className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"
  />
  <motion.div 
    animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
    transition={{ duration: 10, repeat: Infinity }}
    className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-pink-400/20 to-orange-400/20 rounded-full blur-3xl"
  />
</div>
```

## 🎨 Price Animation Modal Template

```tsx
<AnimatePresence>
  {showPriceEstimate && (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={() => animationStage === 4 && setShowPriceEstimate(false)}
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-white rounded-3xl p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Stage 1: Loading */}
        {animationStage === 1 && (
          <motion.div className="text-center">
            <motion.div 
              animate={{ rotate: 360 }} 
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="inline-block mb-6"
            >
              <div className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full" />
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900">Calculating...</h3>
            <p className="text-gray-600 mt-2">Analyzing your requirements</p>
          </motion.div>
        )}

        {/* Stage 2: Sparkles */}
        {animationStage === 2 && (
          <motion.div className="text-center relative">
            {[...Array(12)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute"
                initial={{ x: 0, y: 0, scale: 0, opacity: 0 }}
                animate={{
                  x: Math.cos((i * Math.PI * 2) / 12) * 100,
                  y: Math.sin((i * Math.PI * 2) / 12) * 100,
                  scale: [0, 1, 0],
                  opacity: [0, 1, 0],
                }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.05 }}
                style={{ left: "50%", top: "50%" }}
              >
                <Sparkles className="w-6 h-6 text-purple-600" />
              </motion.div>
            ))}
            <div className="py-12">
              <h3 className="text-2xl font-bold text-gray-900">Processing...</h3>
            </div>
          </motion.div>
        )}

        {/* Stage 3: Counting */}
        {animationStage === 3 && (
          <motion.div className="text-center">
            <motion.div 
              className="mb-4" 
              animate={{ scale: [1, 1.1, 1] }} 
              transition={{ duration: 0.5, repeat: Infinity }}
            >
              <Sparkles className="w-12 h-12 text-purple-600 mx-auto" />
            </motion.div>
            <h3 className="text-lg font-semibold text-gray-600 mb-4">Your Total</h3>
            <motion.div 
              className="text-6xl font-bold text-purple-600 mb-2" 
              key={countingPrice}
              initial={{ scale: 1.2 }} 
              animate={{ scale: 1 }}
            >
              £{countingPrice.toLocaleString()}
            </motion.div>
            <p className="text-gray-600">Calculating final amount...</p>
          </motion.div>
        )}

        {/* Stage 4: Success */}
        {animationStage === 4 && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }} 
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <motion.div 
              initial={{ scale: 0 }} 
              animate={{ scale: 1 }}
              className="mb-6"
            >
              <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full">
                <Check className="w-10 h-10 text-white" />
              </div>
            </motion.div>
            <h3 className="text-2xl font-bold text-gray-900 mb-4">
              Price Calculated!
            </h3>
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 mb-6">
              <p className="text-gray-600 mb-2">Total Cost</p>
              <div className="text-6xl font-black bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                £{priceEstimate.total.toLocaleString()}
              </div>
            </div>
            <button 
              onClick={() => setShowPriceEstimate(false)}
              className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold py-3 rounded-xl"
            >
              Continue
            </button>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  )}
</AnimatePresence>
```

## ⏱️ Animation Timings

| Stage | Duration | Delay | Total Time |
|-------|----------|-------|------------|
| Stage 1 (Loading) | 1.5s | 0s | 0-1.5s |
| Stage 2 (Sparkles) | 1s | 1.5s | 1.5-2.5s |
| Stage 3 (Counting) | 2s | 2.5s | 2.5-4.5s |
| Stage 4 (Success) | - | 4.5s | 4.5s+ |

## 🎨 Color Palette

### Gradients
```css
/* Blue to Purple */
from-blue-600 to-purple-600

/* Green to Emerald */
from-green-500 to-emerald-600

/* Red to Orange */
from-red-500 to-orange-500

/* Background Orbs */
from-blue-400/20 to-purple-400/20
from-pink-400/20 to-orange-400/20
```

### Status Colors
```css
/* Pending */
bg-gray-200 text-gray-600

/* Active */
bg-gradient-to-r from-blue-600 to-purple-600 text-white

/* Completed */
bg-gradient-to-r from-green-500 to-emerald-500 text-white
```

## 📱 Responsive Considerations

```tsx
{/* Mobile: Stack vertically, Desktop: Grid */}
<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
  {/* Content */}
</div>

{/* Adjust padding for mobile */}
<div className="p-4 md:p-8">
  {/* Content */}
</div>

{/* Smaller text on mobile */}
<h1 className="text-3xl md:text-5xl font-bold">
  {/* Heading */}
</h1>
```

## 🔧 Troubleshooting

### Confetti Not Firing
```typescript
// Make sure ref is initialized
const confettiRef = useRef<ConfettiRef>(null);

// Check if ref is available before firing
if (confettiRef.current) {
  confettiRef.current.fire({ particleCount: 100 });
}
```

### Animation Not Smooth
```typescript
// Use AnimatePresence with mode="wait"
<AnimatePresence mode="wait">
  {/* Animated content */}
</AnimatePresence>

// Add transition easing
transition={{ duration: 0.3, ease: "easeInOut" }}
```

### Modal Not Closing
```typescript
// Add click handler to backdrop
onClick={() => {
  if (animationStage === 4) {
    setShowPriceEstimate(false);
  }
}}

// Prevent propagation on modal content
onClick={(e) => e.stopPropagation()}
```

## 📚 Resources

- [Framer Motion Docs](https://www.framer.com/motion/)
- [Canvas Confetti Docs](https://www.npmjs.com/package/canvas-confetti)
- [Lucide Icons](https://lucide.dev/)

---

**Quick Tip**: Copy the patterns from `BookMove.tsx` or `PublicBooking.tsx` and adapt them to your needs!
