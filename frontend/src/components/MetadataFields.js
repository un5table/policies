import React from 'react';

function MetadataFields({ metadata, onChange, editable = true }) {
  // metadata: array of { key, value }
  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">Metadata Attributes</label>
      <div className="flex flex-col gap-2">
        {metadata.map((item, idx) => (
          <div key={idx} className="flex gap-2 items-center">
            <input
              className="border px-2 py-1 rounded flex-1"
              value={item.key}
              onChange={e => onChange(idx, { ...item, key: e.target.value })}
              disabled={!editable}
              placeholder="Attribute Name"
            />
            <input
              className="border px-2 py-1 rounded flex-1"
              value={item.value}
              onChange={e => onChange(idx, { ...item, value: e.target.value })}
              disabled={!editable}
              placeholder="Value"
            />
          </div>
        ))}
        {editable && (
          <button
            className="mt-2 px-3 py-1 bg-gray-200 rounded text-sm"
            type="button"
            onClick={() => onChange(metadata.length, { key: '', value: '' })}
          >
            + Add Metadata
          </button>
        )}
      </div>
    </div>
  );
}

export default MetadataFields;
