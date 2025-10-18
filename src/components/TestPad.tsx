import { useState } from 'react';

export function TestPad() {
  const [text, setText] = useState('');

  const handleClear = () => {
    setText('');
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-lg border-2 border-orange-200 h-full flex flex-col">
      <div className="flex justify-between items-center mb-3">
        <h3 className="text-base font-semibold text-orange-900">Test Pad</h3>
        <button
          onClick={handleClear}
          className="px-3 py-1 bg-orange-600 text-white text-xs font-semibold rounded-lg shadow-md hover:bg-orange-700 transition-colors"
        >
          Clear
        </button>
      </div>
      <textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        className="flex-1 w-full p-3 border-2 border-orange-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 font-mono text-sm resize-none"
        placeholder="Type here to test..."
        autoFocus
      />
      <div className="mt-2 text-xs text-orange-700">
        {text.length} chars
      </div>
    </div>
  );
}
