# 🎤 Lip Sync Testing Instructions

## 📋 How to Test Lip Sync

### Step 1: Open Browser Console
1. Press **F12** to open Developer Tools
2. Click on the **Console** tab
3. Keep it visible while testing

### Step 2: Type a Test Message
In the chat box, type one of these test phrases:
- **"Hello"** (simple test)
- **"How are you today?"** (medium test)
- **"Testing lip synchronization now"** (complex test)

### Step 3: Click Send and Watch Console

You should see these logs in order:

```
📊 Timeline created: {
  text: "Hello",
  duration: 850,
  frames: 12,
  firstFrames: [...]
}

🎬 Starting lip sync animation with 12 viseme frames
First 3 frames: [{startMs: 0, endMs: 85, viseme: "H"}, ...]

🎤 Viseme: H, Influence: 0.15, Meshes: 2
🎤 Viseme: E, Influence: 0.48, Meshes: 2
🎤 Viseme: L, Influence: 0.28, Meshes: 2
🎤 Viseme: O, Influence: 0.76, Meshes: 2
```

### Step 4: Watch the Avatar's Mouth

You should see:
- ✅ **Mouth opening** for vowels (A, E, I, O, U)
- ✅ **Mouth closing** for consonants (M, P, B)
- ✅ **Smooth transitions** between shapes
- ✅ **Synchronized** with the voice

---

## 🐛 Troubleshooting

### Problem: No console logs at all

**Possible Causes:**
1. Browser cache - hard refresh with **Ctrl+Shift+R**
2. Console filter - click "All levels" dropdown
3. Dev server not running - check terminal

### Problem: Timeline created but no viseme logs

**Check:**
```javascript
// In console, you should see:
🎬 Starting lip sync animation with X viseme frames
```

If you see this but NO viseme logs:
- Timeline is empty or invalid
- `isSpeaking` might not be triggering properly

**Manual Debug:**
Type this in console:
```javascript
// This will show current state
console.log({
  isSpeaking: document.querySelector('.avatar-3d-status-speaking'),
  timeline: window.lastTimeline // if we exposed it
});
```

### Problem: Viseme logs appear but mouth doesn't move

**Possible Causes:**

1. **Wrong morph target names** - Your model might use different names

   **Check the model load message:**
   ```
   ✅ Model loaded with 2 meshes and 52 unique morph targets
   Available morphs: [jawOpen, mouthSmile, ...]
   ```

   **Look for these morph names:**
   - `jawOpen` ✅ (standard)
   - `JawOpen` ✅ (uppercase variant)
   - `mouthOpen` ✅ (alternative)
   - `MouthOpen` ✅ (uppercase alternative)

   **If none of these exist**, you need to find what YOUR model uses.

2. **Morph influence too low** - Values might be too subtle

   **Check console for influence values:**
   ```
   🎤 Viseme: A, Influence: 0.85
   ```
   
   If influence is always < 0.1, mouth movement will be barely visible.

3. **Meshes not being animated** - Mesh array might be wrong

   **Check:**
   ```
   🎤 Viseme: A, Influence: 0.85, Meshes: 2
   ```
   
   Should show `Meshes: 2` (or more). If it shows `Meshes: 0` or `Meshes: 1`, there's a problem.

---

## 🔍 Deep Debugging

### Manual Morph Target Test

If nothing is working, test morphs manually in console:

```javascript
// Get the Three.js scene (we need to expose this)
// This is advanced - only if automatic detection fails

// Find all meshes with morphs
const meshes = [];
scene.traverse((child) => {
  if (child.isMesh && child.morphTargetInfluences) {
    meshes.push(child);
    console.log(`Mesh: ${child.name}`, child.morphTargetDictionary);
  }
});

// Manually set jaw open (test animation)
meshes.forEach(mesh => {
  const dict = mesh.morphTargetDictionary;
  if (dict.jawOpen !== undefined) {
    mesh.morphTargetInfluences[dict.jawOpen] = 1.0; // Fully open
  }
});

// Wait 2 seconds, then close
setTimeout(() => {
  meshes.forEach(mesh => {
    const dict = mesh.morphTargetDictionary;
    if (dict.jawOpen !== undefined) {
      mesh.morphTargetInfluences[dict.jawOpen] = 0.0; // Closed
    }
  });
}, 2000);
```

If this manual test WORKS → Code is correct, but mapping might be wrong  
If this manual test FAILS → Model doesn't have jaw morphs

---

## 📊 Expected Console Output (Full Example)

When you type "Hello" and send:

```
📊 Timeline created: {
  text: "Hello",
  duration: 847,
  frames: 12,
  firstFrames: [
    {startMs: 0, endMs: 85, viseme: "H"},
    {startMs: 85, endMs: 254, viseme: "E"},
    {startMs: 254, endMs: 424, viseme: "L"}
  ]
}

🎬 Starting lip sync animation with 12 viseme frames
First 3 frames: [
  {startMs: 0, endMs: 85, viseme: "H"},
  {startMs: 85, endMs: 254, viseme: "E"},
  {startMs: 254, endMs: 424, viseme: "L"}
]

🎤 Viseme: H, Influence: 0.08, Meshes: 2
🎤 Viseme: E, Influence: 0.42, Meshes: 2
🎤 Viseme: E, Influence: 0.48, Meshes: 2
🎤 Viseme: L, Influence: 0.31, Meshes: 2
🎤 Viseme: L, Influence: 0.29, Meshes: 2
🎤 Viseme: O, Influence: 0.68, Meshes: 2
🎤 Viseme: O, Influence: 0.77, Meshes: 2
🎤 Viseme: O, Influence: 0.74, Meshes: 2
```

---

## ✅ Success Criteria

### You'll know it's working when:

1. **Console shows all 3 types of logs:**
   - 📊 Timeline created
   - 🎬 Starting lip sync
   - 🎤 Viseme updates (multiple times during speech)

2. **Visual confirmation:**
   - Mouth visibly opens and closes
   - Movement matches the voice timing
   - Smooth transitions (not jerky)

3. **Audio plays simultaneously**
   - Voice is clear
   - Lip movement is synchronized
   - No delay between audio and visual

---

## 🎯 Quick Test Checklist

- [ ] Console open (F12)
- [ ] Type "Hello" in chat
- [ ] Click Send
- [ ] See timeline log
- [ ] See starting animation log
- [ ] See multiple viseme logs
- [ ] Hear voice playing
- [ ] See mouth moving
- [ ] Movement matches voice

---

## 📞 Report Back

After testing, report:

1. **What console logs you see** (copy/paste)
2. **Does mouth move at all?** (yes/no)
3. **What morph target names your model has** (from model load log)
4. **Any errors in console?** (red text)

This will help diagnose the exact issue!

---

*Last Updated: October 23, 2025*  
*Enhanced debugging with detailed logging*
