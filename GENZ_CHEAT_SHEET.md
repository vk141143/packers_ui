# 🎨 Gen-Z Design Cheat Sheet

## Quick Copy-Paste Patterns

---

## 🎭 Hero Sections

```tsx
// Gradient Hero with Animated Blobs
<motion.div 
  initial={{ opacity: 0, y: -20 }}
  animate={{ opacity: 1, y: 0 }}
  className="relative bg-gradient-to-r from-blue-600 via-blue-700 to-purple-600 p-8 overflow-hidden"
>
  <div className="absolute inset-0 opacity-20">
    <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-3xl" />
    <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-300 rounded-full blur-3xl" />
  </div>
  <div className="relative z-10">
    <h1 className="text-3xl font-bold text-white mb-2">Your Title 🚀</h1>
    <p className="text-blue-100">Your subtitle here</p>
  </div>
</motion.div>
```

---

## 📦 Stat Cards

```tsx
// Image-Based Stat Card
<motion.div 
  whileHover={{ scale: 1.05, y: -5 }}
  className="bg-white rounded-2xl shadow-lg p-6 overflow-hidden"
>
  <div className="bg-gradient-to-br from-blue-500 to-blue-600 w-12 h-12 rounded-xl flex items-center justify-center mb-3">
    <Icon size={24} className="text-white" />
  </div>
  <p className="text-sm text-gray-600">Label</p>
  <p className="text-3xl font-bold text-gray-900">Value</p>
  <div className="flex items-center gap-1 text-green-600 text-xs mt-2">
    <TrendingUp size={12} />
    <span>+12%</span>
  </div>
</motion.div>
```

---

## 🔘 Buttons

```tsx
// Gradient Button with Icon
<motion.button
  whileHover={{ scale: 1.02 }}
  whileTap={{ scale: 0.98 }}
  className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center gap-2"
>
  <Icon size={20} />
  Button Text
</motion.button>
```

---

## 🖼️ Image Cards

```tsx
// Service Card with Image Overlay
<motion.div
  whileHover={{ scale: 1.03, y: -5 }}
  whileTap={{ scale: 0.98 }}
  className="relative overflow-hidden rounded-2xl cursor-pointer shadow-lg hover:shadow-xl"
>
  <img src="..." className="w-full h-48 object-cover" />
  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
  <div className="absolute bottom-0 p-6 text-white">
    <Icon size={32} className="mb-2" />
    <h3 className="font-bold text-xl">Title</h3>
    <p className="text-sm mt-1">Description</p>
  </div>
</motion.div>
```

---

## 📝 Form Inputs

```tsx
// Modern Input with Icon
<div>
  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
    <Icon size={16} className="text-blue-600" />
    Label
  </label>
  <input
    type="text"
    className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
    placeholder="Placeholder..."
  />
</div>
```

---

## 📊 Progress Steps

```tsx
// Animated Progress Indicator
<div className="flex items-center justify-center">
  {[1, 2, 3].map((step) => (
    <React.Fragment key={step}>
      <motion.div 
        whileHover={{ scale: 1.1 }}
        className={`w-12 h-12 rounded-full font-bold flex items-center justify-center ${
          currentStep >= step 
            ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg' 
            : 'bg-gray-200 text-gray-600'
        }`}
      >
        {step}
      </motion.div>
      {step < 3 && (
        <div className="w-24 h-1 mx-2 bg-gray-200 rounded-full overflow-hidden">
          <motion.div 
            animate={{ width: currentStep > step ? '100%' : '0%' }}
            className="h-full bg-gradient-to-r from-blue-600 to-blue-700"
          />
        </div>
      )}
    </React.Fragment>
  ))}
</div>
```

---

## ✅ Checklist Items

```tsx
// Interactive Checklist
<motion.div
  initial={{ opacity: 0, x: -20 }}
  animate={{ opacity: 1, x: 0 }}
  onClick={() => toggle(id)}
  className={`flex items-center gap-4 p-4 rounded-xl cursor-pointer ${
    checked ? 'bg-green-50 border-2 border-green-500' : 'bg-gray-50 border-2 border-gray-200'
  }`}
>
  <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
    checked ? 'bg-green-500 border-green-500' : 'border-gray-300'
  }`}>
    {checked && <CheckCircle size={16} className="text-white" />}
  </div>
  <span className={`flex-1 font-medium ${checked ? 'text-green-900 line-through' : 'text-gray-900'}`}>
    Task text
  </span>
</motion.div>
```

---

## 📸 Photo Upload

```tsx
// Camera & Upload Options
<div className="grid grid-cols-2 gap-3">
  <motion.label 
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50"
  >
    <Camera size={32} className="text-gray-400 mb-2" />
    <span className="text-sm font-semibold">Take Photo</span>
    <input type="file" accept="image/*" capture="environment" className="hidden" />
  </motion.label>

  <motion.label 
    whileHover={{ scale: 1.05 }}
    className="flex flex-col items-center p-6 border-2 border-dashed rounded-xl cursor-pointer hover:border-blue-500 hover:bg-blue-50"
  >
    <Upload size={32} className="text-gray-400 mb-2" />
    <span className="text-sm font-semibold">Upload</span>
    <input type="file" accept="image/*" multiple className="hidden" />
  </motion.label>
