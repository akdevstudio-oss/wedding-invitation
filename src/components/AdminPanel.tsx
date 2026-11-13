import React, { useState, useEffect } from 'react';
import {
  X,
  Lock,
  Users,
  Settings as SettingsIcon,
  Download,
  Plus,
  Trash2,
  CheckCircle,
  XCircle,
  Search,
  RotateCcw,
  Copy,
  Check,
  Share2,
  Crown,
  UserCheck,
  Edit2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import {
  InvitedGuest,
  EditableWeddingSettings,
  loadStoredSettings,
  saveStoredSettings,
  loadStoredInvitedGuests,
  saveStoredInvitedGuests,
  getDefaultSettings,
} from '../data/weddingStore';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsUpdated: (newSettings: EditableWeddingSettings) => void;
  onSelectActiveGuest?: (guest: InvitedGuest | null) => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  isOpen,
  onClose,
  onSettingsUpdated,
  onSelectActiveGuest,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pinInput, setPinInput] = useState('');
  const [pinError, setPinError] = useState(false);
  const [activeTab, setActiveTab] = useState<'guests' | 'settings'>('guests');

  // Guests state
  const [guests, setGuests] = useState<InvitedGuest[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'attending' | 'declined'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingGuest, setEditingGuest] = useState<InvitedGuest | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Form for new/edited guest
  const [guestForm, setGuestForm] = useState({
    name: '',
    relationship: 'Dear Friend',
    allowedSeats: 2,
    isWithFamily: false,
    invitedEvents: ['arrival', 'nikah', 'rukhsati'] as string[],
    isSpecialGuest: false,
    customNote: '',
  });

  // Settings state
  const [settings, setSettings] = useState<EditableWeddingSettings>(getDefaultSettings());
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setGuests(loadStoredInvitedGuests());
      setSettings(loadStoredSettings());
    }
  }, [isOpen]);

  // Handle PIN authentication (Default PIN: 2026)
  const handlePinSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pinInput === '2026' || pinInput.trim() === 'admin') {
      setIsAuthenticated(true);
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleQuickUnlock = () => {
    setIsAuthenticated(true);
    setPinError(false);
  };

  // Generate unique slug
  const generateSlug = (name: string): string => {
    return (
      name
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '-')
        .replace(/-+/g, '-')
        .replace(/^-|-$/g, '') || `guest-${Date.now()}`
    );
  };

  const toggleFormEvent = (eventId: string) => {
    setGuestForm((prev) => {
      const exists = prev.invitedEvents.includes(eventId);
      const updated = exists
        ? prev.invitedEvents.filter((id) => id !== eventId)
        : [...prev.invitedEvents, eventId];
      // ensure at least one event is selected
      return {
        ...prev,
        invitedEvents: updated.length > 0 ? updated : ['arrival'],
      };
    });
  };

  // Save guest handler
  const handleSaveGuest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!guestForm.name.trim()) return;

    if (editingGuest) {
      // Update existing guest
      const updated = guests.map((g) => {
        if (g.id === editingGuest.id) {
          return {
            ...g,
            name: guestForm.name.trim(),
            relationship: guestForm.relationship.trim(),
            allowedSeats: guestForm.isWithFamily ? 15 : Number(guestForm.allowedSeats),
            isWithFamily: guestForm.isWithFamily,
            invitedEvents: guestForm.invitedEvents,
            isSpecialGuest: guestForm.isSpecialGuest,
            customNote: guestForm.customNote.trim(),
          };
        }
        return g;
      });
      setGuests(updated);
      saveStoredInvitedGuests(updated);
      setEditingGuest(null);
    } else {
      // Add new guest
      const slug = generateSlug(guestForm.name);
      const newEntry: InvitedGuest = {
        id: `guest-${Date.now()}`,
        slug,
        name: guestForm.name.trim(),
        relationship: guestForm.relationship.trim(),
        allowedSeats: guestForm.isWithFamily ? 15 : Number(guestForm.allowedSeats),
        isWithFamily: guestForm.isWithFamily,
        invitedEvents: guestForm.invitedEvents,
        isSpecialGuest: guestForm.isSpecialGuest,
        customNote: guestForm.customNote.trim(),
        status: 'pending',
        confirmedCount: 0,
        confirmedMessage: '',
      };
      const updated = [newEntry, ...guests];
      setGuests(updated);
      saveStoredInvitedGuests(updated);
    }

    setGuestForm({
      name: '',
      relationship: 'Dear Friend',
      allowedSeats: 2,
      isWithFamily: false,
      invitedEvents: ['arrival', 'nikah', 'rukhsati'],
      isSpecialGuest: false,
      customNote: '',
    });
    setShowAddModal(false);
  };

  const handleDeleteGuest = (id: string) => {
    const updated = guests.filter((g) => g.id !== id);
    setGuests(updated);
    saveStoredInvitedGuests(updated);
  };

  const handleStartEdit = (guest: InvitedGuest) => {
    setEditingGuest(guest);
    setGuestForm({
      name: guest.name,
      relationship: guest.relationship,
      allowedSeats: guest.allowedSeats,
      isWithFamily: Boolean(guest.isWithFamily),
      invitedEvents: guest.invitedEvents || ['arrival', 'nikah', 'rukhsati'],
      isSpecialGuest: guest.isSpecialGuest,
      customNote: guest.customNote || '',
    });
    setShowAddModal(true);
  };

  // Build Personalized Link & Message
  const getGuestInvitationLink = (slug: string) => {
    const url = new URL(window.location.href);
    url.searchParams.set('invite', slug);
    return url.toString();
  };

  const getEventsDisplayNames = (events: string[]) => {
    const map: Record<string, string> = {
      arrival: 'Baraat Arrival (01:00 PM)',
      nikah: 'Sacred Nikah Ceremony (02:30 PM)',
      rukhsati: 'Rukhsati (04:00 PM)',
    };
    return events.map((e) => map[e] || e).join(' & ');
  };

  const getWhatsAppMessage = (guest: InvitedGuest) => {
    const link = getGuestInvitationLink(guest.slug);
    const seatsText = guest.isWithFamily
      ? 'With Family (Poori Family Ki Shirkat Ki Dawat)'
      : guest.allowedSeats === 1
      ? '1 Fard (Special VIP)'
      : `${guest.allowedSeats} Afrad (${guest.allowedSeats} Members)`;
    const eventsText = getEventsDisplayNames(guest.invitedEvents || ['arrival', 'nikah', 'rukhsati']);

    return `Assalam-o-Alaikum ${guest.name}! 🌸\n\nYou are cordially invited to celebrate the wedding of *Dr. Iqra Arshad & Muhammad Awais* on *Friday, 27 November 2026* at Shah Jahan Marriage Hall, Multan.\n\n✨ *Card For:* ${guest.name}${guest.isWithFamily ? ' (With Family)' : ''}\n✨ *Invited Members:* ${seatsText}\n✨ *Shirkat Ki Dawat:* ${eventsText}\n\nPlease tap your personalized digital link to view your invitation & confirm attendance:\n${link}\n\nWith Love, Prayers & Warm Regards,\nFamilies Arshad & Awais`;
  };

  const handleCopyLink = (guest: InvitedGuest) => {
    const msg = getWhatsAppMessage(guest);
    navigator.clipboard.writeText(msg);
    setCopiedId(guest.id);
    setTimeout(() => setCopiedId(null), 2500);
  };

  const handleOpenAsGuest = (guest: InvitedGuest) => {
    if (onSelectActiveGuest) {
      onSelectActiveGuest(guest);
    }
    const url = new URL(window.location.href);
    url.searchParams.set('invite', guest.slug);
    window.history.pushState({}, '', url.toString());
    onClose();
  };

  const exportToCSV = () => {
    const headers = [
      'Card Holder Name',
      'Relationship',
      'Final Invited Members',
      'Invited Programs',
      'Special VIP',
      'RSVP Status',
      'Confirmed Members',
      'Message',
      'Invitation Link',
    ];

    const rows = guests.map((g) => [
      `"${g.name.replace(/"/g, '""')}"`,
      `"${g.relationship}"`,
      g.isWithFamily ? '"With Family"' : g.allowedSeats,
      `"${(g.invitedEvents || []).join(', ')}"`,
      g.isSpecialGuest ? 'Yes' : 'No',
      g.status.toUpperCase(),
      g.status === 'attending' ? g.confirmedCount : 0,
      `"${(g.confirmedMessage || '').replace(/"/g, '""')}"`,
      `"${getGuestInvitationLink(g.slug)}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'wedding-guest-invitations.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Settings Save Handler
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    saveStoredSettings(settings);
    onSettingsUpdated(settings);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  const handleResetSettings = () => {
    const defaults = getDefaultSettings();
    setSettings(defaults);
    saveStoredSettings(defaults);
    onSettingsUpdated(defaults);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (!isOpen) return null;

  // Filtered Guests
  const filteredGuests = guests.filter((g) => {
    const matchesFilter =
      filterStatus === 'all' ? true : g.status === filterStatus;
    const matchesSearch =
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.relationship.toLowerCase().includes(searchQuery.toLowerCase()) ||
      g.slug.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  // Quota Metrics
  const totalCards = guests.length;
  const withFamilyCount = guests.filter((g) => g.isWithFamily).length;
  const totalInvitedMembers = guests
    .filter((g) => !g.isWithFamily)
    .reduce((sum, g) => sum + g.allowedSeats, 0);
  const totalConfirmedSeats = guests
    .filter((g) => g.status === 'attending')
    .reduce((sum, g) => sum + g.confirmedCount, 0);
  const pendingInvites = guests.filter((g) => g.status === 'pending').length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/65 backdrop-blur-sm animate-fadeIn">
      <div className="bg-[#FDFBF7] paper-texture w-full max-w-5xl max-h-[94vh] rounded-md border-2 border-[#D8C7AA] shadow-2xl flex flex-col overflow-hidden text-[#44382F]">
        {/* Top Header */}
        <div className="px-6 py-4 bg-[#F8F5EE] border-b border-[#D8C7AA] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-[#44382F] text-[#FDFBF7] flex items-center justify-center">
              <Lock className="w-4 h-4 text-[#D8C7AA]" />
            </div>
            <div>
              <h3 className="font-display text-lg text-[#44382F] font-semibold leading-tight">
                Guest Invitation &amp; Seat Setup
              </h3>
              <p className="text-[11px] font-serif text-[#8D8174]">
                Create links for specific guests (e.g. Ali: 2 seats for Nikah &amp; Baraat) and send on WhatsApp
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-[#D8C7AA]/40 text-[#8D8174] hover:text-[#44382F] transition-colors cursor-pointer"
            aria-label="Close Admin Panel"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        {!isAuthenticated ? (
          /* ================= PIN AUTHENTICATION SCREEN ================= */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center text-center my-auto">
            <div className="w-16 h-16 rounded-full bg-[#F8F5EE] border-2 border-[#B69A68] flex items-center justify-center mb-4 text-[#B69A68] shadow-sm">
              <Lock className="w-8 h-8" />
            </div>

            <h4 className="font-display text-2xl text-[#44382F] mb-1">
              Host Verification
            </h4>
            <p className="text-xs font-serif text-[#8D8174] max-w-sm mb-6">
              Enter host PIN to generate invitation links, allocate seats, and manage guest responses.
            </p>

            <form onSubmit={handlePinSubmit} className="w-full max-w-xs space-y-3">
              <input
                type="password"
                maxLength={8}
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                placeholder="Enter PIN (Default: 2026)"
                className="w-full px-4 py-3 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-center font-mono text-lg tracking-widest text-[#44382F] focus:outline-hidden focus:border-[#B69A68]"
                autoFocus
              />

              {pinError && (
                <p className="text-xs text-red-600 font-sans">
                  Invalid PIN. Default PIN is 2026.
                </p>
              )}

              <button
                type="submit"
                className="w-full py-3 px-4 rounded-xs bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] font-serif text-xs uppercase tracking-widest transition-colors shadow-xs cursor-pointer"
              >
                Unlock Dashboard
              </button>

              <button
                type="button"
                onClick={handleQuickUnlock}
                className="text-[11px] font-sans text-[#8D8174] hover:text-[#44382F] underline underline-offset-4 pt-1 cursor-pointer block mx-auto"
              >
                1-Click Quick Demo Unlock (PIN: 2026)
              </button>
            </form>
          </div>
        ) : (
          /* ================= MAIN DASHBOARD ================= */
          <div className="flex-1 overflow-hidden flex flex-col">
            {/* Tabs */}
            <div className="px-6 pt-3 bg-[#F8F5EE] border-b border-[#D8C7AA] flex items-center justify-between shrink-0">
              <div className="flex gap-2">
                <button
                  onClick={() => setActiveTab('guests')}
                  className={`px-4 py-2 font-serif text-xs uppercase tracking-wider rounded-t-xs border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'guests'
                      ? 'bg-[#FDFBF7] border-[#D8C7AA] text-[#44382F] font-semibold -mb-[1px]'
                      : 'border-transparent text-[#8D8174] hover:text-[#44382F]'
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#B69A68]" />
                  <span>Personalized Guest Invitations ({guests.length})</span>
                </button>

                <button
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2 font-serif text-xs uppercase tracking-wider rounded-t-xs border-t border-x transition-colors cursor-pointer flex items-center gap-2 ${
                    activeTab === 'settings'
                      ? 'bg-[#FDFBF7] border-[#D8C7AA] text-[#44382F] font-semibold -mb-[1px]'
                      : 'border-transparent text-[#8D8174] hover:text-[#44382F]'
                  }`}
                >
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>Card Details &amp; Timings</span>
                </button>
              </div>

              <button
                onClick={() => setIsAuthenticated(false)}
                className="text-[11px] font-serif text-[#8D8174] hover:text-[#44382F] uppercase tracking-wider pb-2 cursor-pointer"
              >
                Lock Panel
              </button>
            </div>

            {/* TAB 1: GUEST SEAT ALLOCATION & LINKS */}
            {activeTab === 'guests' && (
              <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
                {/* Real Metrics Strip: Family population vs Allowed vs Confirmed */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="bg-[#F8F5EE] border border-[#D8C7AA] p-3.5 rounded-xs text-center">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#8D8174] block">
                      Total Cards Issued
                    </span>
                    <span className="font-display tabular-nums text-2xl font-semibold text-[#44382F]">
                      {totalCards}
                    </span>
                    <span className="text-[10px] font-sans text-[#8D8174] block mt-0.5">
                      Invited Guest Cards
                    </span>
                  </div>

                  <div className="bg-[#F8F5EE] border border-[#B69A68] p-3.5 rounded-xs text-center">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#B69A68] font-bold block">
                      Final Invited Members
                    </span>
                    <span className="font-display tabular-nums text-2xl font-bold text-[#44382F]">
                      {totalInvitedMembers}{withFamilyCount > 0 ? '+' : ''}
                    </span>
                    <span className="text-[10px] font-sans text-[#8D8174] block mt-0.5">
                      {withFamilyCount > 0
                        ? `${withFamilyCount} With Family + ${totalInvitedMembers} Afrad`
                        : 'Total Afrad / Seats'}
                    </span>
                  </div>

                  <div className="bg-[#F8F5EE] border border-emerald-300 p-3.5 rounded-xs text-center">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-emerald-800 font-bold block">
                      Confirmed Members
                    </span>
                    <span className="font-display tabular-nums text-2xl font-bold text-emerald-700">
                      {totalConfirmedSeats}
                    </span>
                    <span className="text-[10px] font-sans text-emerald-600 block mt-0.5">
                      Attending Guests
                    </span>
                  </div>

                  <div className="bg-[#F8F5EE] border border-[#D8C7AA] p-3.5 rounded-xs text-center">
                    <span className="text-[10px] font-serif uppercase tracking-widest text-[#8D8174] block">
                      Pending Cards
                    </span>
                    <span className="font-display tabular-nums text-2xl font-semibold text-[#8D8174]">
                      {pendingInvites}
                    </span>
                    <span className="text-[10px] font-sans text-[#8D8174] block mt-0.5">
                      Awaiting RSVP
                    </span>
                  </div>
                </div>

                {/* Quick Add CTA Bar */}
                <div className="p-4 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div>
                    <h4 className="font-display text-sm font-semibold text-[#44382F]">
                      Naya Guest Card Generate Karein
                    </h4>
                    <p className="text-xs font-serif text-[#8D8174]">
                      Card holder ka naam, kitne final members, aur program select karein. Link foran tayyar ho jaye ga.
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingGuest(null);
                      setGuestForm({
                        name: '',
                        relationship: 'Dear Friend',
                        allowedSeats: 2,
                        isWithFamily: false,
                        invitedEvents: ['arrival', 'nikah', 'rukhsati'],
                        isSpecialGuest: false,
                        customNote: '',
                      });
                      setShowAddModal(true);
                    }}
                    className="px-4 py-2 bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] rounded-xs text-xs font-serif uppercase tracking-widest flex items-center gap-2 transition-colors shadow-xs cursor-pointer shrink-0"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Create Guest Card Link</span>
                  </button>
                </div>

                {/* Search & Actions Bar */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
                  <div className="relative w-full sm:w-72">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-[#8D8174]" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search by name, relation, or code..."
                      className="w-full pl-9 pr-3 py-2 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68]"
                    />
                  </div>

                  <div className="flex items-center gap-2 w-full sm:w-auto justify-end flex-wrap">
                    {/* Status Filter */}
                    <div className="flex items-center border border-[#D8C7AA] rounded-xs overflow-hidden text-xs font-serif">
                      {(['all', 'pending', 'attending', 'declined'] as const).map((st) => (
                        <button
                          key={st}
                          onClick={() => setFilterStatus(st)}
                          className={`px-2.5 py-1.5 capitalize transition-colors cursor-pointer ${
                            filterStatus === st
                              ? 'bg-[#44382F] text-[#FDFBF7]'
                              : 'bg-[#F8F5EE] text-[#8D8174] hover:text-[#44382F]'
                          }`}
                        >
                          {st}
                        </button>
                      ))}
                    </div>

                    {/* Export CSV Button */}
                    <button
                      onClick={exportToCSV}
                      className="px-3 py-1.5 bg-[#F8F5EE] hover:bg-[#D8C7AA]/40 text-[#44382F] border border-[#D8C7AA] rounded-xs text-xs font-serif uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
                      title="Download guest quotas and links as CSV"
                    >
                      <Download className="w-3.5 h-3.5 text-[#B69A68]" />
                      <span>Export CSV</span>
                    </button>
                  </div>
                </div>

                {/* Guest Quotas Table */}
                <div className="border border-[#D8C7AA] rounded-xs overflow-hidden bg-[#FDFBF7]">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs font-serif">
                      <thead>
                        <tr className="bg-[#F8F5EE] border-b border-[#D8C7AA] text-[10px] uppercase tracking-wider text-[#8D8174]">
                          <th className="py-3 px-4">Card Holder Name</th>
                          <th className="py-3 px-3">Shirkat Ki Dawat</th>
                          <th className="py-3 px-3">Final Members</th>
                          <th className="py-3 px-3">RSVP Status</th>
                          <th className="py-3 px-3">Confirmed</th>
                          <th className="py-3 px-4 text-right">Send Link &amp; Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#D8C7AA]/40">
                        {filteredGuests.length === 0 ? (
                          <tr>
                            <td colSpan={6} className="py-8 text-center text-[#8D8174]">
                              No guest records found. Click "Create Guest Card Link" to invite someone!
                            </td>
                          </tr>
                        ) : (
                          filteredGuests.map((guest) => {
                            const isCopied = copiedId === guest.id;
                            const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
                              getWhatsAppMessage(guest)
                            )}`;

                            return (
                              <tr key={guest.id} className="hover:bg-[#F8F5EE]/60 transition-colors">
                                <td className="py-3 px-4">
                                  <div className="flex items-center gap-2">
                                    <span className="font-semibold text-sm text-[#44382F]">
                                      {guest.name}
                                    </span>
                                    {guest.isSpecialGuest && (
                                      <span
                                        className="inline-flex items-center gap-0.5 text-[9px] uppercase tracking-wider bg-[#B69A68]/15 text-[#8D8174] border border-[#B69A68]/40 px-1.5 py-0.5 rounded-xs"
                                        title="Special 1-Person Invitation"
                                      >
                                        <Crown className="w-2.5 h-2.5 text-[#B69A68]" /> Special VIP
                                      </span>
                                    )}
                                  </div>
                                  <span className="text-[11px] text-[#8D8174] block">
                                    {guest.relationship}
                                  </span>
                                </td>

                                <td className="py-3 px-3">
                                  <div className="flex flex-wrap gap-1">
                                    {(guest.invitedEvents || ['arrival', 'nikah', 'rukhsati']).map((ev) => (
                                      <span
                                        key={ev}
                                        className="text-[9px] uppercase tracking-wider px-1.5 py-0.5 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-[#44382F]"
                                      >
                                        {ev === 'arrival' ? 'Baraat' : ev === 'nikah' ? 'Nikah' : 'Rukhsati'}
                                      </span>
                                    ))}
                                  </div>
                                </td>

                                <td className="py-3 px-3 font-sans tabular-nums">
                                  {guest.isWithFamily ? (
                                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#44382F] text-[#FDFBF7] border border-[#B69A68]">
                                      With Family
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold bg-[#B69A68]/15 text-[#44382F] border border-[#B69A68]/50">
                                      {guest.allowedSeats} {guest.allowedSeats === 1 ? 'Fard (1 Member)' : `Afrad (${guest.allowedSeats} Members)`}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-3">
                                  {guest.status === 'attending' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-sans text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                                      <CheckCircle className="w-3 h-3" /> Attending
                                    </span>
                                  )}
                                  {guest.status === 'declined' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-sans text-stone-600 bg-stone-100 px-2 py-0.5 rounded-full border border-stone-200">
                                      <XCircle className="w-3 h-3" /> Declined
                                    </span>
                                  )}
                                  {guest.status === 'pending' && (
                                    <span className="inline-flex items-center gap-1 text-[11px] font-sans text-[#8D8174] bg-[#F8F5EE] px-2 py-0.5 rounded-full border border-[#D8C7AA]">
                                      Pending
                                    </span>
                                  )}
                                </td>

                                <td className="py-3 px-3 font-sans tabular-nums font-medium text-[#44382F]">
                                  {guest.status === 'attending' ? `${guest.confirmedCount} Attending` : '—'}
                                </td>

                                <td className="py-3 px-4 text-right space-x-1.5 whitespace-nowrap">
                                  {/* Test/View As Guest Button */}
                                  <button
                                    onClick={() => handleOpenAsGuest(guest)}
                                    className="px-2 py-1 text-[10px] uppercase tracking-wider text-[#44382F] bg-[#F8F5EE] hover:bg-[#D8C7AA]/40 border border-[#D8C7AA] rounded-xs cursor-pointer inline-flex items-center gap-1"
                                    title="Preview how this guest sees their invitation"
                                  >
                                    <UserCheck className="w-3 h-3 text-[#B69A68]" />
                                    <span>Preview</span>
                                  </button>

                                  {/* Copy WhatsApp Message Button */}
                                  <button
                                    onClick={() => handleCopyLink(guest)}
                                    className={`px-2.5 py-1 text-[10px] uppercase tracking-wider rounded-xs cursor-pointer inline-flex items-center gap-1 transition-colors ${
                                      isCopied
                                        ? 'bg-emerald-600 text-white'
                                        : 'bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7]'
                                    }`}
                                    title="Copy customized WhatsApp invitation"
                                  >
                                    {isCopied ? (
                                      <>
                                        <Check className="w-3 h-3" />
                                        <span>Copied!</span>
                                      </>
                                    ) : (
                                      <>
                                        <Copy className="w-3 h-3" />
                                        <span>Copy Link</span>
                                      </>
                                    )}
                                  </button>

                                  {/* Direct WhatsApp Share Link */}
                                  <a
                                    href={whatsappUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="p-1 text-emerald-700 hover:text-emerald-900 hover:bg-emerald-50 rounded-xs cursor-pointer inline-flex items-center"
                                    title="Send directly on WhatsApp"
                                  >
                                    <Share2 className="w-3.5 h-3.5" />
                                  </a>

                                  {/* Edit Button */}
                                  <button
                                    onClick={() => handleStartEdit(guest)}
                                    className="p-1 text-[#8D8174] hover:text-[#44382F] hover:bg-[#D8C7AA]/30 rounded-xs cursor-pointer inline-flex items-center"
                                    title="Edit guest quota"
                                  >
                                    <Edit2 className="w-3.5 h-3.5" />
                                  </button>

                                  {/* Delete Button */}
                                  <button
                                    onClick={() => handleDeleteGuest(guest.id)}
                                    className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-xs cursor-pointer inline-flex items-center"
                                    title="Delete guest"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Add / Edit Guest Modal Sub-dialog */}
                {showAddModal && (
                  <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
                    <div className="bg-[#FDFBF7] paper-texture p-6 sm:p-8 rounded-xs border-2 border-[#D8C7AA] shadow-2xl max-w-lg w-full space-y-4 text-[#44382F] max-h-[90vh] overflow-y-auto">
                      <div className="flex justify-between items-center pb-2 border-b border-[#D8C7AA]">
                        <h4 className="font-display text-base font-semibold text-[#44382F]">
                          {editingGuest ? 'Edit Invitation Settings' : 'Create Personalized Guest Invitation'}
                        </h4>
                        <button
                          onClick={() => setShowAddModal(false)}
                          className="text-[#8D8174] hover:text-[#44382F]"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleSaveGuest} className="space-y-4">
                        {/* 1. Card Kis Ke Naam Ka Hai */}
                        <div>
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1 font-semibold">
                            Card Kis Ke Naam Ka Hai (Guest Name) *
                          </label>
                          <input
                            type="text"
                            required
                            value={guestForm.name}
                            onChange={(e) => setGuestForm({ ...guestForm, name: e.target.value })}
                            placeholder="e.g. Ali ya Ali Ahmed & Family"
                            className="w-full px-3 py-2 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F] focus:outline-hidden focus:border-[#B69A68]"
                          />
                        </div>

                        {/* 2. Kitne Final Members Inside / With Family Option */}
                        <div className="p-3 bg-[#F8F5EE] border-2 border-[#B69A68]/60 rounded-xs space-y-3">
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] font-bold">
                            Dawat Ki Qisam / Final Members *
                          </label>

                          {/* Quick Mode Selector */}
                          <div className="grid grid-cols-3 gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setGuestForm({
                                  ...guestForm,
                                  isWithFamily: false,
                                  isSpecialGuest: false,
                                  allowedSeats: guestForm.allowedSeats === 1 ? 2 : guestForm.allowedSeats,
                                })
                              }
                              className={`py-2 px-2 rounded-xs text-[11px] font-serif border transition-colors cursor-pointer ${
                                !guestForm.isWithFamily && !guestForm.isSpecialGuest
                                  ? 'bg-[#44382F] text-[#FDFBF7] border-[#44382F] font-semibold'
                                  : 'bg-[#FDFBF7] text-[#44382F] border-[#D8C7AA] hover:border-[#B69A68]'
                              }`}
                            >
                              Specific Afrad
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setGuestForm({
                                  ...guestForm,
                                  isWithFamily: true,
                                  isSpecialGuest: false,
                                })
                              }
                              className={`py-2 px-2 rounded-xs text-[11px] font-serif border transition-colors cursor-pointer ${
                                guestForm.isWithFamily
                                  ? 'bg-[#44382F] text-[#FDFBF7] border-[#44382F] font-semibold'
                                  : 'bg-[#FDFBF7] text-[#44382F] border-[#D8C7AA] hover:border-[#B69A68]'
                              }`}
                            >
                              With Family
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                setGuestForm({
                                  ...guestForm,
                                  isWithFamily: false,
                                  isSpecialGuest: true,
                                  allowedSeats: 1,
                                })
                              }
                              className={`py-2 px-2 rounded-xs text-[11px] font-serif border transition-colors cursor-pointer ${
                                guestForm.isSpecialGuest && !guestForm.isWithFamily
                                  ? 'bg-[#44382F] text-[#FDFBF7] border-[#44382F] font-semibold'
                                  : 'bg-[#FDFBF7] text-[#44382F] border-[#D8C7AA] hover:border-[#B69A68]'
                              }`}
                            >
                              Special 1 Fard
                            </button>
                          </div>

                          {guestForm.isWithFamily ? (
                            <div className="p-2.5 bg-[#FDFBF7] border border-[#B69A68] rounded-xs text-xs font-serif text-[#44382F]">
                              <span className="font-semibold text-[#B69A68] block">
                                ★ With Family (Poori Family Ki Dawat)
                              </span>
                              <span className="text-[11px] text-[#8D8174] block mt-0.5">
                                Card par &ldquo;With Family&rdquo; show hoga aur guest apni poori family ke sath shirkat confirm kar sakay ga.
                              </span>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-center gap-3">
                                <input
                                  type="number"
                                  min={1}
                                  max={20}
                                  disabled={guestForm.isSpecialGuest}
                                  value={guestForm.allowedSeats}
                                  onChange={(e) =>
                                    setGuestForm({
                                      ...guestForm,
                                      allowedSeats: Number(e.target.value),
                                    })
                                  }
                                  className="w-28 px-3 py-2 bg-[#FDFBF7] border-2 border-[#B69A68] rounded-xs text-sm font-mono font-bold text-[#44382F] text-center disabled:opacity-70"
                                />
                                <span className="text-xs font-serif text-[#8D8174]">
                                  {guestForm.allowedSeats === 1
                                    ? '1 Fard (1 Member / Person)'
                                    : `${guestForm.allowedSeats} Afrad (${guestForm.allowedSeats} Members / Persons)`}
                                </span>
                              </div>
                              <span className="text-[10px] text-[#8D8174] font-serif block">
                                Aap ka guest RSVP mein is se zyada afrad confirm nahi kar sakay ga.
                              </span>
                            </>
                          )}
                        </div>

                        {/* 3. Kis Kis Program Ma Shirkat Ki Dawat Hai */}
                        <div className="p-3 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs">
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-2 font-bold">
                            Kis Kis Program Ma Shirkat Ki Dawat Hai? *
                          </label>

                          <div className="space-y-2">
                            {[
                              { id: 'arrival', label: 'Baraat & Guest Arrival (01:00 PM)' },
                              { id: 'nikah', label: 'Sacred Nikah Ceremony (02:30 PM)' },
                              { id: 'rukhsati', label: 'Rukhsati (04:00 PM)' },
                            ].map((ev) => {
                              const isChecked = guestForm.invitedEvents.includes(ev.id);
                              return (
                                <label
                                  key={ev.id}
                                  className="flex items-center gap-2.5 cursor-pointer text-xs font-serif text-[#44382F] hover:text-[#B69A68] transition-colors"
                                >
                                  <input
                                    type="checkbox"
                                    checked={isChecked}
                                    onChange={() => toggleFormEvent(ev.id)}
                                    className="rounded-xs text-[#B69A68] focus:ring-0 w-4 h-4"
                                  />
                                  <span className={isChecked ? 'font-semibold text-[#44382F]' : 'text-[#8D8174]'}>
                                    {ev.label}
                                  </span>
                                </label>
                              );
                            })}
                          </div>
                        </div>

                        {/* Relationship (Optional) */}
                        <div>
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#8D8174] mb-1">
                            Relationship (Optional)
                          </label>
                          <input
                            type="text"
                            value={guestForm.relationship}
                            onChange={(e) =>
                              setGuestForm({ ...guestForm, relationship: e.target.value })
                            }
                            placeholder="e.g. Dear Friend / Family / Colleague"
                            className="w-full px-3 py-2 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                          />
                        </div>

                        {/* Custom Note */}
                        <div>
                          <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                            Custom Note for Invitation (Optional)
                          </label>
                          <input
                            type="text"
                            value={guestForm.customNote}
                            onChange={(e) => setGuestForm({ ...guestForm, customNote: e.target.value })}
                            placeholder="e.g. Specially invited for Sacred Nikah Ceremony"
                            className="w-full px-3 py-2 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                          />
                        </div>

                        <div className="pt-2 flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => setShowAddModal(false)}
                            className="px-3.5 py-2 text-xs font-serif text-[#8D8174] hover:text-[#44382F]"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-5 py-2 bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] text-xs font-serif uppercase tracking-widest rounded-xs transition-colors shadow-xs"
                          >
                            {editingGuest ? 'Update Settings' : 'Generate & Copy Link'}
                          </button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* TAB 2: INVITATION SETTINGS & DETAILS EDITOR */}
            {activeTab === 'settings' && (
              <div className="flex-1 overflow-y-auto p-6">
                <form onSubmit={handleSaveSettings} className="space-y-6 max-w-2xl mx-auto">
                  {saveSuccess && (
                    <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-800 rounded-xs text-xs font-serif flex items-center gap-2">
                      <CheckCircle className="w-4 h-4 text-emerald-600" />
                      <span>Invitation details updated successfully! Live card updated.</span>
                    </div>
                  )}

                  {/* Couple Names */}
                  <div className="p-5 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs space-y-4">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#44382F] pb-2 border-b border-[#D8C7AA]/60">
                      Couple Information
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Bride's Name
                        </label>
                        <input
                          type="text"
                          value={settings.brideName}
                          onChange={(e) => setSettings({ ...settings, brideName: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Bride's Father
                        </label>
                        <input
                          type="text"
                          value={settings.brideFather}
                          onChange={(e) =>
                            setSettings({ ...settings, brideFather: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Groom's Name
                        </label>
                        <input
                          type="text"
                          value={settings.groomName}
                          onChange={(e) => setSettings({ ...settings, groomName: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Groom's Father
                        </label>
                        <input
                          type="text"
                          value={settings.groomFather}
                          onChange={(e) =>
                            setSettings({ ...settings, groomFather: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Dates & Schedule */}
                  <div className="p-5 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs space-y-4">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#44382F] pb-2 border-b border-[#D8C7AA]/60">
                      Date &amp; Ceremonial Timings
                    </h4>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="sm:col-span-2">
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Display Wedding Date
                        </label>
                        <input
                          type="text"
                          value={settings.weddingDateDisplay}
                          onChange={(e) =>
                            setSettings({ ...settings, weddingDateDisplay: e.target.value })
                          }
                          placeholder="e.g. Friday, 27 November 2026"
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Baraat / Guest Arrival Time
                        </label>
                        <input
                          type="text"
                          value={settings.arrivalTime}
                          onChange={(e) =>
                            setSettings({ ...settings, arrivalTime: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Sacred Nikah Ceremony Time
                        </label>
                        <input
                          type="text"
                          value={settings.nikahTime}
                          onChange={(e) => setSettings({ ...settings, nikahTime: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Rukhsati Time
                        </label>
                        <input
                          type="text"
                          value={settings.rukhsatiTime}
                          onChange={(e) =>
                            setSettings({ ...settings, rukhsatiTime: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Venue & Location */}
                  <div className="p-5 bg-[#F8F5EE] border border-[#D8C7AA] rounded-xs space-y-4">
                    <h4 className="font-display text-sm font-semibold uppercase tracking-wider text-[#44382F] pb-2 border-b border-[#D8C7AA]/60">
                      Venue &amp; Location
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Venue Name
                        </label>
                        <input
                          type="text"
                          value={settings.venueName}
                          onChange={(e) => setSettings({ ...settings, venueName: e.target.value })}
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Venue Address
                        </label>
                        <input
                          type="text"
                          value={settings.venueAddress}
                          onChange={(e) =>
                            setSettings({ ...settings, venueAddress: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-serif uppercase tracking-wider text-[#44382F] mb-1">
                          Google Maps URL
                        </label>
                        <input
                          type="text"
                          value={settings.googleMapsUrl}
                          onChange={(e) =>
                            setSettings({ ...settings, googleMapsUrl: e.target.value })
                          }
                          className="w-full px-3 py-2 bg-[#FDFBF7] border border-[#D8C7AA] rounded-xs text-xs font-serif text-[#44382F]"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-2">
                    <button
                      type="button"
                      onClick={handleResetSettings}
                      className="px-4 py-2.5 text-xs font-serif text-[#8D8174] hover:text-[#44382F] border border-[#D8C7AA] bg-[#F8F5EE] rounded-xs cursor-pointer flex items-center gap-1.5"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset to Original</span>
                    </button>

                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#44382F] hover:bg-[#B69A68] text-[#FDFBF7] font-serif text-xs uppercase tracking-widest rounded-xs transition-colors shadow-xs cursor-pointer"
                    >
                      Save All Changes
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
