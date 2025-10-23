import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';

/**
 * Avatar3D Component
 * Renders a realistic 3D human head with audio-driven lip sync
 * No webcam required - responds purely to text-to-speech audio
 */
function Avatar3D({ isSpeaking, timeline, onModelLoaded }) {
  const canvasRef = useRef(null);
  const [modelStatus, setModelStatus] = useState('loading');
  const [availableMorphs, setAvailableMorphs] = useState([]);
  const [error, setError] = useState(null);

  // Three.js refs
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const headMeshRef = useRef(null);
  const animationIdRef = useRef(null);

  // Animation state
  const prevWeightsRef = useRef({});
  // Separate refs for different mouth controls
  const audioInfluenceRef = useRef(0); // mouth open amount
  const smileInfluenceRef = useRef(0); // mouth smile/spread amount
  const animationStartTimeRef = useRef(null);
  const idleAnimationRef = useRef({ blinkTime: 0, nextBlink: 2000 });
  
  // CRITICAL: Store props in refs so animation loop can access current values
  const isSpeakingRef = useRef(isSpeaking);
  const timelineRef = useRef(timeline);
  
  // Update refs when props change
  useEffect(() => {
    isSpeakingRef.current = isSpeaking;
    timelineRef.current = timeline;
  }, [isSpeaking, timeline]);

  // Debug: Log prop changes
  useEffect(() => {
    console.log('🔄 Avatar3D props changed:', {
      isSpeaking,
      timelineLength: timeline?.length || 0,
      hasTimeline: !!timeline
    });
  }, [isSpeaking, timeline]);

  // Expose manual test functions to window for debugging
  useEffect(() => {
    if (headMeshRef.current && Array.isArray(headMeshRef.current)) {
      window.__testMouthOpen = (value = 1.0) => {
        console.log(`🧪 Testing mouthOpen with value: ${value}`);
        const meshes = headMeshRef.current;
        console.log(`Found ${meshes.length} meshes:`, meshes.map(m => m.name));
        
        meshes.forEach(mesh => {
          const dict = mesh.morphTargetDictionary;
          const influences = mesh.morphTargetInfluences;
          console.log(`Mesh "${mesh.name}" dict:`, dict);
          console.log(`Mesh "${mesh.name}" influences (before):`, [...influences]);
          
          const names = ['mouthOpen', 'MouthOpen', 'jawOpen', 'JawOpen'];
          for (const name of names) {
            if (dict && dict[name] !== undefined) {
              const idx = dict[name];
              influences[idx] = value;
              console.log(`✅ Set ${mesh.name}.${name}[${idx}] = ${value}`);
              console.log(`Influences (after):`, [...influences]);
              break;
            }
          }
        });
      };
      
      window.__testMouthSmile = (value = 1.0) => {
        console.log(`🧪 Testing mouthSmile with value: ${value}`);
        headMeshRef.current.forEach(mesh => {
          const dict = mesh.morphTargetDictionary;
          const influences = mesh.morphTargetInfluences;
          const names = ['mouthSmile', 'MouthSmile'];
          for (const name of names) {
            if (dict && dict[name] !== undefined) {
              influences[dict[name]] = value;
              console.log(`✅ Set ${mesh.name}.${name} = ${value}`);
              break;
            }
          }
        });
      };

      window.__listMorphs = () => {
        console.log('📋 All meshes and their morphs:');
        headMeshRef.current.forEach(mesh => {
          console.log(`\nMesh: "${mesh.name}"`);
          console.log('Dictionary:', mesh.morphTargetDictionary);
          console.log('Current influences:', [...mesh.morphTargetInfluences]);
        });
      };
      
      console.log('🧪 Debug functions available:');
      console.log('  window.__testMouthOpen(1.0) - Open mouth');
      console.log('  window.__testMouthSmile(1.0) - Smile');
      console.log('  window.__listMorphs() - Show all morphs');
    }
  }, [modelStatus]);

  /**
   * Initialize Three.js scene
   */
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf5f5f5);
    sceneRef.current = scene;

    // Camera setup - positioned to show head and shoulders only
    const camera = new THREE.PerspectiveCamera(35, width / height, 0.1, 100);
    camera.position.set(0, 2, 1.0); // Moved back and down to see head to shoulders
    camera.lookAt(0, 2.2, 0); // Look at upper chest/neck area
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ 
      canvas, 
      antialias: true,
      alpha: true 
    });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.2;
    rendererRef.current = renderer;

    // Lighting setup for realistic skin
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 1.0);
    keyLight.position.set(2, 3, 3);
    keyLight.castShadow = true;
    scene.add(keyLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.4);
    fillLight.position.set(-2, 1, 2);
    scene.add(fillLight);

    const backLight = new THREE.DirectionalLight(0xffffff, 0.3);
    backLight.position.set(0, 2, -3);
    scene.add(backLight);

    // Load GLTF model
    const loader = new GLTFLoader();
    loader.load(
      '/models/head.glb',
      (gltf) => {
        const meshesWithMorphs = [];
        let allMorphNames = new Set();

        // Find ALL meshes with morph targets (ReadyPlayerMe has multiple)
        gltf.scene.traverse((node) => {
          if (node.isMesh && node.morphTargetInfluences && node.morphTargetDictionary) {
            meshesWithMorphs.push(node);
            
            // Collect all unique morph target names
            Object.keys(node.morphTargetDictionary).forEach(name => {
              allMorphNames.add(name);
            });
            
            // Enhance material for realistic skin
            if (node.material) {
              node.material.roughness = 0.6;
              node.material.metalness = 0.1;
              // Ensure morph targets are enabled on the material
              if (Array.isArray(node.material)) {
                node.material.forEach(m => { if (m) { m.morphTargets = true; m.needsUpdate = true; } });
              } else {
                node.material.morphTargets = true;
                node.material.needsUpdate = true;
              }
            }
            
            console.log(`Found mesh "${node.name}" with morphs:`, Object.keys(node.morphTargetDictionary));
          }
        });

        if (meshesWithMorphs.length > 0) {
          // Store all meshes (not just one)
          headMeshRef.current = meshesWithMorphs;
          const morphNamesArray = Array.from(allMorphNames);
          setAvailableMorphs(morphNamesArray);
          setModelStatus('loaded');
          console.log(`✅ Model loaded with ${meshesWithMorphs.length} meshes and ${morphNamesArray.length} unique morph targets`);
          console.log('Available morphs:', morphNamesArray);
          
          // Center and scale model to show head and shoulders
          const box = new THREE.Box3().setFromObject(gltf.scene);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());
          
          // Scale to fill view nicely
          const scale = 2.2 / size.y; // Base scale on height
          
          gltf.scene.scale.multiplyScalar(scale);
          gltf.scene.position.sub(center.multiplyScalar(scale));
          gltf.scene.position.y = 0.3; // Position so head is centered
          
          scene.add(gltf.scene);
          
          if (onModelLoaded) {
            onModelLoaded(morphNamesArray);
          }
        } else {
          setModelStatus('error');
          setError('Model loaded but no morph targets found. Please use a model with blendshapes.');
          console.error('❌ No morph targets found in model');
        }
      },
      (progress) => {
        const percent = (progress.loaded / progress.total) * 100;
        console.log(`Loading model: ${percent.toFixed(0)}%`);
      },
      (error) => {
        setModelStatus('error');
        setError('Failed to load model. Make sure head.glb exists in /public/models/');
        console.error('❌ Model load error:', error);
      }
    );

    // Handle window resize
    const handleResize = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    // Animation loop
    const animate = (timestamp) => {
      animationIdRef.current = requestAnimationFrame(animate);
      
      // Use refs to get current values (props are stale in this closure)
      const currentIsSpeaking = isSpeakingRef.current;
      const currentTimeline = timelineRef.current;
      
      // Update morph targets from audio timeline (lip sync)
      if (currentIsSpeaking && currentTimeline && currentTimeline.length > 0 && headMeshRef.current) {
        updateMorphTargetsFromAudio(currentTimeline);
      } else if (headMeshRef.current && !currentIsSpeaking) {
        // Idle animations when not speaking
        updateIdleAnimations(timestamp);
      }
      
      renderer.render(scene, camera);
    };
    animate(performance.now());

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationIdRef.current) {
        cancelAnimationFrame(animationIdRef.current);
      }
      renderer.dispose();
    };
  }, []);

  /**
   * Start animation timeline when speaking begins
   */
  useEffect(() => {
    if (isSpeaking && timeline && timeline.length > 0) {
      animationStartTimeRef.current = performance.now();
      console.log(`🎬 Starting lip sync animation with ${timeline.length} viseme frames`);
      console.log('First 3 frames:', timeline.slice(0, 3));
    } else if (isSpeaking) {
      console.warn('⚠️ isSpeaking=true but timeline is empty or missing!', { timeline });
    }
  }, [isSpeaking, timeline]);

  /**
   * Helper: Smooth values
   */
  const smooth = (prev, value, alpha = 0.4) => {
    return prev === undefined ? value : prev * (1 - alpha) + value * alpha;
  };

  /**
   * Idle animations (blinking, subtle movements)
   */
  const updateIdleAnimations = (timestamp) => {
    const meshes = headMeshRef.current;
    if (!meshes || !Array.isArray(meshes)) return;

    // Natural blinking every 2-5 seconds
    const idle = idleAnimationRef.current;
    
    if (timestamp >= idle.nextBlink) {
      // Trigger blink
      idle.blinkTime = timestamp;
      idle.nextBlink = timestamp + 2000 + Math.random() * 3000;
    }

    // Calculate blink animation (150ms duration)
    const blinkProgress = Math.min(1, (timestamp - idle.blinkTime) / 150);
    let blinkValue = 0;
    
    if (blinkProgress < 0.5) {
      blinkValue = blinkProgress * 2;
    } else if (blinkProgress < 1) {
      blinkValue = 1 - ((blinkProgress - 0.5) * 2);
    }

    // Apply to all meshes
    meshes.forEach(mesh => {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;

      // Apply blink to both eyes
      const eyeNames = [
        ['eyeBlinkLeft', 'EyeBlinkLeft', 'Eye_Blink_L'],
        ['eyeBlinkRight', 'EyeBlinkRight', 'Eye_Blink_R']
      ];

      for (const names of eyeNames) {
        for (const name of names) {
          if (dict && dict[name] !== undefined) {
            const idx = dict[name];
            influences[idx] = blinkValue;
            break;
          }
        }
      }

      // Reset mouth to closed when not speaking
      const mouthNames = ['jawOpen', 'JawOpen', 'mouthOpen', 'MouthOpen'];
      for (const name of mouthNames) {
        if (dict && dict[name] !== undefined) {
          const idx = dict[name];
          const prev = influences[idx] || 0;
          influences[idx] = smooth(prev, 0, 0.1);
          break;
        }
      }
    });
  };

  /**
   * Update morph targets from audio timeline (lip sync)
   */
  const updateMorphTargetsFromAudio = (timeline) => {
    const meshes = headMeshRef.current;
    const currentIsSpeaking = isSpeakingRef.current;
    
    // Debug: Log what we have
    if (Math.random() < 0.02) { // Log occasionally
      console.log('🔍 updateMorphTargetsFromAudio called', {
        hasMeshes: !!meshes,
        meshCount: meshes?.length,
        isArray: Array.isArray(meshes),
        isSpeaking: currentIsSpeaking,
        hasStartTime: !!animationStartTimeRef.current,
        timelineLength: timeline?.length
      });
    }
    
    if (!meshes || !Array.isArray(meshes) || !currentIsSpeaking || !animationStartTimeRef.current) {
      if (Math.random() < 0.01) {
        console.warn('⚠️ Skipping lip sync update:', {
          meshes: !!meshes,
          isArray: Array.isArray(meshes),
          isSpeaking: currentIsSpeaking,
          hasStartTime: !!animationStartTimeRef.current
        });
      }
      return;
    }

    // Calculate elapsed time since speech started
    const elapsed = performance.now() - animationStartTimeRef.current;
    
    // Find current viseme based on timeline
    const currentFrame = timeline.find(
      (frame) => elapsed >= frame.startMs && elapsed < frame.endMs
    );

    if (!currentFrame) {
      // Ease back to rest
      audioInfluenceRef.current = smooth(audioInfluenceRef.current, 0, 0.2);
      smileInfluenceRef.current = smooth(smileInfluenceRef.current, 0, 0.2);

      // Reset mouth on all meshes
      meshes.forEach(mesh => {
        const dict = mesh.morphTargetDictionary;
        const influences = mesh.morphTargetInfluences;
        const openNames = ['jawOpen', 'JawOpen', 'mouthOpen', 'MouthOpen'];
        const smileNames = ['mouthSmile', 'MouthSmile', 'mouthSmileLeft', 'mouthSmileRight'];
        for (const name of openNames) {
          if (dict && dict[name] !== undefined) {
            influences[dict[name]] = 0;
            break;
          }
        }
        for (const name of smileNames) {
          if (dict && dict[name] !== undefined) {
            influences[dict[name]] = 0;
            break;
          }
        }
      });
      return;
    }

    // Map visemes returned by phoneticAnalyzer to open/smile amounts
    const v = currentFrame.viseme; // values like 'open','wide','mid','small','o','f_v','ch_sh','r','closed'
    let targetOpen = 0;
    let targetSmile = 0;
    switch (v) {
      case 'open':
        targetOpen = 1.0; // MAXIMUM open for wide vowels (increased from 0.9)
        break;
      case 'o':
        targetOpen = 0.95; // rounded O/U (increased from 0.8)
        break;
      case 'wide':
        targetOpen = 0.7; // e/i sounds (increased from 0.5)
        targetSmile = 0.8; // smile/stretch (increased from 0.6)
        break;
      case 'mid':
        targetOpen = 0.5; // (increased from 0.35)
        break;
      case 'small':
        targetOpen = 0.3; // (increased from 0.2)
        break;
      case 'f_v': // teeth on lip
        targetOpen = 0.25; // (increased from 0.15)
        break;
      case 'ch_sh':
        targetOpen = 0.28; // (increased from 0.18)
        break;
      case 'r':
        targetOpen = 0.35; // (increased from 0.25)
        break;
      case 'closed':
      default:
        targetOpen = 0.0;
        targetSmile = 0.0;
        break;
    }

    audioInfluenceRef.current = smooth(audioInfluenceRef.current, targetOpen, 0.35);
    smileInfluenceRef.current = smooth(smileInfluenceRef.current, targetSmile, 0.35);

    // Debug log - more frequent for testing
    if (Math.random() < 0.15) { // Log ~15% of frames
      console.log(`🎤 Viseme: ${v}, Open: ${audioInfluenceRef.current.toFixed(2)}, Smile: ${smileInfluenceRef.current.toFixed(2)}, Meshes: ${meshes.length}`);
    }

    // Apply to jaw/mouth morph targets on ALL meshes
    meshes.forEach(mesh => {
      const dict = mesh.morphTargetDictionary;
      const influences = mesh.morphTargetInfluences;

      // Apply open to mouthOpen/jawOpen and smile to mouthSmile when available
      const openNames = ['mouthOpen', 'MouthOpen', 'jawOpen', 'JawOpen'];
      const smileNames = ['mouthSmile', 'MouthSmile', 'mouthSmileLeft', 'mouthSmileRight'];

      let foundOpen = false;
      let foundSmile = false;

      for (const name of openNames) {
        if (dict && dict[name] !== undefined) {
          const idx = dict[name];
          influences[idx] = audioInfluenceRef.current;
          foundOpen = true;
          if (Math.random() < 0.05) {
            console.log(`✅ Applied ${name}[${idx}] = ${audioInfluenceRef.current.toFixed(2)} on mesh "${mesh.name}"`);
          }
          break;
        }
      }

      for (const name of smileNames) {
        if (dict && dict[name] !== undefined) {
          const idx = dict[name];
          influences[idx] = smileInfluenceRef.current;
          foundSmile = true;
          break;
        }
      }

      if (!foundOpen && Math.random() < 0.02) {
        console.warn(`⚠️ Could not find any of ${openNames.join(',')} in mesh "${mesh.name}". Available:`, Object.keys(dict));
      }
    });
  };

  return (
    <div className="avatar-3d-container">
      <div className="avatar-3d-canvas-wrapper">
        <canvas 
          ref={canvasRef} 
          className="avatar-3d-canvas"
          style={{
            width: '100%',
            height: '100%',
            display: 'block'
          }}
        />
      </div>

      {/* Status overlay */}
      <div className="avatar-3d-status">
        {modelStatus === 'loading' && (
          <div className="status-message loading">
            <div className="spinner"></div>
            <p>Loading 3D model...</p>
          </div>
        )}
        {modelStatus === 'error' && (
          <div className="status-message error">
            <p>⚠️ {error}</p>
            <p style={{ fontSize: '0.9em', marginTop: '10px' }}>
              See <code>/public/models/README.md</code> for setup instructions
            </p>
          </div>
        )}
        {modelStatus === 'loaded' && (
          <div className="status-message success">
            <p>✅ Model ready</p>
            <p>🎭 Morphs: {availableMorphs.length}</p>
            <p>� {isSpeaking ? 'Speaking...' : 'Ready'}</p>
          </div>
        )}
      </div>

      <style jsx>{`
        .avatar-3d-container {
          width: 100%;
          height: 100%;
          position: relative;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 12px;
          overflow: hidden;
        }

        .avatar-3d-canvas-wrapper {
          width: 100%;
          height: 100%;
        }

        .avatar-3d-status {
          position: absolute;
          top: 10px;
          left: 10px;
          padding: 10px 15px;
          background: rgba(0, 0, 0, 0.7);
          border-radius: 8px;
          color: white;
          font-size: 0.85em;
          max-width: 280px;
        }

        .status-message p {
          margin: 3px 0;
        }

        .status-message.loading .spinner {
          border: 3px solid rgba(255, 255, 255, 0.3);
          border-top: 3px solid white;
          border-radius: 50%;
          width: 20px;
          height: 20px;
          animation: spin 1s linear infinite;
          margin: 0 auto 10px;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .status-message.error {
          background: rgba(220, 38, 38, 0.9);
        }

        .status-message.success {
          background: rgba(34, 197, 94, 0.9);
        }

        code {
          background: rgba(255, 255, 255, 0.2);
          padding: 2px 6px;
          border-radius: 3px;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}

export default Avatar3D;
