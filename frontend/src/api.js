import axios from 'axios';

const API_BASE = 'http://localhost:4000/api';

export async function fetchPolicies() {
  const res = await axios.get(`${API_BASE}/policies`);
  return res.data;
}

export async function fetchPolicy(id) {
  const res = await axios.get(`${API_BASE}/policies/${id}`);
  return res.data;
}

export async function createPolicy(data) {
  const res = await axios.post(`${API_BASE}/policies`, data);
  return res.data;
}

export async function updatePolicy(id, data) {
  const res = await axios.put(`${API_BASE}/policies/${id}`, data);
  return res.data;
}

export async function deletePolicy(id) {
  const res = await axios.delete(`${API_BASE}/policies/${id}`);
  return res.data;
}

export async function uploadAttachment(file, policyId) {
  const formData = new FormData();
  formData.append('file', file);
  if (policyId) formData.append('policyId', policyId);
  const res = await axios.post(`${API_BASE}/attachments/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data.attachment;
}

export async function deleteAttachment(attachmentId) {
  const url = `${API_BASE}/attachments/${attachmentId}`;
  console.log('[deleteAttachment] DELETE URL:', url);
  try {
    const res = await axios.delete(url);
    console.log('[deleteAttachment] Success:', res.data);
    return res.data;
  } catch (err) {
    console.error('[deleteAttachment] Error:', err);
    throw err;
  }
}
