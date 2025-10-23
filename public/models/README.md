# 3D Avatar Models

## Required: GLTF/GLB Head Model with Morph Targets

Place your 3D head model file here as `head.glb` or `head.gltf`.

### Where to Get Free Models with Morph Targets:

#### Option 1: ReadyPlayerMe (Recommended - Free & Easy)
1. Visit https://readyplayer.me/
2. Create a free avatar (photorealistic or stylized)
3. Download as GLB format
4. The model includes facial blendshapes/morph targets
5. Rename to `head.glb` and place here

#### Option 2: MakeHuman + Blender
1. Download MakeHuman (http://www.makehumancommunity.org/)
2. Create a human model
3. Export as MHX2 or Collada
4. Import to Blender
5. Add shape keys for facial expressions:
   - JawOpen / mouthOpen
   - MouthWide / mouthSmile
   - MouthPucker / mouthFunnel
   - EyeBlinkLeft / eyeBlinkLeft
   - EyeBlinkRight / eyeBlinkRight
   - BrowUpLeft / browInnerUp
   - BrowUpRight
6. Export as GLTF 2.0 with "Shape Keys" enabled
7. Rename to `head.glb`

#### Option 3: Mixamo Character
1. Visit https://www.mixamo.com/
2. Download a character
3. Import to Blender and add facial shape keys
4. Export as GLTF with morph targets

#### Option 4: Free GLTF Models with Morph Targets
- Sketchfab: https://sketchfab.com/tags/morph-targets (filter by "Downloadable")
- Poly Haven: https://polyhaven.com/
- Three.js Examples: https://github.com/mrdoob/three.js/tree/dev/examples/models

### Required Morph Target Names (at least some of these):
The code will auto-detect available morph targets. Common names:
- **Mouth**: `JawOpen`, `mouthOpen`, `MouthWide`, `mouthSmile`, `MouthPucker`, `mouthFunnel`
- **Eyes**: `EyeBlinkLeft`, `EyeBlinkRight`, `eyeBlinkLeft`, `eyeBlinkRight`
- **Brows**: `BrowUpLeft`, `BrowUpRight`, `browInnerUp`, `browOuterUp`
- **Cheeks**: `CheekPuff`, `CheekSquintLeft`, `CheekSquintRight`

### Current Status:
- [ ] Model placed as `head.glb`
- [ ] Model tested and loaded successfully
- [ ] Morph targets verified in console

Once you place the model, the application will automatically:
1. Load the GLB file
2. Detect available morph targets
3. Display them in the UI
4. Map MediaPipe facial landmarks to morph targets for realistic animation
