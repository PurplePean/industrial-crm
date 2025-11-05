import React, { useState, useEffect } from 'react';
import { Trash2, Plus, Edit2, Search, MapPin, DollarSign, TrendingUp } from 'lucide-react';

export default function IndustrialCRM() {
  const [properties, setProperties] = useState([]);
  const [brokers, setBrokers] = useState([]);
  const [activeTab, setActiveTab] = useState('assets');
  const [searchTerm, setSearchTerm] = useState('');
  const [showPropertyForm, setShowPropertyForm] = useState(false);
  const [showBrokerForm, setShowBrokerForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({});

  // Load from localStorage
  useEffect(() => {
    const savedProperties = localStorage.getItem('properties');
    const savedBrokers = localStorage.getItem('brokers');
    if (savedProperties) setProperties(JSON.parse(savedProperties));
    if (savedBrokers) setBrokers(JSON.parse(savedBrokers));
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('properties', JSON.stringify(properties));
  }, [properties]);

  useEffect(() => {
    localStorage.setItem('brokers', JSON.stringify(brokers));
  }, [brokers]);

  // Property form handlers
  const handleAddProperty = () => {
    setFormData({
      address: '',
      squareFeet: '',
      baseRentPerSqft: '',
      monthlyRent: '',
      exitCapRate: '',
      debtServicePerMonth: '',
      purchasePrice: '',
      equityInvested: '',
      crexi: '',
      notes: '',
      brokers: []
    });
    setEditingId(null);
    setShowPropertyForm(true);
  };

  const handleEditProperty = (property) => {
    setFormData(property);
    setEditingId(property.id);
    setShowPropertyForm(true);
  };

  const handleSaveProperty = () => {
    if (!formData.address) {
      alert('Please enter an address');
      return;
    }

    if (editingId) {
      setProperties(properties.map(p => p.id === editingId ? { ...formData, id: editingId } : p));
    } else {
      setProperties([...properties, { ...formData, id: Date.now() }]);
    }

    setShowPropertyForm(false);
    setFormData({});
  };

  const handleDeleteProperty = (id) => {
    setProperties(properties.filter(p => p.id !== id));
  };

  // Broker form handlers
  const handleAddBroker = () => {
    setFormData({ name: '', email: '', phone: '', conversations: '' });
    setEditingId(null);
    setShowBrokerForm(true);
  };

  const handleEditBroker = (broker) => {
    setFormData(broker);
    setEditingId(broker.id);
    setShowBrokerForm(true);
  };

  const handleSaveBroker = () => {
    if (!formData.name) {
      alert('Please enter broker name');
      return;
    }

    if (editingId) {
      setBrokers(brokers.map(b => b.id === editingId ? { ...formData, id: editingId } : b));
    } else {
      setBrokers([...brokers, { ...formData, id: Date.now() }]);
    }

    setShowBrokerForm(false);
    setFormData({});
  };

  const handleDeleteBroker = (id) => {
    setBrokers(brokers.filter(b => b.id !== id));
  };

  // Calculate metrics
  const calculateMetrics = (prop) => {
    const sqft = parseFloat(prop.squareFeet) || 0;
    const brf = parseFloat(prop.baseRentPerSqft) || 0;
    const mr = parseFloat(prop.monthlyRent) || brf * sqft;
    const annualRent = mr * 12;
    const pp = parseFloat(prop.purchasePrice) || 0;
    const ei = parseFloat(prop.equityInvested) || 0;
    const ds = parseFloat(prop.debtServicePerMonth) || 0;
    const annualDS = ds * 12;
    
    const noi = annualRent - 0;
    const dscr = annualDS > 0 ? (noi / annualDS).toFixed(2) : 'N/A';
    const ltv = pp > 0 ? ((pp - ei) / pp * 100).toFixed(1) : 'N/A';
    const coc = ei > 0 ? (((noi - annualDS) / ei) * 100).toFixed(1) : 'N/A';

    return { noi: noi.toFixed(0), dscr, ltv, coc, annualRent: annualRent.toFixed(0) };
  };

  const filteredProperties = properties.filter(p =>
    p.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.crexi.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-slate-900">Industrial Asset CRM</h1>
          <p className="text-slate-600 text-sm mt-1">NNN Property Management & Underwriting</p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Tabs */}
        <div className="flex gap-4 mb-8 border-b border-slate-200">
          <button
            onClick={() => setActiveTab('assets')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'assets'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Assets ({properties.length})
          </button>
          <button
            onClick={() => setActiveTab('brokers')}
            className={`px-6 py-3 font-semibold border-b-2 transition ${
              activeTab === 'brokers'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-600 hover:text-slate-900'
            }`}
          >
            Brokers ({brokers.length})
          </button>
        </div>

        {/* Assets Tab */}
        {activeTab === 'assets' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Search by address or Crexi link..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <button
                onClick={handleAddProperty}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Plus size={20} /> New Property
              </button>
            </div>

            {/* Property Form */}
            {showPropertyForm && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {editingId ? 'Edit Property' : 'Add New Property'}
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <input
                    type="text"
                    placeholder="Property Address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="col-span-2 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Square Feet"
                    value={formData.squareFeet || ''}
                    onChange={(e) => setFormData({ ...formData, squareFeet: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Base Rent/Sq Ft/Year"
                    value={formData.baseRentPerSqft || ''}
                    onChange={(e) => setFormData({ ...formData, baseRentPerSqft: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Monthly Rent"
                    value={formData.monthlyRent || ''}
                    onChange={(e) => setFormData({ ...formData, monthlyRent: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Exit Cap Rate (%)"
                    value={formData.exitCapRate || ''}
                    onChange={(e) => setFormData({ ...formData, exitCapRate: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Debt Service/Month"
                    value={formData.debtServicePerMonth || ''}
                    onChange={(e) => setFormData({ ...formData, debtServicePerMonth: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Purchase Price"
                    value={formData.purchasePrice || ''}
                    onChange={(e) => setFormData({ ...formData, purchasePrice: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Equity Invested"
                    value={formData.equityInvested || ''}
                    onChange={(e) => setFormData({ ...formData, equityInvested: e.target.value })}
                    className="px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="text"
                    placeholder="Crexi Listing Link"
                    value={formData.crexi || ''}
                    onChange={(e) => setFormData({ ...formData, crexi: e.target.value })}
                    className="col-span-2 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Deal Notes"
                    value={formData.notes || ''}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="col-span-2 px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveProperty}
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingId ? 'Update' : 'Add'} Property
                  </button>
                  <button
                    onClick={() => setShowPropertyForm(false)}
                    className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Properties List */}
            <div className="grid gap-6">
              {filteredProperties.map(property => {
                const metrics = calculateMetrics(property);
                return (
                  <div key={property.id} className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition">
                    <div className="flex justify-between items-start mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-slate-900">{property.address}</h3>
                        {property.crexi && (
                          <a href={property.crexi} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline text-sm mt-1">
                            View on Crexi →
                          </a>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEditProperty(property)}
                          className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                        >
                          <Edit2 size={20} />
                        </button>
                        <button
                          onClick={() => handleDeleteProperty(property.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>

                    {/* Metrics Grid */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase">Annual Rent</div>
                        <div className="text-2xl font-bold text-blue-600">${metrics.annualRent}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase">NOI</div>
                        <div className="text-2xl font-bold text-green-600">${metrics.noi}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase">DSCR</div>
                        <div className="text-2xl font-bold text-purple-600">{metrics.dscr}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase">LTV</div>
                        <div className="text-2xl font-bold text-orange-600">{metrics.ltv}%</div>
                      </div>
                    </div>

                    {/* Property Details */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Sq Ft</div>
                        <div className="text-lg font-semibold text-slate-900">{property.squareFeet || 'N/A'}</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Exit Cap</div>
                        <div className="text-lg font-semibold text-slate-900">{property.exitCapRate || 'N/A'}%</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase mb-1">CoC Return</div>
                        <div className="text-lg font-semibold text-slate-900">{metrics.coc}%</div>
                      </div>
                      <div>
                        <div className="text-xs font-semibold text-slate-600 uppercase mb-1">Purchase Price</div>
                        <div className="text-lg font-semibold text-slate-900">${property.purchasePrice || 'N/A'}</div>
                      </div>
                    </div>

                    {property.notes && (
                      <div className="bg-slate-50 p-4 rounded-lg">
                        <div className="text-xs font-bold text-slate-600 uppercase mb-2">Deal Notes</div>
                        <p className="text-slate-700 text-sm whitespace-pre-wrap">{property.notes}</p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {filteredProperties.length === 0 && !showPropertyForm && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-slate-500 text-lg">No properties yet. Click "New Property" to get started!</p>
              </div>
            )}
          </div>
        )}

        {/* Brokers Tab */}
        {activeTab === 'brokers' && (
          <div className="space-y-6">
            <div className="flex gap-4">
              <div className="flex-1"></div>
              <button
                onClick={handleAddBroker}
                className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                <Plus size={20} /> Add Broker
              </button>
            </div>

            {/* Broker Form */}
            {showBrokerForm && (
              <div className="bg-white rounded-xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-bold text-slate-900 mb-6">
                  {editingId ? 'Edit Broker' : 'Add New Broker'}
                </h2>

                <div className="space-y-6 mb-6">
                  <input
                    type="text"
                    placeholder="Broker Name"
                    value={formData.name || ''}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="email"
                    placeholder="Email"
                    value={formData.email || ''}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <input
                    type="tel"
                    placeholder="Phone"
                    value={formData.phone || ''}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    placeholder="Conversations & Notes"
                    value={formData.conversations || ''}
                    onChange={(e) => setFormData({ ...formData, conversations: e.target.value })}
                    className="w-full px-4 py-3 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 h-32"
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveBroker}
                    className="flex-1 bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
                  >
                    {editingId ? 'Update' : 'Add'} Broker
                  </button>
                  <button
                    onClick={() => setShowBrokerForm(false)}
                    className="flex-1 border border-slate-300 text-slate-700 font-semibold py-3 rounded-lg hover:bg-slate-50 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            {/* Brokers List */}
            <div className="grid gap-6">
              {brokers.map(broker => (
                <div key={broker.id} className="bg-white rounded-xl shadow-lg p-8 border border-slate-200 hover:shadow-xl transition">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">{broker.name}</h3>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEditBroker(broker)}
                        className="p-2 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                      >
                        <Edit2 size={20} />
                      </button>
                      <button
                        onClick={() => handleDeleteBroker(broker.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3 mb-6">
                    {broker.email && (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">Email:</span>
                        <a href={`mailto:${broker.email}`} className="text-blue-600 hover:underline ml-2">
                          {broker.email}
                        </a>
                      </div>
                    )}
                    {broker.phone && (
                      <div className="text-sm">
                        <span className="font-medium text-slate-700">Phone:</span>
                        <a href={`tel:${broker.phone}`} className="text-blue-600 hover:underline ml-2">
                          {broker.phone}
                        </a>
                      </div>
                    )}
                  </div>

                  {broker.conversations && (
                    <div className="bg-slate-50 p-4 rounded-lg">
                      <div className="text-xs font-bold text-slate-600 uppercase mb-2">Conversations & Notes</div>
                      <p className="text-sm text-slate-700 whitespace-pre-wrap">{broker.conversations}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {brokers.length === 0 && !showBrokerForm && (
              <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                <p className="text-slate-500 text-lg">No brokers yet. Click "Add Broker" to get started!</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
