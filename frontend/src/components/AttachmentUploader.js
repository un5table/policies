import React, { useState } from 'react';
import { uploadAttachment } from '../api';

function AttachmentUploader({ attachments, onChange, policyId, maxSizeMB = 10, allowedTypes = ['.pdf', '.docx'] }) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    setError(null);
    setUploading(true);
    let uploaded = [...attachments];
    for (const file of files) {
      const ext = file.name.split('.').pop().toLowerCase();
      if (!allowedTypes.includes('.' + ext) || file.size > maxSizeMB * 1024 * 1024) {
        setError(`Invalid file: ${file.name}`);
        continue;
      }
      try {
        const att = await uploadAttachment(file, policyId);
        uploaded.push(att);
      } catch (err) {
        setError(`Failed to upload ${file.name}`);
      }
    }
    setUploading(false);
    onChange(uploaded);
  };

  const handleRemove = (idx) => {
    const updated = attachments.filter((_, i) => i !== idx);
    onChange(updated);
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1 text-gray-200">Attachments (.pdf, .docx, max {maxSizeMB}MB)</label>
      <input type="file" multiple onChange={handleFileChange} accept={allowedTypes.join(',')} className="mb-2 bg-gray-900 text-gray-100" />
      {uploading && <div className="text-teal-400 text-sm mb-2">Uploading...</div>}
      {error && <div className="text-red-400 text-sm mb-2">{error}</div>}
      <ul className="mt-2 text-sm text-gray-300">
        {attachments && attachments.map((file, idx) => (
          <li key={file.id || file.name || idx} className="flex items-center gap-2">
            <span>{file.originalName || file.name || file.filename}</span>
            <button type="button" className="text-red-400 hover:text-red-300 text-xs" onClick={() => handleRemove(idx)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default AttachmentUploader;
