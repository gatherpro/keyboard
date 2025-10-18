import { FileUploader } from './components/FileUploader';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { useStore } from './stores/useStore';

function App() {
  const {
    generateKeymapC,
    parsedKeymap,
    viaConnected,
    connectVIA,
    disconnectVIA,
    loadKeymapFromVIA,
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
      const success = await connectVIA();
      if (success && keyboardJson) {
        try {
          await loadKeymapFromVIA();
          alert('Keymap loaded from VIA device!');
        } catch (error) {
          alert(`Failed to load keymap from device: ${error}`);
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <header className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            QMK Keymap Editor
          </h1>
          <p className="text-gray-600">
            Visual editor for QMK keyboard keymaps
          </p>
        </header>

        {/* File Uploader */}
        <FileUploader />

        {/* VIA Connection */}
        {keyboardJson && (
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              VIA Live Connection
            </h2>
            <div className="flex items-center gap-4">
              <button
                onClick={handleVIAConnect}
                className={`px-6 py-3 font-semibold rounded-lg shadow-md transition-colors ${
                  viaConnected
                    ? 'bg-red-600 text-white hover:bg-red-700'
                    : 'bg-green-600 text-white hover:bg-green-700'
                }`}
              >
                {viaConnected ? 'Disconnect VIA Device' : 'Connect VIA Device'}
              </button>
              {viaConnected && (
                <span className="flex items-center gap-2 text-green-600 font-medium">
                  <span className="w-3 h-3 bg-green-600 rounded-full animate-pulse"></span>
                  Connected - Changes apply in real-time
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 mt-4">
              {viaConnected
                ? 'Your keyboard is connected. Any keymap changes will be applied instantly.'
                : 'Connect your VIA-enabled keyboard to edit keymaps in real-time without re-flashing.'}
            </p>
          </div>
        )}

        {/* Keyboard Visualizer */}
        <KeyboardVisualizer />

        {/* Download Button */}
        {parsedKeymap && (
          <div className="flex justify-center">
            <button
              onClick={handleDownload}
              className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition-colors"
            >
              Download keymap.c
            </button>
          </div>
        )}

        {/* Footer */}
        <footer className="text-center text-sm text-gray-500 pt-8">
          <p>QMK Keymap Visual Editor - Edit your keyboard layout with ease</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
