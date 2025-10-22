import { FileUploader } from './components/FileUploader';
import { KeyboardVisualizer } from './components/KeyboardVisualizer';
import { ConceptModeVisualizer } from './components/ConceptModeVisualizer';
import { TestPad } from './components/TestPad';
import { MacroEditor } from './components/MacroEditor';
import { useStore } from './stores/useStore';

function App() {
  const {
    editorMode,
    setEditorMode,
    generateKeymapC,
    parsedKeymap,
    viaConnected,
    connectVIA,
    disconnectVIA,
    keyboardJson,
    macros,
    saveMacro,
    deleteMacro
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
          <p className="text-orange-700 mb-4">
            ErgoGain専用キーマップエディター
          </p>

          {/* Mode Switcher */}
          <div className="flex justify-center gap-2 mb-4">
            <button
              onClick={() => setEditorMode('device')}
              className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                editorMode === 'device'
                  ? 'bg-orange-600 text-white'
                  : 'bg-orange-200 text-orange-800 hover:bg-orange-300'
              }`}
            >
              実機モード
            </button>
            <button
              onClick={() => setEditorMode('concept')}
              className={`px-6 py-2 font-semibold rounded-lg transition-colors ${
                editorMode === 'concept'
                  ? 'bg-purple-600 text-white'
                  : 'bg-purple-200 text-purple-800 hover:bg-purple-300'
              }`}
            >
              構想モード
            </button>
          </div>

          <div className="max-w-2xl mx-auto bg-white border-2 border-orange-200 rounded-lg p-4">
            <p className="text-sm text-orange-900">
              {editorMode === 'device' ? (
                <>
                  <strong>実機モード：</strong><br/>
                  ① 下のボタンでErgoGainキーボードを接続<br/>
                  ② キーをクリックして機能を変更<br/>
                  ③ 右側のテストパッドで動作確認<br/>
                  ④ 変更は自動的にキーボードに反映されます（ファームウェア書き換え不要）
                </>
              ) : (
                <>
                  <strong>構想モード：</strong><br/>
                  ① キーを自由に配置してレイアウトを設計<br/>
                  ② 刻印を4分割・2分割・1分割で表示<br/>
                  ③ 各レイヤーのキーコードを視覚的に確認<br/>
                  ④ キーの色をカスタマイズ
                </>
              )}
            </p>
          </div>
        </header>

        {/* Device Connection - Only in Device Mode */}
        {editorMode === 'device' && (
          <div className="bg-white rounded-lg shadow-lg border-2 border-orange-200 p-6">
              <div className="flex items-center gap-4 justify-center">
                <button
                  onClick={handleVIAConnect}
                  className={`px-8 py-4 font-bold text-lg rounded-lg shadow-md transition-colors ${
                    viaConnected
                      ? 'bg-red-600 text-white hover:bg-red-700'
                      : 'bg-orange-600 text-white hover:bg-orange-700'
                  }`}
                >
                  {viaConnected ? 'Disconnect Device' : 'Connect Your Device'}
                </button>
                {viaConnected && (
                  <span className="flex items-center gap-2 text-orange-600 font-medium">
                    <span className="w-3 h-3 bg-orange-600 rounded-full animate-pulse"></span>
                    接続中
                  </span>
                )}
              </div>
          </div>
        )}

        {/* File Uploader - Optional for unsupported keyboards */}
        {viaConnected && !keyboardJson && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800 mb-2">
              Keyboard layout not detected automatically. Upload keyboard.json for visual layout:
            </p>
            <FileUploader />
          </div>
        )}

        {/* Main Content */}
        {editorMode === 'device' ? (
          // Device Mode: Two Column Layout
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
        ) : (
          // Concept Mode: Full Width Visualizer
          <ConceptModeVisualizer />
        )}

        {/* Macro Editor - Only show when connected */}
        {viaConnected && (
          <MacroEditor
            macros={macros}
            onSaveMacro={saveMacro}
            onDeleteMacro={deleteMacro}
          />
        )}

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
