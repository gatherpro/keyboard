import { useStore, loadKeyboardJsonFile, loadKeymapCFile } from '../stores/useStore';

export function FileUploader() {
  const { loadKeyboardJson, loadKeymapC } = useStore();

  const handleKeyboardJsonUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const json = await loadKeyboardJsonFile(file);
      loadKeyboardJson(json);
      alert('keyboard.json loaded successfully!');
    } catch (error) {
      alert(`Error loading keyboard.json: ${error}`);
    }
  };

  const handleKeymapCUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const content = await loadKeymapCFile(file);
      loadKeymapC(content);
      alert('keymap.c loaded successfully!');
    } catch (error) {
      alert(`Error loading keymap.c: ${error}`);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
      <h2 className="text-2xl font-bold mb-4">Load Files</h2>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          keyboard.json
        </label>
        <input
          type="file"
          accept=".json"
          onChange={handleKeyboardJsonUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-blue-50 file:text-blue-700
            hover:file:bg-blue-100"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          keymap.c
        </label>
        <input
          type="file"
          accept=".c"
          onChange={handleKeymapCUpload}
          className="block w-full text-sm text-gray-500
            file:mr-4 file:py-2 file:px-4
            file:rounded-md file:border-0
            file:text-sm file:font-semibold
            file:bg-green-50 file:text-green-700
            hover:file:bg-green-100"
        />
      </div>
    </div>
  );
}