</div>
```

---

## 🎯 Circular Progress

```tsx
// SVG Progress Ring
<div className="relative w-32 h-32">
  <svg className="transform -rotate-90 w-32 h-32">
    <circle cx="64" cy="64" r="56" stroke="#e5e7eb" strokeWidth="8" fill="none" />
    <motion.circle 
      cx="64" cy="64" r="56" 
      stroke="#f97316" 
      strokeWidth="8" 
      fill="none"
      strokeDasharray={`${2 * Math.PI * 56}`}
      initial={{ strokeDashoffset: 2 * Math.PI * 56 }}
      animate={{ strokeDashoffset: 2 * Math.PI * 56 * (1 - percentage / 100) }}
      strokeLinecap="round"
    />
  </svg>
  <div className="absolute inset-0 flex flex-col items-center justify-center">
    <span className="text-3xl font-bold">{percentage}%</span>
    <span className="text-xs text-gray-600">Complete</span>
  </div>
</div>
```

---

## 🎉 Success Animation

```tsx
// Full-Screen Success
<div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black flex items-center justify-center z-50">
  <motion.div
    initial={{ scale: 0, rotate: -180 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: 'spring', stiffness: 200 }}
    className="text-center"
  >
    <div className="w-32 h-32 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
      <Check className="w-16 h-16 text-white" strokeWidth={3} />
    </div>
    <h2 className="text-4xl font-bold text-white">Success! 🎉</h2>
    <p className="text-white/70 mt-4">Your action was completed</p>
  </motion.div>
</div>
```

---

## 🏷️ Badges

```tsx
// Status Badge
<span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-semibold">
  Active
</span>

// Icon Badge
<span className="flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-semibold">
  <CheckCircle size={12} />
  Verified
</span>
```

---

## 🎨 Color Gradients

```css
/* Hero Gradients */
from-blue-600 via-blue-700 to-purple-600
from-orange-600 to-orange-800
from-purple-900 to-indigo-900
from-gray-900 to-gray-700

/* Button Gradients */
from-blue-600 to-blue-700
from-green-600 to-green-700
from-red-500 to-red-600
from-yellow-500 to-yellow-600

/* Card Gradients */
from-blue-50 to-blue-100
from-green-50 to-green-100
from-purple-50 to-purple-100

/* Overlay Gradients */
from-black/70 to-transparent
from-blue-900/80 to-transparent
```

---

## 🎭 Animation Patterns

```tsx
// Hover Scale
whileHover={{ scale: 1.05, y: -5 }}

// Tap Effect
whileTap={{ scale: 0.98 }}

// Entrance
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}

// Stagger
<motion.div variants={containerVariants}>
  {items.map((item, i) => (
    <motion.div 
      variants={itemVariants}
      transition={{ delay: i * 0.1 }}
    />
  ))}
</motion.div>

// Rotate In
initial={{ scale: 0, rotate: -180 }}
animate={{ scale: 1, rotate: 0 }}
```

---

## 📱 Responsive Grid

```tsx
// Responsive Card Grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
  {items.map(item => (
    <Card key={item.id} />
  ))}
</div>

// Stat Grid
<div className="grid grid-cols-2 md:grid-cols-4 gap-4">
  {stats.map(stat => (
    <StatCard key={stat.label} />
  ))}
</div>
```

---

## 🎯 Quick Tips

### Always Add:
1. ✅ `whileHover` on interactive elements
2. ✅ `whileTap` on buttons
3. ✅ Gradients instead of solid colors
4. ✅ Icons with text
5. ✅ Rounded corners (`rounded-xl`, `rounded-2xl`)
6. ✅ Shadows (`shadow-lg`, `shadow-xl`)
7. ✅ Transitions (`transition-all`)

### Never Forget:
1. ❌ Don't use plain colors
2. ❌ Don't skip animations
3. ❌ Don't use small touch targets
4. ❌ Don't forget hover states
5. ❌ Don't use tiny text
6. ❌ Don't skip loading states
7. ❌ Don't forget mobile

---

## 🚀 Import Statements

```tsx
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Check, CheckCircle, Camera, Upload, X, 
  MapPin, Calendar, Clock, Package, 
  TrendingUp, AlertCircle, User, Mail, Phone 
} from 'lucide-react';
```

---

## 💡 Pro Tips

1. **Use Gradients** - `bg-gradient-to-r from-blue-600 to-blue-700`
2. **Add Shadows** - `shadow-lg hover:shadow-xl`
3. **Round Corners** - `rounded-xl` or `rounded-2xl`
4. **Animate Everything** - `whileHover`, `whileTap`, `initial`, `animate`
5. **Add Icons** - Lucide React icons everywhere
6. **Use Images** - Real photos with overlays
7. **Mobile First** - Start with mobile, scale up
8. **Instant Feedback** - Loading states, transitions
9. **Color Code** - Green = success, Red = danger, Blue = primary
10. **Add Personality** - Emojis, friendly copy

---

## 🎉 You're Ready!

Copy these patterns and build amazing Gen-Z interfaces! 🚀✨

**Remember:** 
- Gradients > Solid colors
- Animations > Static
- Images > Icons only
- Interactive > Passive
- Mobile-first > Desktop-first
- Fast > Slow
- Fun > Boring

Ship it! 💪
