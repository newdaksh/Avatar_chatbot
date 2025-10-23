import { useState } from 'react';

/**
 * ModelSetupGuide Component
 * Provides an interactive guide to help users download and setup 3D head models
 */
function ModelSetupGuide({ onClose }) {
  const [activeTab, setActiveTab] = useState('readyplayerme');

  const guides = {
    readyplayerme: {
      title: '🎮 ReadyPlayerMe (Easiest - Recommended)',
      difficulty: 'Easy',
      time: '5 minutes',
      quality: 'High',
      steps: [
        {
          text: 'Visit ReadyPlayerMe website',
          link: 'https://readyplayer.me/',
          action: 'Open website'
        },
        {
          text: 'Create a free avatar (photorealistic or stylized)',
          details: 'You can use a selfie or customize from scratch'
        },
        {
          text: 'Click "Export" and select GLB format',
          details: 'Make sure to download the full-body or half-body model'
        },
        {
          text: 'Download the GLB file',
          details: 'The file will be named something like "avatar.glb"'
        },
        {
          text: 'Rename the file to "head.glb"',
          command: 'ren avatar.glb head.glb'
        },
        {
          text: 'Move head.glb to your project',
          path: 'g:\\Daksh_Library\\Avatar_chatbot\\public\\models\\head.glb',
          action: 'Open folder'
        },
        {
          text: 'Refresh the page - your avatar should load!',
          final: true
        }
      ]
    },
    mixamo: {
      title: '🎬 Mixamo + Blender',
      difficulty: 'Medium',
      time: '20-30 minutes',
      quality: 'High',
      steps: [
        {
          text: 'Visit Mixamo and log in with Adobe account',
          link: 'https://www.mixamo.com/'
        },
        {
          text: 'Select a character (e.g., "Y Bot" or any character)',
        },
        {
          text: 'Download as FBX format',
        },
        {
          text: 'Install Blender (free 3D software)',
          link: 'https://www.blender.org/download/'
        },
        {
          text: 'Import FBX into Blender: File > Import > FBX',
        },
        {
          text: 'Select the head mesh and add Shape Keys',
          details: 'Properties > Mesh Data > Shape Keys > Add shapes for: JawOpen, MouthWide, MouthSmile, EyeBlinkLeft, EyeBlinkRight'
        },
        {
          text: 'Export as GLTF: File > Export > glTF 2.0',
          details: 'Enable "Shape Keys" in export options'
        },
        {
          text: 'Rename to head.glb and place in /public/models/',
          path: 'g:\\Daksh_Library\\Avatar_chatbot\\public\\models\\head.glb'
        }
      ]
    },
    sketchfab: {
      title: '📦 Sketchfab (Free Models)',
      difficulty: 'Easy',
      time: '10 minutes',
      quality: 'Variable',
      steps: [
        {
          text: 'Visit Sketchfab and search for "head morph targets"',
          link: 'https://sketchfab.com/search?q=head+morph+targets&type=models'
        },
        {
          text: 'Filter by "Downloadable" and "Animated"',
        },
        {
          text: 'Look for models with facial blendshapes/morph targets',
          details: 'Check the description for mentions of "ARKit", "blendshapes", or "morph targets"'
        },
        {
          text: 'Download the model (requires free account)',
        },
        {
          text: 'Extract and find the GLB or GLTF file',
        },
        {
          text: 'Rename to head.glb',
        },
        {
          text: 'Place in /public/models/head.glb',
          path: 'g:\\Daksh_Library\\Avatar_chatbot\\public\\models\\head.glb'
        }
      ]
    },
    makehuman: {
      title: '👤 MakeHuman (Fully Custom)',
      difficulty: 'Hard',
      time: '30-45 minutes',
      quality: 'Variable',
      steps: [
        {
          text: 'Download and install MakeHuman',
          link: 'http://www.makehumancommunity.org/download.html'
        },
        {
          text: 'Create a custom human model',
          details: 'Use sliders to customize face, body, age, gender, etc.'
        },
        {
          text: 'Export as MHX2 or Collada format',
        },
        {
          text: 'Import into Blender',
        },
        {
          text: 'Add facial shape keys (morph targets)',
          details: 'Required: JawOpen, MouthWide, MouthSmile, EyeBlinkLeft, EyeBlinkRight, BrowUp'
        },
        {
          text: 'Export as glTF 2.0 with Shape Keys enabled',
        },
        {
          text: 'Rename to head.glb and place in /public/models/',
          path: 'g:\\Daksh_Library\\Avatar_chatbot\\public\\models\\head.glb'
        }
      ]
    }
  };

  const openLink = (url) => {
    window.open(url, '_blank');
  };

  const openFolder = () => {
    // Note: Can't directly open folder from web, but we can show the path
    const path = 'g:\\Daksh_Library\\Avatar_chatbot\\public\\models';
    alert(`Please navigate to:\n\n${path}\n\nAnd place your head.glb file there.`);
  };

  const currentGuide = guides[activeTab];

  return (
    <div className="model-setup-overlay">
      <div className="model-setup-modal">
        <div className="modal-header">
          <h2>🎭 Setup 3D Avatar Model</h2>
          <button className="close-btn" onClick={onClose}>✕</button>
        </div>

        <div className="modal-body">
          <div className="tabs">
            {Object.entries(guides).map(([key, guide]) => (
              <button
                key={key}
                className={`tab ${activeTab === key ? 'active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {guide.title}
              </button>
            ))}
          </div>

          <div className="guide-content">
            <div className="guide-meta">
              <span className="meta-item">
                <strong>Difficulty:</strong> {currentGuide.difficulty}
              </span>
              <span className="meta-item">
                <strong>Time:</strong> {currentGuide.time}
              </span>
              <span className="meta-item">
                <strong>Quality:</strong> {currentGuide.quality}
              </span>
            </div>

            <ol className="steps-list">
              {currentGuide.steps.map((step, index) => (
                <li key={index} className={step.final ? 'final-step' : ''}>
                  <div className="step-text">{step.text}</div>
                  {step.details && (
                    <div className="step-details">{step.details}</div>
                  )}
                  {step.link && (
                    <button
                      className="step-action"
                      onClick={() => openLink(step.link)}
                    >
                      {step.action || 'Open Link'} →
                    </button>
                  )}
                  {step.path && (
                    <div className="step-path">
                      <code>{step.path}</code>
                      <button className="step-action" onClick={openFolder}>
                        Open Folder
                      </button>
                    </div>
                  )}
                  {step.command && (
                    <div className="step-command">
                      <code>{step.command}</code>
                    </div>
                  )}
                </li>
              ))}
            </ol>
          </div>

          <div className="guide-footer">
            <div className="info-box">
              <strong>💡 Pro Tip:</strong> ReadyPlayerMe is the fastest option and provides
              high-quality avatars with built-in morph targets (blendshapes) for realistic
              facial animation and lip sync.
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .model-setup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 9999;
          padding: 20px;
        }

        .model-setup-modal {
          background: white;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          padding: 24px;
          border-bottom: 2px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 1.5em;
        }

        .close-btn {
          background: rgba(255, 255, 255, 0.2);
          border: none;
          color: white;
          font-size: 1.5em;
          width: 36px;
          height: 36px;
          border-radius: 50%;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: rgba(255, 255, 255, 0.3);
        }

        .modal-body {
          padding: 24px;
          overflow-y: auto;
          flex: 1;
        }

        .tabs {
          display: flex;
          gap: 8px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .tab {
          padding: 10px 16px;
          border: 2px solid #e5e7eb;
          background: white;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.9em;
          transition: all 0.2s;
          flex: 1;
          min-width: 150px;
        }

        .tab:hover {
          border-color: #667eea;
          background: #f9fafb;
        }

        .tab.active {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border-color: #667eea;
        }

        .guide-meta {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          padding: 16px;
          background: #f9fafb;
          border-radius: 8px;
          flex-wrap: wrap;
        }

        .meta-item {
          font-size: 0.9em;
        }

        .steps-list {
          list-style: none;
          counter-reset: step-counter;
          padding: 0;
        }

        .steps-list li {
          counter-increment: step-counter;
          margin-bottom: 20px;
          padding: 16px;
          border-left: 4px solid #667eea;
          background: #f9fafb;
          border-radius: 8px;
          position: relative;
        }

        .steps-list li::before {
          content: counter(step-counter);
          position: absolute;
          left: -20px;
          top: 16px;
          background: #667eea;
          color: white;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
        }

        .steps-list li.final-step {
          border-left-color: #10b981;
          background: #ecfdf5;
        }

        .steps-list li.final-step::before {
          content: '✓';
          background: #10b981;
        }

        .step-text {
          font-weight: 600;
          margin-bottom: 8px;
        }

        .step-details {
          font-size: 0.9em;
          color: #6b7280;
          margin-bottom: 8px;
        }

        .step-action {
          padding: 6px 12px;
          background: #667eea;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.9em;
          margin-top: 8px;
          transition: background 0.2s;
        }

        .step-action:hover {
          background: #5568d3;
        }

        .step-path {
          margin-top: 8px;
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .step-path code,
        .step-command code {
          background: #1f2937;
          color: #10b981;
          padding: 8px 12px;
          border-radius: 6px;
          font-size: 0.85em;
          display: block;
          margin-top: 8px;
          word-break: break-all;
        }

        .guide-footer {
          margin-top: 24px;
        }

        .info-box {
          padding: 16px;
          background: #eff6ff;
          border-left: 4px solid #3b82f6;
          border-radius: 8px;
          font-size: 0.9em;
        }
      `}</style>
    </div>
  );
}

export default ModelSetupGuide;
