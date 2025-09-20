import { useEffect } from 'react';

export const useDisableRightClick = () => {
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Prevent inspect element (Ctrl+Shift+I / Cmd+Opt+I)
      if (
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.metaKey && e.altKey && e.key === 'i')
      ) {
        e.preventDefault();
      }

      // Prevent view source (Ctrl+U / Cmd+U)
      if ((e.ctrlKey && e.key === 'u') || (e.metaKey && e.key === 'u')) {
        e.preventDefault();
      }

      // Prevent developer tools (F12)
      if (e.key === 'F12') {
        e.preventDefault();
      }

      // Prevent screenshot shortcuts - SIMPLIFIED AND MORE RELIABLE
      if (
        e.key === 'PrintScreen' ||
        (e.metaKey && e.shiftKey && (e.key === '3' || e.key === '4' || e.key === '5')) ||
        (e.ctrlKey && e.shiftKey && e.key === 'S') // Windows Snip & Sketch
      ) {
        e.preventDefault();
        console.log('Screenshot attempt detected!'); // Debug log
        showScreenshotWarning();
      }
    };

    // Simplified and more reliable blur overlay function
    const showScreenshotWarning = () => {
      // Remove existing overlay if any
      const existingOverlay = document.getElementById('screenshot-warning-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }

      // Create overlay
      const overlay = document.createElement('div');
      overlay.id = 'screenshot-warning-overlay';
      overlay.innerHTML = `
        <div style="
          position: fixed;
          top: 0;
          left: 0;
          width: 100vw;
          height: 100vh;
          background: rgba(0, 0, 0, 0.9);
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter: blur(15px);
          z-index: 999999;
          display: flex;
          align-items: center;
          justify-content: center;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        ">
          <div style="
            background: white;
            padding: 40px;
            border-radius: 15px;
            text-align: center;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            max-width: 450px;
            margin: 20px;
            animation: slideIn 0.3s ease-out;
          ">
            <div style="font-size: 60px; margin-bottom: 20px;">🚫</div>
            <h2 style="color: #e74c3c; margin: 0 0 15px 0; font-size: 28px; font-weight: 600;">Screenshot Blocked</h2>
            <p style="color: #555; margin: 0 0 25px 0; line-height: 1.6; font-size: 16px;">Screenshots are not allowed on this website for security and privacy protection.</p>
            <button onclick="this.parentElement.parentElement.parentElement.remove()" style="
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              color: white;
              border: none;
              padding: 12px 30px;
              border-radius: 25px;
              cursor: pointer;
              font-size: 16px;
              font-weight: 500;
              transition: transform 0.2s;
            " onmouseover="this.style.transform='scale(1.05)'" onmouseout="this.style.transform='scale(1)'">OK</button>
          </div>
        </div>
        <style>
          @keyframes slideIn {
            from { opacity: 0; transform: translateY(-50px) scale(0.9); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
        </style>
      `;

      document.body.appendChild(overlay);

      // Auto-close after 8 seconds
      setTimeout(() => {
        if (overlay && overlay.parentNode) {
          overlay.remove();
        }
      }, 8000);

      // Close on click outside
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) {
          overlay.remove();
        }
      });
    };

    // Test function - you can call this to test the blur overlay
    const testBlur = () => {
      showScreenshotWarning();
    };

    // Make test function available globally for debugging
    (window as any).testScreenshotBlur = testBlur;

    // Add event listeners
    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    // Cleanup function
    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
      
      // Remove any existing overlay
      const existingOverlay = document.getElementById('screenshot-warning-overlay');
      if (existingOverlay) {
        existingOverlay.remove();
      }
      
      // Remove test function
      delete (window as any).testScreenshotBlur;
    };
  }, []);
};