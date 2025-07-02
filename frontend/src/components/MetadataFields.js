

```
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
