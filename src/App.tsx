import { FileUploader } from './components/FileUploader';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { TestPad } from './components/TestPad';
import { useStore } from './stores/useStore';

function App() {
  const {
    generateKeymapC,
    parsedKeymap,
    viaConnected,
    connectVIA,
    disconnectVIA,
    keyboardJson
  } = useStore();

  const handleDownload = () => {
    try {
      const newKeymapC = generateKeymapC();

      // Create download
      const blob = new Blob([newKeymapC], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'keymap.c';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      alert('keymap.c downloaded successfully!');
    } catch (error) {
      alert(`Error generating keymap.c: ${error}`);
    }
  };

  const handleVIAConnect = async () => {
    if (viaConnected) {
      await disconnectVIA();
    } else {
      await connectVIA();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-orange-100 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-orange-900 mb-2">
            ErgoGain Keymap Editor
          </h1>
          <p className="text-orange-700">
            Visual editor for ErgoGain keyboard keymaps
          </p>
        </header>

        {/* VIA Connection */}
        <div className="bg-white rounded-lg shadow-lg border-2 border-orange-200 p-6">
            <h2 className="text-xl font-semibold text-orange-800 mb-4">
              VIA Live Connection
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleVIAConnect}
                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                  viaConnected
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-orange-600 text-white hover:bg-orange-700'
                }`}
              >
                {viaConnected ? 'Disconnect VIA Device' : 'Connect VIA Device'}
              </button>
              {viaConnected && (
                <span className="flex items-center gap-2 text-orange-600 font-medium">
                  <span className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></span>
                  Connected - Changes apply in real-time
                </span>
              )}
            </div>
            <p className="text-sm text-orange-700 mt-4">
              {viaConnected
                ? 'Your keyboard is connected. Any keymap changes will be applied instantly.'
                : 'Connect your VIA-enabled keyboard to edit keymaps in real-time without re-flashing.'}
            </p>
        </div>

        {/* File Uploader - Optional for unsupported keyboards */}
        {viaConnected && !keyboardJson && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
              Keyboard layout not detected automatically. Upload keyboard.json for visual layout:
            </p>
            <FileUploader />
          </div>
        )}

        {/* Main Content - Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Keyboard Visualizer (2/3 width) */}
          <div className="lg:col-span-2">
            <KeyboardVisualizer />
          </div>

          {/* Right Column - Test Pad (1/3 width) */}
          <div className="h-full" style={{ minHeight: '400px' }}>
            <TestPad />
          </div>
        </div>

        {/* Download Button */}
        {parsedKeymap && (
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors"
            >
              Download keymap.c
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-orange-600 pt-8">
          <p>ErgoGain Keymap Visual Editor - Edit your keyboard layout with ease</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
