



  { key: 'Department', label: 'Departments' },
  { key: 'Division', label: 'Divisions' },
  { key: 'Subject', label: 'Subjects' },
  useEffect(() => {
    setForm({}); setEditingId(null);
    fetchItems();
     eslint-disable-next-line
  }, [tab]);

  const fetchItems = async () => {
    setLoading(true); setError(null);
    try {
      if (tab === 'Contact') {
        const res = await axios.get(`${API_BASE}/contacts`);
        setItems(res.data);
      } else {
        const res = await axios.get(`${API_BASE}/metadata?type=${tab}`);
        setItems(res.data);
      }
    } catch (e) {
      setError('Failed to load');
    }
    setLoading(false);
  };

  const handleInput = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (tab === 'Contact') {
        await axios.post(`${API_BASE}/contacts`, form);
      } else {
        await axios.post(`${API_BASE}/metadata`, {
          key: form.value,
          value: form.value,
          dataType: tab,
        });
      }
      setForm({});
      fetchItems();
    } catch (e) {
      setError('Failed to add');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setForm(tab === 'Contact' ? {
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
    } : { value: item.value });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      if (tab === 'Contact') {
        await axios.put(`${API_BASE}/contacts/${editingId}`, form);
      } else {
        await axios.put(`${API_BASE}/metadata/${editingId}`, {
          key: form.value,
          value: form.value,
          dataType: tab,
        });
      }
      setEditingId(null); setForm({});
      fetchItems();
    } catch (e) {
      setError('Failed to update');
    }
  };

  const handleDelete = async (id) => {
    setError(null);
    try {
      if (tab === 'Contact') {
        await axios.delete(`${API_BASE}/contacts/${id}`);
      } else {
        await axios.delete(`${API_BASE}/metadata/${id}`);
      }
      fetchItems();
    } catch (e) {
      setError('Failed to delete');
    }
  };

  return (
    <div className="bg-gray-900 text-gray-100 p-8 rounded-lg max-w-2xl mx-auto mt-8 shadow-lg">
      <div className="flex gap-4 mb-6 border-b border-gray-700 pb-2">
        {TABS.map(t => (
          <button
            key={t.key}
            className={`px-4 py-2 rounded-t-md focus:outline-none ${tab === t.key ? 'bg-teal-700 text-white' : 'bg-gray-800 text-gray-300 hover:bg-gray-700'}`}
            onClick={() => setTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>
      {error && <div className="text-red-400 mb-2">{error}</div>}
      {loading ? <div>Loading...</div> : (
        <div>
          <form onSubmit={editingId ? handleUpdate : handleAdd} className="mb-4 flex flex-wrap gap-2 items-end">
            {tab === 'Contact' ? (
              <>
                <input name="firstName" value={form.firstName||''} onChange={handleInput} placeholder="First Name" className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required />
                <input name="lastName" value={form.lastName||''} onChange={handleInput} placeholder="Last Name" className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required />
                <input name="email" value={form.email||''} onChange={handleInput} placeholder="Email" className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required />
              </>
            ) : (
              <input name="value" value={form.value||''} onChange={handleInput} placeholder={tab+ ' name'} className="bg-gray-800 text-gray-100 px-2 py-1 rounded" required />
            )}
            <button type="submit" className="bg-teal-700 hover:bg-teal-600 px-4 py-1 rounded text-white font-semibold">
              {editingId ? 'Update' : 'Add'}
            </button>
            {editingId && (
              <button type="button" className="ml-2 text-gray-400 hover:text-gray-200" onClick={()=>{setEditingId(null);setForm({});}}>Cancel</button>
            )}
          </form>
          <ul>
            {items.map(item => (
              <li key={item.id} className="flex items-center justify-between py-2 border-b border-gray-800">
                <span>
                  {tab === 'Contact'
                    ? `${item.firstName} ${item.lastName} (${item.email})`
                    : item.value}
                </span>
                <span>
                  <button className="text-teal-400 hover:text-teal-200 mr-2" onClick={()=>handleEdit(item)}>Edit</button>
                  <button className="text-red-400 hover:text-red-200" onClick={()=>handleDelete(item.id)}>Delete</button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default MetadataAdmin;
