import React, { useState, useEffect, useMemo } from 'react';
import {
  Folder,
  FolderPlus,
  Edit2,
  Trash2,
  ArrowLeft,
  Plus,
  Users,
  MapPin,
  Calendar,
  Search,
  RotateCcw,
  Download,
  Settings,
  Check,
  X,
  FileText,
  BarChart3,
  ChevronRight,
  SlidersHorizontal,
  AlertCircle,
  CheckCircle2,
  Share2,
  Copy,
  ExternalLink,
  Filter,
  UserCheck,
  Sparkles,
  Power
} from 'lucide-react';

// ============================================================================
// DEFAULT DATA & CONSTANTS
// ============================================================================
const STORAGE_KEY = 'zion_survey_attendance_app_v2';

const FOLDER_COLORS = [
  {
    id: 'indigo',
    tab: 'bg-indigo-600',
    bg: 'bg-indigo-50',
    border: 'border-indigo-200',
    icon: 'text-indigo-600',
    badge: 'bg-indigo-100 text-indigo-700',
  },
  {
    id: 'emerald',
    tab: 'bg-emerald-600',
    bg: 'bg-emerald-50',
    border: 'border-emerald-200',
    icon: 'text-emerald-600',
    badge: 'bg-emerald-100 text-emerald-700',
  },
  {
    id: 'amber',
    tab: 'bg-amber-500',
    bg: 'bg-amber-50',
    border: 'border-amber-200',
    icon: 'text-amber-600',
    badge: 'bg-amber-100 text-amber-800',
  },
  {
    id: 'rose',
    tab: 'bg-rose-600',
    bg: 'bg-rose-50',
    border: 'border-rose-200',
    icon: 'text-rose-600',
    badge: 'bg-rose-100 text-rose-700',
  },
  {
    id: 'sky',
    tab: 'bg-sky-600',
    bg: 'bg-sky-50',
    border: 'border-sky-200',
    icon: 'text-sky-600',
    badge: 'bg-sky-100 text-sky-700',
  },
  {
    id: 'violet',
    tab: 'bg-violet-600',
    bg: 'bg-violet-50',
    border: 'border-violet-200',
    icon: 'text-violet-600',
    badge: 'bg-violet-100 text-violet-700',
  },
];

const INITIAL_CATEGORIES = [
  {
    id: 'cat-gathering',
    name: 'Gathering',
    description: 'Regular congregation & regional gathering attendance',
    color: 'indigo',
  },
  {
    id: 'cat-education',
    name: 'Education',
    description: 'Study sessions, workshops & youth classes',
    color: 'emerald',
  },
  {
    id: 'cat-online',
    name: 'Online Meeting',
    description: 'Virtual sessions & remote Zion participation',
    color: 'sky',
  },
];

const INITIAL_ZIONS = [
  { id: 'zion-rjy', name: 'Rajahmundry' },
  { id: 'zion-nlr', name: 'Nellore' },
  { id: 'zion-bvm', name: 'Bhimavaram' },
  { id: 'zion-jrg', name: 'Jangareddygudem' },
  { id: 'zion-elr', name: 'Eluru' },
  { id: 'zion-dwl', name: 'Dowleshwaram' },
  { id: 'zion-gkv', name: 'Gokavaram' },
];

const INITIAL_AGE_GROUPS = [
  { id: 'ag-male-adult', label: 'Male Adult', gender: 'male' },
  { id: 'ag-female-adult', label: 'Female Adult', gender: 'female' },
  { id: 'ag-male-youth', label: 'Male Youth', gender: 'male' },
  { id: 'ag-female-youth', label: 'Female Youth', gender: 'female' },
  { id: 'ag-male-students', label: 'Male Students', gender: 'male' },
  { id: 'ag-female-students', label: 'Female Students', gender: 'female' },
];

const getTodayISO = () => new Date().toISOString().split('T')[0];

function inferGenderFromLabel(label = '') {
  const lower = label.toLowerCase();
  if (lower.includes('female') || lower.includes('women') || lower.includes('girl') || lower.includes('sister')) {
    return 'female';
  }
  if (lower.includes('male') || lower.includes('men') || lower.includes('boy') || lower.includes('brother')) {
    return 'male';
  }
  return 'other';
}

const INITIAL_ENTRIES = [
  {
    id: 'ent-1',
    categoryId: 'cat-gathering',
    zionId: 'zion-rjy',
    date: getTodayISO(),
    notes: 'Morning Gathering',
    counts: {
      'ag-male-adult': 24,
      'ag-female-adult': 28,
      'ag-male-youth': 14,
      'ag-female-youth': 16,
      'ag-male-students': 11,
      'ag-female-students': 13,
    },
  },
  {
    id: 'ent-2',
    categoryId: 'cat-gathering',
    zionId: 'zion-nlr',
    date: getTodayISO(),
    notes: 'Regional Assembly',
    counts: {
      'ag-male-adult': 19,
      'ag-female-adult': 22,
      'ag-male-youth': 10,
      'ag-female-youth': 12,
      'ag-male-students': 9,
      'ag-female-students': 11,
    },
  },
  {
    id: 'ent-3',
    categoryId: 'cat-education',
    zionId: 'zion-elr',
    date: getTodayISO(),
    notes: 'Weekend Study Session',
    counts: {
      'ag-male-adult': 8,
      'ag-female-adult': 10,
      'ag-male-youth': 15,
      'ag-female-youth': 17,
      'ag-male-students': 18,
      'ag-female-students': 20,
    },
  },
  {
    id: 'ent-4',
    categoryId: 'cat-online',
    zionId: 'zion-bvm',
    date: getTodayISO(),
    notes: 'Evening Zoom Session',
    counts: {
      'ag-male-adult': 12,
      'ag-female-adult': 15,
      'ag-male-youth': 9,
      'ag-female-youth': 11,
      'ag-male-students': 7,
      'ag-female-students': 8,
    },
  },
];

// ============================================================================
// MAIN APPLICATION COMPONENT (DEFAULT EXPORT)
// ============================================================================
export default function App() {
  // Persistent State Initialization
  const [categories, setCategories] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Array.isArray(saved.categories) && saved.categories.length
        ? saved.categories
        : INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  });

  const [zions, setZions] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Array.isArray(saved.zions) && saved.zions.length ? saved.zions : INITIAL_ZIONS;
    } catch {
      return INITIAL_ZIONS;
    }
  });

  const [ageGroups, setAgeGroups] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Array.isArray(saved.ageGroups) && saved.ageGroups.length
        ? saved.ageGroups
        : INITIAL_AGE_GROUPS;
    } catch {
      return INITIAL_AGE_GROUPS;
    }
  });

  const [entries, setEntries] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
      return Array.isArray(saved.entries) ? saved.entries : INITIAL_ENTRIES;
    } catch {
      return INITIAL_ENTRIES;
    }
  });

  // Navigation & Route State ('home' | 'category' | 'public')
  const [activeRoute, setActiveRoute] = useState('home');
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  // Modals & Toast Feedback
  const [categoryModal, setCategoryModal] = useState(null); // { mode: 'add' | 'edit', category?: obj }
  const [manageFieldsOpen, setManageFieldsOpen] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState(null);
  const [toast, setToast] = useState(null);

  // Save changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ categories, zions, ageGroups, entries })
      );
    } catch {
      // Ignore storage quota issues
    }
  }, [categories, zions, ageGroups, entries]);

  // Listen to URL Hash (#/survey/<id>) so shared links open the public survey form directly
  useEffect(() => {
    const syncFromHash = () => {
      const hash = window.location.hash || '';
      if (hash.startsWith('#/survey/')) {
        const catId = decodeURIComponent(hash.replace('#/survey/', '').trim());
        if (catId) {
          setSelectedCategoryId(catId);
          setActiveRoute('public');
        }
      }
    };
    syncFromHash();
    window.addEventListener('hashchange', syncFromHash);
    return () => window.removeEventListener('hashchange', syncFromHash);
  }, []);

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() });
    setTimeout(() => {
      setToast((prev) => (prev && Date.now() - prev.id >= 2800 ? null : prev));
    }, 3000);
  };

  // Helpers to compute totals per entry
  const getEntryGenderStats = useMemo(() => {
    return (entry) => {
      let maleTotal = 0;
      let femaleTotal = 0;
      let grandTotal = 0;
      const counts = entry?.counts || {};

      ageGroups.forEach((ag) => {
        const val = Number(counts[ag.id]) || 0;
        grandTotal += val;
        const gender = ag.gender || inferGenderFromLabel(ag.label);
        if (gender === 'male') maleTotal += val;
        else if (gender === 'female') femaleTotal += val;
      });

      return { maleTotal, femaleTotal, grandTotal };
    };
  }, [ageGroups]);

  const getEntryTotal = (entry) => getEntryGenderStats(entry).grandTotal;

  const buildShareUrl = (categoryId) => {
    const base = window.location.href.split('#')[0];
    return `${base}#/survey/${encodeURIComponent(categoryId)}`;
  };

  const handleCopyShareLink = (cat) => {
    const link = buildShareUrl(cat.id);
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard
        .writeText(link)
        .then(() => showToast(`Survey link copied for "${cat.name}"!`))
        .catch(() => showToast(`Link ready: ${link}`, 'info'));
    } else {
      showToast(`Link: ${link}`, 'info');
    }
  };

  // Category CRUD Handlers
  const handleSaveCategory = ({ name, description, color }) => {
    const trimmed = name.trim();
    if (!trimmed) return;

    if (categoryModal?.mode === 'add') {
      const newCat = {
        id: `cat-${Date.now()}`,
        name: trimmed,
        description: description.trim(),
        color,
      };
      setCategories((prev) => [...prev, newCat]);
      showToast(`Survey "${trimmed}" created`);
    } else if (categoryModal?.mode === 'edit' && categoryModal.category) {
      setCategories((prev) =>
        prev.map((c) =>
          c.id === categoryModal.category.id
            ? { ...c, name: trimmed, description: description.trim(), color }
            : c
        )
      );
      showToast(`Survey "${trimmed}" updated`);
    }
    setCategoryModal(null);
  };

  const handleDeleteCategory = (cat) => {
    setConfirmDialog({
      title: `Delete "${cat.name}"?`,
      message: `This will permanently remove the "${cat.name}" survey folder and all its recorded entries.`,
      onConfirm: () => {
        setCategories((prev) => prev.filter((c) => c.id !== cat.id));
        setEntries((prev) => prev.filter((e) => e.categoryId !== cat.id));
        if (selectedCategoryId === cat.id) {
          setActiveRoute('home');
          setSelectedCategoryId(null);
        }
        setConfirmDialog(null);
        showToast(`Deleted "${cat.name}"`, 'info');
      },
    });
  };

  // Entry CRUD Handlers
  const handleSaveEntry = (categoryId, entryData, existingEntryId = null) => {
    if (existingEntryId) {
      setEntries((prev) =>
        prev.map((e) =>
          e.id === existingEntryId ? { ...e, ...entryData, categoryId } : e
        )
      );
      showToast('Survey entry updated');
    } else {
      const newEntry = {
        id: `ent-${Date.now()}`,
        categoryId,
        ...entryData,
      };
      setEntries((prev) => [newEntry, ...prev]);
      showToast('Survey response submitted');
    }
  };

  const handleDeleteEntry = (entryId) => {
    setConfirmDialog({
      title: 'Delete Survey Entry?',
      message: 'Are you sure you want to delete this survey record? This action cannot be undone.',
      onConfirm: () => {
        setEntries((prev) => prev.filter((e) => e.id !== entryId));
        setConfirmDialog(null);
        showToast('Entry deleted', 'info');
      },
    });
  };

  // Global Delete Handler from ManageFieldsModal
  const handleRequestFieldDelete = ({ type, id, label }) => {
    if (type === 'zion') {
      if (zions.length <= 1) {
        showToast('At least one Zion is required', 'info');
        return;
      }
      setConfirmDialog({
        title: `Delete Zion "${label}"?`,
        message: 'Existing records using this Zion will show "Unknown Zion" until reassigned.',
        onConfirm: () => {
          setZions((prev) => prev.filter((z) => z.id !== id));
          setConfirmDialog(null);
          showToast(`Removed Zion "${label}"`, 'info');
        },
      });
    } else if (type === 'ageGroup') {
      if (ageGroups.length <= 1) {
        showToast('At least one age group is required', 'info');
        return;
      }
      setConfirmDialog({
        title: `Remove "${label}"?`,
        message: 'This demographic field will be removed from forms and totals.',
        onConfirm: () => {
          setAgeGroups((prev) => prev.filter((ag) => ag.id !== id));
          setConfirmDialog(null);
          showToast(`Removed "${label}"`, 'info');
        },
      });
    }
  };

  const activeCategory = categories.find((c) => c.id === selectedCategoryId) || null;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      {/* Top Application Header */}
      <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/90">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={() => {
                window.location.hash = '';
                setActiveRoute('home');
                setSelectedCategoryId(null);
              }}
              className="flex items-center gap-2.5 text-left group cursor-pointer"
            >
              <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center shadow-xs group-hover:bg-indigo-700 transition-colors">
                <Users className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base sm:text-lg font-extrabold tracking-tight text-slate-900 truncate">
                  Zion Survey & Attendance
                </h1>
                <p className="text-[11px] text-slate-500 hidden sm:block">
                  Multi-Zion Demographic Participation & Analytics
                </p>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-2">
            {activeRoute !== 'home' && (
              <button
                onClick={() => {
                  window.location.hash = '';
                  setActiveRoute('home');
                  setSelectedCategoryId(null);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-100 hover:bg-slate-200/80 text-slate-700 text-xs font-semibold transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>All Surveys</span>
              </button>
            )}

            <button
              onClick={() => setManageFieldsOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-slate-200 hover:border-indigo-300 hover:text-indigo-600 text-slate-700 text-xs font-semibold shadow-2xs transition-colors"
            >
              <Settings className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Manage Zions & Groups</span>
              <span className="sm:hidden">Fields</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {activeRoute === 'public' && activeCategory ? (
          <PublicSurveyParticipationView
            category={activeCategory}
            zions={zions}
            setZions={setZions}
            ageGroups={ageGroups}
            setAgeGroups={setAgeGroups}
            getEntryGenderStats={getEntryGenderStats}
            shareUrl={buildShareUrl(activeCategory.id)}
            onCopyShareLink={() => handleCopyShareLink(activeCategory)}
            onSubmitSurvey={(data) => handleSaveEntry(activeCategory.id, data)}
            onGoToDashboard={() => {
              window.location.hash = '';
              setActiveRoute('category');
            }}
            onBackHome={() => {
              window.location.hash = '';
              setActiveRoute('home');
              setSelectedCategoryId(null);
            }}
            showToast={showToast}
          />
        ) : activeRoute === 'category' && activeCategory ? (
          <CategoryDashboardView
            category={activeCategory}
            entries={entries.filter((e) => e.categoryId === activeCategory.id)}
            zions={zions}
            setZions={setZions}
            ageGroups={ageGroups}
            setAgeGroups={setAgeGroups}
            getEntryTotal={getEntryTotal}
            getEntryGenderStats={getEntryGenderStats}
            shareUrl={buildShareUrl(activeCategory.id)}
            onCopyShareLink={() => handleCopyShareLink(activeCategory)}
            onOpenPublicSurvey={() => {
              window.location.hash = `#/survey/${encodeURIComponent(activeCategory.id)}`;
              setActiveRoute('public');
            }}
            onBack={() => {
              setActiveRoute('home');
              setSelectedCategoryId(null);
            }}
            onEditCategory={() =>
              setCategoryModal({ mode: 'edit', category: activeCategory })
            }
            onSaveEntry={(data, existingId) =>
              handleSaveEntry(activeCategory.id, data, existingId)
            }
            onDeleteEntry={handleDeleteEntry}
            onOpenManageFields={() => setManageFieldsOpen(true)}
            showToast={showToast}
          />
        ) : (
          <FolderDashboardView
            categories={categories}
            entries={entries}
            getEntryTotal={getEntryTotal}
            getEntryGenderStats={getEntryGenderStats}
            onOpenCategory={(catId) => {
              setSelectedCategoryId(catId);
              setActiveRoute('category');
            }}
            onOpenPublicSurvey={(catId) => {
              setSelectedCategoryId(catId);
              window.location.hash = `#/survey/${encodeURIComponent(catId)}`;
              setActiveRoute('public');
            }}
            onCopyShareLink={handleCopyShareLink}
            onAddCategory={() => setCategoryModal({ mode: 'add' })}
            onEditCategory={(cat) => setCategoryModal({ mode: 'edit', category: cat })}
            onDeleteCategory={handleDeleteCategory}
          />
        )}
      </main>

      {/* Modals */}
      {categoryModal && (
        <CategoryModal
          mode={categoryModal.mode}
          initialData={categoryModal.category}
          onClose={() => setCategoryModal(null)}
          onSave={handleSaveCategory}
        />
      )}

      {manageFieldsOpen && (
        <ManageFieldsModal
          zions={zions}
          setZions={setZions}
          ageGroups={ageGroups}
          setAgeGroups={setAgeGroups}
          onRequestDelete={handleRequestFieldDelete}
          onClose={() => setManageFieldsOpen(false)}
          showToast={showToast}
        />
      )}

      {confirmDialog && (
        <ConfirmModal
          title={confirmDialog.title}
          message={confirmDialog.message}
          onCancel={() => setConfirmDialog(null)}
          onConfirm={confirmDialog.onConfirm}
        />
      )}

      {/* Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 px-4 py-3 rounded-xl bg-slate-900 text-white text-xs sm:text-sm font-semibold shadow-xl border border-slate-700 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toast.message}</span>
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 1. TOP-LEVEL FOLDER VIEW (SURVEY CARDS + SHARE LINKS)
// ============================================================================
function FolderDashboardView({
  categories,
  entries,
  getEntryTotal,
  getEntryGenderStats,
  onOpenCategory,
  onOpenPublicSurvey,
  onCopyShareLink,
  onAddCategory,
  onEditCategory,
  onDeleteCategory,
}) {
  return (
    <div className="space-y-8">
      {/* Top Banner & Add Survey Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-indigo-600 mb-1">
            <Folder className="w-3.5 h-3.5" />
            <span>Survey Categories</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Select a Survey
          </h2>
          <p className="text-sm text-slate-500 mt-1">
            Open any survey folder to manage records, totals & filters, or share its direct survey link so participants can submit responses.
          </p>
        </div>

        <div className="flex items-center shrink-0">
          <button
            onClick={onAddCategory}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:scale-[0.99] text-white font-semibold text-sm shadow-sm transition-all cursor-pointer"
          >
            <FolderPlus className="w-4 h-4" />
            <span>+ Add Survey</span>
          </button>
        </div>
      </div>

      {/* Folder Cards Grid */}
      {categories.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-2xl border border-dashed border-slate-300">
          <Folder className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-slate-800">No Surveys Yet</h3>
          <p className="text-sm text-slate-500 mt-1 mb-5">
            Create your first survey (e.g., Gathering, Education, Online Meeting) to start recording attendance.
          </p>
          <button
            onClick={onAddCategory}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-indigo-600 text-white text-sm font-semibold hover:bg-indigo-700"
          >
            <FolderPlus className="w-4 h-4" />
            <span>Add Survey</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat) => {
            const catEntries = entries.filter((e) => e.categoryId === cat.id);
            let catParticipants = 0;
            let catMale = 0;
            let catFemale = 0;
            catEntries.forEach((e) => {
              const s = getEntryGenderStats(e);
              catParticipants += s.grandTotal;
              catMale += s.maleTotal;
              catFemale += s.femaleTotal;
            });
            const theme = FOLDER_COLORS.find((c) => c.id === cat.color) || FOLDER_COLORS[0];

            return (
              <div
                key={cat.id}
                onClick={() => onOpenCategory(cat.id)}
                className="group relative flex flex-col justify-between cursor-pointer transition-all duration-200 hover:-translate-y-1"
              >
                {/* Folder Top Tab Visual */}
                <div className="flex items-end">
                  <div
                    className={`h-3.5 w-28 rounded-t-xl ${theme.tab} opacity-90 group-hover:opacity-100 transition-opacity ml-1`}
                  />
                </div>

                {/* Folder Main Body */}
                <div className="bg-white rounded-2xl rounded-tl-none border border-slate-200/90 group-hover:border-indigo-300 shadow-xs group-hover:shadow-md p-5 sm:p-6 transition-all">
                  {/* Top Row: Folder Icon & Edit/Delete Actions */}
                  <div className="flex items-start justify-between gap-3">
                    <div
                      className={`w-12 h-12 rounded-xl ${theme.bg} ${theme.border} border flex items-center justify-center transition-transform group-hover:scale-105`}
                    >
                      <Folder className={`w-6 h-6 ${theme.icon} fill-current/15`} />
                    </div>

                    {/* Edit & Delete Buttons on Folder Card */}
                    <div
                      className="flex items-center gap-1"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        onClick={() => onEditCategory(cat)}
                        title="Edit Folder"
                        className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteCategory(cat)}
                        title="Delete Folder"
                        className="p-2 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Category Name & Description */}
                  <div className="mt-4">
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{cat.name}</span>
                      <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 group-hover:translate-x-0.5 transition-all" />
                    </h3>
                    <p className="text-xs text-slate-500 mt-1 line-clamp-1">
                      {cat.description || 'Tap to view & add survey records'}
                    </p>
                  </div>

                  {/* Gender Pills */}
                  <div className="mt-3.5 flex items-center gap-2 text-[11px] font-semibold">
                    <span className="px-2 py-0.5 rounded-md bg-sky-50 text-sky-700 border border-sky-100">
                      Male: {catMale.toLocaleString()}
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-rose-50 text-rose-700 border border-rose-100">
                      Female: {catFemale.toLocaleString()}
                    </span>
                  </div>

                  {/* Public Survey Link Bar */}
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between gap-2"
                  >
                    <button
                      onClick={() => onCopyShareLink(cat)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold transition-colors"
                      title="Copy Public Survey Link"
                    >
                      <Share2 className="w-3.5 h-3.5 text-indigo-600" />
                      <span>Copy Survey Link</span>
                    </button>

                    <button
                      onClick={() => onOpenPublicSurvey(cat.id)}
                      className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold text-indigo-600 hover:bg-indigo-50 transition-colors"
                      title="Open Public Survey Participation Form"
                    >
                      <span>Open Form</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Folder Stats Footer */}
                  <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between">
                    <div>
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                        Surveys
                      </span>
                      <span className="text-sm font-bold text-slate-800">
                        {catEntries.length} {catEntries.length === 1 ? 'Entry' : 'Entries'}
                      </span>
                    </div>

                    <div className="text-right">
                      <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider block">
                        Total Participants
                      </span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-sm font-bold ${theme.badge}`}>
                        {catParticipants.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

// ============================================================================
// 2. DEDICATED CATEGORY WORKSPACE (TOTALS, MALE/FEMALE, CUSTOM FILTERS, SHARE LINK)
// ============================================================================
function CategoryDashboardView({
  category,
  entries,
  zions,
  setZions,
  ageGroups,
  setAgeGroups,
  getEntryTotal,
  getEntryGenderStats,
  shareUrl,
  onCopyShareLink,
  onOpenPublicSurvey,
  onBack,
  onEditCategory,
  onSaveEntry,
  onDeleteEntry,
  onOpenManageFields,
  showToast,
}) {
  const theme = FOLDER_COLORS.find((c) => c.id === category.color) || FOLDER_COLORS[0];

  // Quick Filter States
  const [filterZion, setFilterZion] = useState('all');
  const [filterDateFrom, setFilterDateFrom] = useState('');
  const [filterDateTo, setFilterDateTo] = useState('');
  const [filterSearch, setFilterSearch] = useState('');

  // Customizable Dynamic Filter Rules (Add / Edit / Toggle / Remove)
  const [customFilters, setCustomFilters] = useState([]);
  const [filterRuleModal, setFilterRuleModal] = useState(null); // { mode: 'add' | 'edit', rule?: obj }

  // Sub-tabs ('records' | 'zionSummary') & Entry Modal State
  const [activeTab, setActiveTab] = useState('records');
  const [entryModal, setEntryModal] = useState(null); // { mode: 'add' | 'edit', entry?: obj }

  // Helper to evaluate a custom filter rule on a single entry
  const matchesCustomRule = (entry, rule) => {
    if (!rule.enabled) return true;
    const stats = getEntryGenderStats(entry);
    const zionName = zions.find((z) => z.id === entry.zionId)?.name || '';

    if (rule.field === 'zion') {
      const target = String(rule.value || '').toLowerCase();
      if (rule.operator === 'equals') return entry.zionId === rule.value || zionName.toLowerCase() === target;
      if (rule.operator === 'not_equals') return entry.zionId !== rule.value && zionName.toLowerCase() !== target;
      return zionName.toLowerCase().includes(target);
    }

    if (rule.field === 'notes') {
      const hay = `${entry.notes || ''} ${zionName}`.toLowerCase();
      const needle = String(rule.value || '').toLowerCase();
      if (rule.operator === 'not_contains') return !hay.includes(needle);
      return hay.includes(needle);
    }

    // Numeric metrics: maleTotal, femaleTotal, grandTotal, or specific ageGroup id
    let metricVal = 0;
    if (rule.field === 'maleTotal') metricVal = stats.maleTotal;
    else if (rule.field === 'femaleTotal') metricVal = stats.femaleTotal;
    else if (rule.field === 'grandTotal') metricVal = stats.grandTotal;
    else metricVal = Number(entry.counts?.[rule.field]) || 0;

    const threshold = Number(rule.value) || 0;
    switch (rule.operator) {
      case '>=':
        return metricVal >= threshold;
      case '<=':
        return metricVal <= threshold;
      case '>':
        return metricVal > threshold;
      case '<':
        return metricVal < threshold;
      case '==':
        return metricVal === threshold;
      default:
        return true;
    }
  };

  // Filtered Entries Computation
  const filteredEntries = useMemo(() => {
    return entries.filter((entry) => {
      if (filterZion !== 'all' && entry.zionId !== filterZion) return false;
      if (filterDateFrom && entry.date < filterDateFrom) return false;
      if (filterDateTo && entry.date > filterDateTo) return false;
      if (filterSearch.trim()) {
        const q = filterSearch.toLowerCase();
        const zionName = (zions.find((z) => z.id === entry.zionId)?.name || '').toLowerCase();
        const notes = (entry.notes || '').toLowerCase();
        if (!zionName.includes(q) && !notes.includes(q) && !entry.date.includes(q)) {
          return false;
        }
      }
      for (const rule of customFilters) {
        if (!matchesCustomRule(entry, rule)) return false;
      }
      return true;
    });
  }, [entries, filterZion, filterDateFrom, filterDateTo, filterSearch, customFilters, zions, ageGroups]);

  // Filtered Totals (Grand Total, Male Total, Female Total, and per Age Group)
  const totals = useMemo(() => {
    let grandTotal = 0;
    let maleTotal = 0;
    let femaleTotal = 0;
    const byAgeGroup = {};
    ageGroups.forEach((ag) => {
      byAgeGroup[ag.id] = 0;
    });

    filteredEntries.forEach((entry) => {
      const s = getEntryGenderStats(entry);
      grandTotal += s.grandTotal;
      maleTotal += s.maleTotal;
      femaleTotal += s.femaleTotal;
      ageGroups.forEach((ag) => {
        byAgeGroup[ag.id] += Number(entry.counts?.[ag.id]) || 0;
      });
    });

    return { grandTotal, maleTotal, femaleTotal, byAgeGroup };
  }, [filteredEntries, ageGroups, getEntryGenderStats]);

  // Zion-wise Aggregated Summary
  const zionBreakdown = useMemo(() => {
    const map = new Map();
    filteredEntries.forEach((entry) => {
      const zName = zions.find((z) => z.id === entry.zionId)?.name || 'Unknown Zion';
      if (!map.has(entry.zionId)) {
        const initCounts = {};
        ageGroups.forEach((ag) => (initCounts[ag.id] = 0));
        map.set(entry.zionId, {
          zionId: entry.zionId,
          zionName: zName,
          entryCount: 0,
          maleTotal: 0,
          femaleTotal: 0,
          grandTotal: 0,
          counts: initCounts,
        });
      }
      const row = map.get(entry.zionId);
      const s = getEntryGenderStats(entry);
      row.entryCount += 1;
      row.maleTotal += s.maleTotal;
      row.femaleTotal += s.femaleTotal;
      row.grandTotal += s.grandTotal;
      ageGroups.forEach((ag) => {
        row.counts[ag.id] += Number(entry.counts?.[ag.id]) || 0;
      });
    });
    return Array.from(map.values()).sort((a, b) => b.grandTotal - a.grandTotal);
  }, [filteredEntries, zions, ageGroups, getEntryGenderStats]);

  const hasActiveFilters =
    filterZion !== 'all' ||
    filterDateFrom !== '' ||
    filterDateTo !== '' ||
    filterSearch.trim() !== '' ||
    customFilters.some((r) => r.enabled);

  const handleResetFilters = () => {
    setFilterZion('all');
    setFilterDateFrom('');
    setFilterDateTo('');
    setFilterSearch('');
    setCustomFilters((prev) => prev.map((r) => ({ ...r, enabled: false })));
  };

  // CSV Export
  const handleExportCSV = () => {
    const headers = [
      'Category',
      'Date',
      'Zion',
      'Notes',
      ...ageGroups.map((ag) => ag.label),
      'Male Total',
      'Female Total',
      'Grand Total',
    ];
    const rows = filteredEntries.map((entry) => {
      const zName = zions.find((z) => z.id === entry.zionId)?.name || 'Unknown';
      const s = getEntryGenderStats(entry);
      return [
        `"${category.name.replace(/"/g, '""')}"`,
        entry.date,
        `"${zName.replace(/"/g, '""')}"`,
        `"${(entry.notes || '').replace(/"/g, '""')}"`,
        ...ageGroups.map((ag) => Number(entry.counts?.[ag.id]) || 0),
        s.maleTotal,
        s.femaleTotal,
        s.grandTotal,
      ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${category.name.toLowerCase().replace(/\s+/g, '_')}_survey_${getTodayISO()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('CSV exported successfully');
  };

  const getRuleFieldLabel = (field) => {
    if (field === 'maleTotal') return 'Male Total';
    if (field === 'femaleTotal') return 'Female Total';
    if (field === 'grandTotal') return 'Grand Total';
    if (field === 'zion') return 'Zion';
    if (field === 'notes') return 'Search / Remarks';
    return ageGroups.find((ag) => ag.id === field)?.label || field;
  };

  const formatRuleDisplayValue = (rule) => {
    if (rule.field === 'zion') {
      return zions.find((z) => z.id === rule.value)?.name || rule.value;
    }
    return rule.value;
  };

  return (
    <div className="space-y-6">
      {/* Category Header & Shareable Public Link */}
      <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-start gap-3.5">
            <button
              onClick={onBack}
              className="mt-0.5 p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors"
              title="Back to All Surveys"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${theme.badge}`}>
                  Survey Workspace
                </span>
                <button
                  onClick={onEditCategory}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-slate-500 hover:text-indigo-600"
                >
                  <Edit2 className="w-3 h-3" />
                  <span>Edit Survey</span>
                </button>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 mt-1">
                {category.name}
              </h2>
              {category.description && (
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  {category.description}
                </p>
              )}
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <button
              onClick={onOpenPublicSurvey}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-700 border border-emerald-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Public Survey Form</span>
            </button>

            <button
              onClick={handleExportCSV}
              className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 text-xs sm:text-sm font-semibold transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => setEntryModal({ mode: 'add' })}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-sm transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Entry</span>
            </button>
          </div>
        </div>

        {/* Shareable Survey Link Strip */}
        <div className="p-3 rounded-xl bg-indigo-50/70 border border-indigo-100 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 min-w-0">
            <Share2 className="w-4 h-4 text-indigo-600 shrink-0" />
            <span className="text-xs font-bold text-indigo-900 shrink-0">
              Participant Link:
            </span>
            <code className="text-xs text-indigo-700 bg-white px-2.5 py-1 rounded-lg border border-indigo-200/80 truncate block">
              {shareUrl}
            </code>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
          </div>
        </div>
      </div>

      {/* Live Totals Summary Bar (Grand Total, Male Total, Female Total + Age Groups) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Grand Total Card */}
        <div className="col-span-2 sm:col-span-1 bg-indigo-600 text-white p-4 rounded-2xl shadow-xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-200">
            Grand Total
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-extrabold tabular-nums">
              {totals.grandTotal.toLocaleString()}
            </span>
            <span className="text-xs text-indigo-200">
              {filteredEntries.length} {filteredEntries.length === 1 ? 'entry' : 'entries'}
            </span>
          </div>
        </div>

        {/* Male Total Card */}
        <div className="bg-white p-4 rounded-2xl border border-sky-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-sky-600">
            Male Total
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-sky-900 tabular-nums">
              {totals.maleTotal.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-sky-600">
              {totals.grandTotal > 0
                ? `${Math.round((totals.maleTotal / totals.grandTotal) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Female Total Card */}
        <div className="bg-white p-4 rounded-2xl border border-rose-200/90 shadow-2xs flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-rose-600">
            Female Total
          </span>
          <div className="mt-2 flex items-baseline justify-between">
            <span className="text-2xl font-extrabold text-rose-900 tabular-nums">
              {totals.femaleTotal.toLocaleString()}
            </span>
            <span className="text-xs font-semibold text-rose-600">
              {totals.grandTotal > 0
                ? `${Math.round((totals.femaleTotal / totals.grandTotal) * 100)}%`
                : '0%'}
            </span>
          </div>
        </div>

        {/* Dynamic Age Group Mini-Cards */}
        {ageGroups.map((ag) => {
          const val = totals.byAgeGroup[ag.id] || 0;
          const pct = totals.grandTotal > 0 ? Math.round((val / totals.grandTotal) * 100) : 0;
          return (
            <div
              key={ag.id}
              className="bg-white p-3.5 rounded-2xl border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <span className="text-xs font-semibold text-slate-600 truncate" title={ag.label}>
                {ag.label}
              </span>
              <div className="mt-2 flex items-baseline justify-between">
                <span className="text-xl font-extrabold text-slate-900 tabular-nums">
                  {val.toLocaleString()}
                </span>
                <span className="text-[11px] font-semibold text-slate-400">{pct}%</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Filters & Customizable Search/Filter Builder */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/90 shadow-xs space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <SlidersHorizontal className="w-4 h-4 text-indigo-600" />
            <h3 className="text-sm font-bold text-slate-900">
              Filters & Search ({category.name})
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setFilterRuleModal({ mode: 'add' })}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Filter / Search Rule</span>
            </button>

            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 text-xs font-semibold transition-colors"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Standard Quick Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Zion Location
            </label>
            <select
              value={filterZion}
              onChange={(e) => setFilterZion(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm font-medium text-slate-800 focus:outline-none focus:border-indigo-500"
            >
              <option value="all">All Zions ({zions.length})</option>
              {zions.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              From Date
            </label>
            <input
              type="date"
              value={filterDateFrom}
              onChange={(e) => setFilterDateFrom(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              To Date
            </label>
            <input
              type="date"
              value={filterDateTo}
              onChange={(e) => setFilterDateTo(e.target.value)}
              className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-500 mb-1">
              Quick Search (Zion / Remarks)
            </label>
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={filterSearch}
                onChange={(e) => setFilterSearch(e.target.value)}
                placeholder="Search records..."
                className="w-full pl-9 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs sm:text-sm text-slate-800 focus:outline-none focus:border-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Custom Filter Pills (Add / Toggle / Edit / Remove) */}
        {customFilters.length > 0 && (
          <div className="pt-2 border-t border-slate-100 flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
              Custom Rules:
            </span>
            {customFilters.map((rule) => (
              <div
                key={rule.id}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-xs font-semibold transition-all ${
                  rule.enabled
                    ? 'bg-indigo-50 border-indigo-200 text-indigo-800'
                    : 'bg-slate-100 border-slate-200 text-slate-400 line-through'
                }`}
              >
                <button
                  type="button"
                  onClick={() =>
                    setCustomFilters((prev) =>
                      prev.map((r) => (r.id === rule.id ? { ...r, enabled: !r.enabled } : r))
                    )
                  }
                  title={rule.enabled ? 'Disable rule' : 'Enable rule'}
                  className="p-0.5 rounded hover:bg-white/70"
                >
                  <Power className="w-3 h-3" />
                </button>
                <span>
                  {getRuleFieldLabel(rule.field)} {rule.operator}{' '}
                  <strong>{formatRuleDisplayValue(rule)}</strong>
                </span>
                <button
                  type="button"
                  onClick={() => setFilterRuleModal({ mode: 'edit', rule })}
                  title="Edit Filter Rule"
                  className="p-0.5 rounded hover:bg-white/70 text-indigo-600"
                >
                  <Edit2 className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setCustomFilters((prev) => prev.filter((r) => r.id !== rule.id))
                  }
                  title="Remove Filter Rule"
                  className="p-0.5 rounded hover:bg-white/70 text-rose-600"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* View Switcher Tabs: Detailed Survey Entries vs Zion-wise Summary */}
      <div className="flex items-center justify-between gap-3">
        <div className="inline-flex p-1 rounded-xl bg-slate-200/70">
          <button
            onClick={() => setActiveTab('records')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'records'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Survey Records ({filteredEntries.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('zionSummary')}
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs sm:text-sm font-semibold transition-all ${
              activeTab === 'zionSummary'
                ? 'bg-white text-indigo-600 shadow-2xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>Zion-wise Summary ({zionBreakdown.length})</span>
          </button>
        </div>

        <button
          onClick={onOpenManageFields}
          className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 hidden sm:inline-flex items-center gap-1"
        >
          <Settings className="w-3.5 h-3.5" />
          <span>Edit Zions / Age Groups</span>
        </button>
      </div>

      {/* Data Table */}
      {activeTab === 'records' ? (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {filteredEntries.length === 0 ? (
            <div className="p-12 text-center">
              <Users className="w-10 h-10 text-slate-300 mx-auto mb-2" />
              <p className="text-sm font-semibold text-slate-700">No matching survey entries</p>
              <p className="text-xs text-slate-500 mt-1 mb-4">
                Add a new survey record or adjust your active filters.
              </p>
              <button
                onClick={() => setEntryModal({ mode: 'add' })}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Entry</span>
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Date</th>
                    <th className="py-3.5 px-4">Zion</th>
                    <th className="py-3.5 px-4">Remarks</th>
                    {ageGroups.map((ag) => (
                      <th key={ag.id} className="py-3.5 px-3 text-right whitespace-nowrap">
                        {ag.label}
                      </th>
                    ))}
                    <th className="py-3.5 px-3 text-right text-sky-700 bg-sky-50/60 whitespace-nowrap">
                      Male Total
                    </th>
                    <th className="py-3.5 px-3 text-right text-rose-700 bg-rose-50/60 whitespace-nowrap">
                      Female Total
                    </th>
                    <th className="py-3.5 px-4 text-right text-indigo-700 bg-indigo-50/60 whitespace-nowrap">
                      Total
                    </th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {filteredEntries.map((entry) => {
                    const zName =
                      zions.find((z) => z.id === entry.zionId)?.name || 'Unknown Zion';
                    const stats = getEntryGenderStats(entry);
                    return (
                      <tr key={entry.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-700 whitespace-nowrap">
                          {entry.date}
                        </td>
                        <td className="py-3 px-4 font-bold text-slate-900 whitespace-nowrap">
                          {zName}
                        </td>
                        <td className="py-3 px-4 text-slate-500 max-w-[180px] truncate">
                          {entry.notes || '—'}
                        </td>
                        {ageGroups.map((ag) => (
                          <td
                            key={ag.id}
                            className="py-3 px-3 text-right tabular-nums text-slate-700"
                          >
                            {Number(entry.counts?.[ag.id]) || 0}
                          </td>
                        ))}
                        <td className="py-3 px-3 text-right font-bold text-sky-800 bg-sky-50/40 tabular-nums">
                          {stats.maleTotal}
                        </td>
                        <td className="py-3 px-3 text-right font-bold text-rose-800 bg-rose-50/40 tabular-nums">
                          {stats.femaleTotal}
                        </td>
                        <td className="py-3 px-4 text-right font-extrabold text-indigo-700 bg-indigo-50/40 tabular-nums">
                          {stats.grandTotal}
                        </td>
                        <td className="py-3 px-4 text-right whitespace-nowrap">
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => setEntryModal({ mode: 'edit', entry })}
                              title="Edit Entry"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-indigo-50"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => onDeleteEntry(entry.id)}
                              title="Delete Entry"
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
          {zionBreakdown.length === 0 ? (
            <div className="p-12 text-center text-sm text-slate-500">
              No Zion summary data available for the current filter selection.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-bold uppercase tracking-wider text-slate-500">
                    <th className="py-3.5 px-4">Zion</th>
                    <th className="py-3.5 px-3 text-right">Records</th>
                    {ageGroups.map((ag) => (
                      <th key={ag.id} className="py-3.5 px-3 text-right whitespace-nowrap">
                        {ag.label}
                      </th>
                    ))}
                    <th className="py-3.5 px-3 text-right text-sky-700 bg-sky-50/60">
                      Male Total
                    </th>
                    <th className="py-3.5 px-3 text-right text-rose-700 bg-rose-50/60">
                      Female Total
                    </th>
                    <th className="py-3.5 px-4 text-right text-indigo-700 bg-indigo-50/60">
                      Grand Total
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                  {zionBreakdown.map((row) => (
                    <tr key={row.zionId} className="hover:bg-slate-50/80">
                      <td className="py-3 px-4 font-bold text-slate-900">{row.zionName}</td>
                      <td className="py-3 px-3 text-right text-slate-500 tabular-nums">
                        {row.entryCount}
                      </td>
                      {ageGroups.map((ag) => (
                        <td
                          key={ag.id}
                          className="py-3 px-3 text-right text-slate-700 tabular-nums"
                        >
                          {row.counts[ag.id]}
                        </td>
                      ))}
                      <td className="py-3 px-3 text-right font-bold text-sky-800 bg-sky-50/40 tabular-nums">
                        {row.maleTotal}
                      </td>
                      <td className="py-3 px-3 text-right font-bold text-rose-800 bg-rose-50/40 tabular-nums">
                        {row.femaleTotal}
                      </td>
                      <td className="py-3 px-4 text-right font-extrabold text-indigo-700 bg-indigo-50/40 tabular-nums">
                        {row.grandTotal}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Entry Add / Edit Modal */}
      {entryModal && (
        <SurveyEntryModal
          mode={entryModal.mode}
          categoryName={category.name}
          initialEntry={entryModal.entry}
          zions={zions}
          setZions={setZions}
          ageGroups={ageGroups}
          setAgeGroups={setAgeGroups}
          getEntryGenderStats={getEntryGenderStats}
          onClose={() => setEntryModal(null)}
          onSave={(data) => {
            onSaveEntry(data, entryModal.entry?.id || null);
            setEntryModal(null);
          }}
          showToast={showToast}
        />
      )}

      {/* Custom Filter Rule Add / Edit Modal */}
      {filterRuleModal && (
        <CustomFilterRuleModal
          mode={filterRuleModal.mode}
          initialRule={filterRuleModal.rule}
          zions={zions}
          ageGroups={ageGroups}
          onClose={() => setFilterRuleModal(null)}
          onSave={(ruleData) => {
            if (filterRuleModal.mode === 'add') {
              setCustomFilters((prev) => [
                ...prev,
                { id: `rule-${Date.now()}`, enabled: true, ...ruleData },
              ]);
              showToast('Custom filter rule added');
            } else if (filterRuleModal.rule) {
              setCustomFilters((prev) =>
                prev.map((r) =>
                  r.id === filterRuleModal.rule.id ? { ...r, ...ruleData } : r
                )
              );
              showToast('Custom filter rule updated');
            }
            setFilterRuleModal(null);
          }}
        />
      )}
    </div>
  );
}

// ============================================================================
// 2B. CUSTOM FILTER & SEARCH RULE MODAL (ADD / EDIT)
// ============================================================================
function CustomFilterRuleModal({ mode, initialRule, zions, ageGroups, onClose, onSave }) {
  const [field, setField] = useState(initialRule?.field || 'maleTotal');
  const [operator, setOperator] = useState(initialRule?.operator || '>=');
  const [value, setValue] = useState(
    initialRule?.value !== undefined ? String(initialRule.value) : '10'
  );

  const handleFieldChange = (newField) => {
    setField(newField);
    if (newField === 'zion') {
      setOperator('equals');
      setValue(zions[0]?.id || '');
    } else if (newField === 'notes') {
      setOperator('contains');
      setValue('');
    } else {
      setOperator('>=');
      setValue('10');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (String(value).trim() === '') return;
    onSave({ field, operator, value });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {mode === 'add' ? 'Add Custom Filter / Search Rule' : 'Edit Filter Rule'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Target Field
            </label>
            <select
              value={field}
              onChange={(e) => handleFieldChange(e.target.value)}
              className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
            >
              <optgroup label="Gender & Grand Totals">
                <option value="maleTotal">Male Total</option>
                <option value="femaleTotal">Female Total</option>
                <option value="grandTotal">Grand Total</option>
              </optgroup>
              <optgroup label="Location & Remarks">
                <option value="zion">Zion Location</option>
                <option value="notes">Search / Remarks</option>
              </optgroup>
              <optgroup label="Specific Age Groups">
                {ageGroups.map((ag) => (
                  <option key={ag.id} value={ag.id}>
                    {ag.label}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Condition
            </label>
            {field === 'zion' ? (
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
              >
                <option value="equals">Is</option>
                <option value="not_equals">Is Not</option>
              </select>
            ) : field === 'notes' ? (
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
              >
                <option value="contains">Contains</option>
                <option value="not_contains">Does Not Contain</option>
              </select>
            ) : (
              <select
                value={operator}
                onChange={(e) => setOperator(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
              >
                <option value=">=">Greater than or equal (&gt;=)</option>
                <option value="<=">Less than or equal (&lt;=)</option>
                <option value=">">Greater than (&gt;)</option>
                <option value="<">Less than (&lt;)</option>
                <option value="==">Equals (==)</option>
              </select>
            )}
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Value
            </label>
            {field === 'zion' ? (
              <select
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="w-full px-3 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900"
              >
                {zions.map((z) => (
                  <option key={z.id} value={z.id}>
                    {z.name}
                  </option>
                ))}
              </select>
            ) : field === 'notes' ? (
              <input
                type="text"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                placeholder="Enter keyword..."
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900"
              />
            ) : (
              <input
                type="number"
                min="0"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-900"
              />
            )}
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
            >
              {mode === 'add' ? 'Add Filter' : 'Save Filter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 2C. PUBLIC SHAREABLE SURVEY PARTICIPATION PAGE (#/survey/<categoryId>)
// ============================================================================
function PublicSurveyParticipationView({
  category,
  zions,
  setZions,
  ageGroups,
  getEntryGenderStats,
  shareUrl,
  onCopyShareLink,
  onSubmitSurvey,
  onGoToDashboard,
  onBackHome,
  showToast,
}) {
  const [zionId, setZionId] = useState(zions[0]?.id || '');
  const [date, setDate] = useState(getTodayISO());
  const [notes, setNotes] = useState('');
  const [counts, setCounts] = useState(() => {
    const init = {};
    ageGroups.forEach((ag) => (init[ag.id] = ''));
    return init;
  });
  const [submitted, setSubmitted] = useState(false);

  // Quick add Zion inline on public form if needed
  const [addingZion, setAddingZion] = useState(false);
  const [newZionName, setNewZionName] = useState('');

  const liveStats = useMemo(
    () => getEntryGenderStats({ counts }),
    [counts, getEntryGenderStats]
  );

  const handleQuickAddZion = () => {
    const trimmed = newZionName.trim();
    if (!trimmed) return;
    const newZ = { id: `zion-${Date.now()}`, name: trimmed };
    setZions((prev) => [...prev, newZ]);
    setZionId(newZ.id);
    setNewZionName('');
    setAddingZion(false);
    showToast(`Zion "${trimmed}" added`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zionId) return;
    const sanitizedCounts = {};
    ageGroups.forEach((ag) => {
      sanitizedCounts[ag.id] = Math.max(0, parseInt(counts[ag.id], 10) || 0);
    });
    onSubmitSurvey({
      zionId,
      date,
      notes: notes.trim(),
      counts: sanitizedCounts,
    });
    setSubmitted(true);
  };

  const handleResetForAnother = () => {
    const init = {};
    ageGroups.forEach((ag) => (init[ag.id] = ''));
    setCounts(init);
    setNotes('');
    setSubmitted(false);
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Public Form Header Banner */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
            <UserCheck className="w-3.5 h-3.5" />
            <span>Public Survey Participation Form</span>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onCopyShareLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy Link</span>
            </button>
            <button
              onClick={onGoToDashboard}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-semibold transition-colors"
            >
              <span>View Results & Totals</span>
            </button>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-extrabold text-slate-900">{category.name} Survey</h2>
          <p className="text-sm text-slate-500 mt-1">
            {category.description ||
              'Select your Zion and enter participant counts below to submit your attendance.'}
          </p>
        </div>

        <div className="text-[11px] text-slate-400 break-all bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/70">
          Direct Link: <span className="text-indigo-600 font-medium">{shareUrl}</span>
        </div>
      </div>

      {submitted ? (
        <div className="bg-white p-8 rounded-2xl border border-emerald-200 shadow-xs text-center space-y-4">
          <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
            <CheckCircle2 className="w-8 h-8" />
          </div>
          <h3 className="text-xl font-bold text-slate-900">
            Thank You! Response Recorded
          </h3>
          <p className="text-sm text-slate-500 max-w-md mx-auto">
            Your attendance for <strong>{category.name}</strong> has been saved successfully.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <button
              onClick={handleResetForAnother}
              className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
            >
              Submit Another Response
            </button>
            <button
              onClick={onGoToDashboard}
              className="px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-sm font-semibold"
            >
              Open {category.name} Dashboard
            </button>
          </div>
        </div>
      ) : (
        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs space-y-5"
        >
          {/* Zion Selection */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700">
                Select Zion *
              </label>
              <button
                type="button"
                onClick={() => setAddingZion((v) => !v)}
                className="text-xs font-semibold text-indigo-600 hover:text-indigo-800 inline-flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Zion</span>
              </button>
            </div>

            <select
              value={zionId}
              onChange={(e) => setZionId(e.target.value)}
              required
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:border-indigo-500"
            >
              {zions.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>

            {addingZion && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={newZionName}
                  onChange={(e) => setNewZionName(e.target.value)}
                  placeholder="New Zion name..."
                  className="flex-1 px-3 py-2 bg-slate-50 border border-slate-300 rounded-xl text-sm"
                />
                <button
                  type="button"
                  onClick={handleQuickAddZion}
                  className="px-3.5 py-2 rounded-xl bg-indigo-600 text-white text-xs font-semibold"
                >
                  Add
                </button>
              </div>
            )}
          </div>

          {/* Date & Remarks */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Your Name / Remarks (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Coordinator name or session"
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800"
              />
            </div>
          </div>

          {/* Demographic Inputs */}
          <div className="space-y-2.5">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
              Participant Counts
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {ageGroups.map((ag) => (
                <div
                  key={ag.id}
                  className="p-3 rounded-xl bg-slate-50 border border-slate-200/80"
                >
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {ag.label}
                  </label>
                  <input
                    type="number"
                    min="0"
                    inputMode="numeric"
                    placeholder="0"
                    value={counts[ag.id] ?? ''}
                    onChange={(e) =>
                      setCounts((prev) => ({ ...prev, [ag.id]: e.target.value }))
                    }
                    className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-base font-bold text-slate-900 tabular-nums"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Live Summary & Submit */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="px-2.5 py-1.5 rounded-lg bg-sky-50 text-sky-800 font-bold">
                Male: {liveStats.maleTotal}
              </span>
              <span className="px-2.5 py-1.5 rounded-lg bg-rose-50 text-rose-800 font-bold">
                Female: {liveStats.femaleTotal}
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-800 font-extrabold">
                Total: {liveStats.grandTotal}
              </span>
            </div>

            <div className="flex items-center justify-end gap-2">
              <button
                type="button"
                onClick={onBackHome}
                className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm"
              >
                Submit Survey
              </button>
            </div>
          </div>
        </form>
      )}
    </div>
  );
}

// ============================================================================
// 3. SURVEY ENTRY FORM MODAL (WITH INLINE ZION & AGE GROUP CONTROLS)
// ============================================================================
function SurveyEntryModal({
  mode,
  categoryName,
  initialEntry,
  zions,
  setZions,
  ageGroups,
  setAgeGroups,
  getEntryGenderStats,
  onClose,
  onSave,
  showToast,
}) {
  const [date, setDate] = useState(initialEntry?.date || getTodayISO());
  const [zionId, setZionId] = useState(initialEntry?.zionId || (zions[0]?.id || ''));
  const [notes, setNotes] = useState(initialEntry?.notes || '');
  const [counts, setCounts] = useState(() => {
    const init = {};
    ageGroups.forEach((ag) => {
      init[ag.id] = initialEntry?.counts?.[ag.id] ?? '';
    });
    return init;
  });

  // Inline Zion Quick-Add / Quick-Edit States
  const [zionAction, setZionAction] = useState(null);
  const [zionInputName, setZionInputName] = useState('');

  // Inline Age Group Quick-Add / Quick-Edit States
  const [addingAgeGroup, setAddingAgeGroup] = useState(false);
  const [newAgeGroupLabel, setNewAgeGroupLabel] = useState('');
  const [newAgeGroupGender, setNewAgeGroupGender] = useState('male');
  const [editingAgeGroupId, setEditingAgeGroupId] = useState(null);
  const [editingAgeGroupLabel, setEditingAgeGroupLabel] = useState('');

  const [formError, setFormError] = useState('');

  // Live Entry Gender & Grand Totals
  const liveStats = useMemo(
    () => getEntryGenderStats({ counts }),
    [counts, getEntryGenderStats]
  );

  // --- Inline Zion Handlers ---
  const handleConfirmZionAction = () => {
    const trimmed = zionInputName.trim();
    if (!trimmed) return;

    if (zionAction === 'add') {
      const newZion = { id: `zion-${Date.now()}`, name: trimmed };
      setZions((prev) => [...prev, newZion]);
      setZionId(newZion.id);
      showToast(`Zion "${trimmed}" added`);
    } else if (zionAction === 'edit' && zionId) {
      setZions((prev) =>
        prev.map((z) => (z.id === zionId ? { ...z, name: trimmed } : z))
      );
      showToast(`Zion renamed to "${trimmed}"`);
    }
    setZionAction(null);
    setZionInputName('');
  };

  // --- Inline Age Group Handlers ---
  const handleAddAgeGroup = () => {
    const trimmed = newAgeGroupLabel.trim();
    if (!trimmed) return;
    const newAg = { id: `ag-${Date.now()}`, label: trimmed, gender: newAgeGroupGender };
    setAgeGroups((prev) => [...prev, newAg]);
    setCounts((prev) => ({ ...prev, [newAg.id]: '' }));
    setNewAgeGroupLabel('');
    setAddingAgeGroup(false);
    showToast(`Age group "${trimmed}" added`);
  };

  const handleSaveAgeGroupEdit = (id) => {
    const trimmed = editingAgeGroupLabel.trim();
    if (!trimmed) return;
    setAgeGroups((prev) =>
      prev.map((ag) => (ag.id === id ? { ...ag, label: trimmed } : ag))
    );
    setEditingAgeGroupId(null);
    setEditingAgeGroupLabel('');
    showToast(`Age group renamed to "${trimmed}"`);
  };

  const handleRemoveAgeGroup = (id, label) => {
    if (ageGroups.length <= 1) {
      setFormError('At least one age group is required.');
      return;
    }
    setAgeGroups((prev) => prev.filter((ag) => ag.id !== id));
    showToast(`Removed "${label}"`, 'info');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!zionId) {
      setFormError('Please select or add a Zion first.');
      return;
    }
    if (!date) {
      setFormError('Please choose a valid date.');
      return;
    }

    const sanitizedCounts = {};
    ageGroups.forEach((ag) => {
      sanitizedCounts[ag.id] = Math.max(0, parseInt(counts[ag.id], 10) || 0);
    });

    onSave({
      date,
      zionId,
      notes: notes.trim(),
      counts: sanitizedCounts,
    });
  };

  const selectedZionObj = zions.find((z) => z.id === zionId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-2xl overflow-hidden my-auto animate-fade-in">
        {/* Modal Header */}
        <div className="px-5 sm:px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600">
              {categoryName}
            </span>
            <h3 className="text-lg font-bold text-slate-900">
              {mode === 'add' ? 'New Survey Entry' : 'Edit Survey Entry'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-6 space-y-5 max-h-[82vh] overflow-y-auto">
          {formError && (
            <div className="flex items-center gap-2 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{formError}</span>
            </div>
          )}

          {/* Step 1: Zion Selection with Inline Add & Edit */}
          <div className="p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 space-y-3">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label className="text-xs font-bold uppercase tracking-wider text-indigo-900 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-indigo-600" />
                <span>1. Select Zion Location</span>
              </label>

              {/* Inline Add / Edit Zion Buttons */}
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setZionAction('add');
                    setZionInputName('');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700 transition-colors"
                >
                  <Plus className="w-3 h-3" />
                  <span>Add Zion</span>
                </button>
                {selectedZionObj && (
                  <button
                    type="button"
                    onClick={() => {
                      setZionAction('edit');
                      setZionInputName(selectedZionObj.name);
                    }}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-white border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-colors"
                  >
                    <Edit2 className="w-3 h-3 text-indigo-600" />
                    <span>Edit</span>
                  </button>
                )}
              </div>
            </div>

            {/* Zion Select Dropdown */}
            <select
              value={zionId}
              onChange={(e) => {
                setZionId(e.target.value);
                setFormError('');
              }}
              className="w-full px-3.5 py-2.5 bg-white border border-indigo-200 rounded-xl text-sm font-semibold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500"
            >
              <option value="" disabled>
                -- Choose Zion --
              </option>
              {zions.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name}
                </option>
              ))}
            </select>

            {/* Inline Input Box when Adding or Editing a Zion */}
            {zionAction && (
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="text"
                  value={zionInputName}
                  onChange={(e) => setZionInputName(e.target.value)}
                  placeholder={zionAction === 'add' ? 'Enter new Zion name...' : 'Rename selected Zion...'}
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleConfirmZionAction();
                    }
                  }}
                  className="flex-1 px-3 py-2 bg-white border border-indigo-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                />
                <button
                  type="button"
                  onClick={handleConfirmZionAction}
                  className="px-3 py-2 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold inline-flex items-center gap-1"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Save</span>
                </button>
                <button
                  type="button"
                  onClick={() => setZionAction(null)}
                  className="px-2.5 py-2 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-semibold"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          {/* Step 2: Date & Session Notes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Survey Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Session / Remarks (Optional)
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g., Sunday Service, Youth Class..."
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
              />
            </div>
          </div>

          {/* Step 3: Participants by Age Group */}
          {zionId && (
            <div className="space-y-3 pt-1">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 text-indigo-600" />
                  <span>
                    2. Participants for{' '}
                    <span className="text-indigo-600 underline decoration-indigo-200">
                      {selectedZionObj?.name}
                    </span>
                  </span>
                </label>

                <button
                  type="button"
                  onClick={() => {
                    setAddingAgeGroup(true);
                    setNewAgeGroupLabel('');
                  }}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 text-xs font-semibold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Age Group</span>
                </button>
              </div>

              {/* Quick-Add Age Group Inline Bar with Gender Tag */}
              {addingAgeGroup && (
                <div className="flex flex-wrap items-center gap-2 p-2.5 rounded-xl bg-slate-50 border border-slate-200">
                  <input
                    type="text"
                    value={newAgeGroupLabel}
                    onChange={(e) => {
                      const val = e.target.value;
                      setNewAgeGroupLabel(val);
                      setNewAgeGroupGender(inferGenderFromLabel(val));
                    }}
                    placeholder="e.g., Male Seniors, Female Kids..."
                    autoFocus
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddAgeGroup();
                      }
                    }}
                    className="flex-1 min-w-[160px] px-3 py-1.5 bg-white border border-slate-300 rounded-lg text-sm focus:outline-none focus:border-indigo-500"
                  />
                  <select
                    value={newAgeGroupGender}
                    onChange={(e) => setNewAgeGroupGender(e.target.value)}
                    className="px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg text-xs font-semibold text-slate-700"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                  <button
                    type="button"
                    onClick={handleAddAgeGroup}
                    className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-semibold hover:bg-indigo-700"
                  >
                    Add
                  </button>
                  <button
                    type="button"
                    onClick={() => setAddingAgeGroup(false)}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-200 text-slate-700 text-xs font-semibold"
                  >
                    Cancel
                  </button>
                </div>
              )}

              {/* Numeric Inputs Grid for Each Age Group */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {ageGroups.map((ag) => (
                  <div
                    key={ag.id}
                    className="p-3 rounded-xl bg-slate-50 border border-slate-200/90 hover:border-indigo-200 transition-colors"
                  >
                    {editingAgeGroupId === ag.id ? (
                      <div className="flex items-center gap-1.5 mb-2">
                        <input
                          type="text"
                          value={editingAgeGroupLabel}
                          onChange={(e) => setEditingAgeGroupLabel(e.target.value)}
                          autoFocus
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleSaveAgeGroupEdit(ag.id);
                            }
                          }}
                          className="flex-1 px-2 py-1 text-xs bg-white border border-indigo-300 rounded-md focus:outline-none"
                        />
                        <button
                          type="button"
                          onClick={() => handleSaveAgeGroupEdit(ag.id)}
                          className="p-1 rounded bg-emerald-600 text-white"
                          title="Save name"
                        >
                          <Check className="w-3 h-3" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAgeGroupId(null)}
                          className="p-1 rounded bg-slate-200 text-slate-600"
                          title="Cancel"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between gap-2 mb-1.5">
                        <label
                          htmlFor={`input-${ag.id}`}
                          className="text-xs font-semibold text-slate-700 truncate"
                        >
                          {ag.label}
                        </label>
                        <div className="flex items-center gap-0.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAgeGroupId(ag.id);
                              setEditingAgeGroupLabel(ag.label);
                            }}
                            title="Rename Age Group"
                            className="p-1 rounded text-slate-400 hover:text-indigo-600 hover:bg-white transition-colors"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            onClick={() => handleRemoveAgeGroup(ag.id, ag.label)}
                            title="Remove Age Group"
                            className="p-1 rounded text-slate-400 hover:text-rose-600 hover:bg-white transition-colors"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    )}

                    <input
                      id={`input-${ag.id}`}
                      type="number"
                      min="0"
                      inputMode="numeric"
                      placeholder="0"
                      value={counts[ag.id] ?? ''}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCounts((prev) => ({ ...prev, [ag.id]: val }));
                      }}
                      className="w-full px-3 py-2 bg-white border border-slate-200 rounded-lg text-base font-bold text-slate-900 tabular-nums focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Live Male Total, Female Total & Entry Grand Total Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-2">
              <div className="px-3 py-1.5 rounded-xl bg-sky-50 border border-sky-100 text-xs">
                <span className="text-sky-700 font-semibold">Male: </span>
                <span className="font-extrabold text-sky-900 tabular-nums">{liveStats.maleTotal}</span>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-100 text-xs">
                <span className="text-rose-700 font-semibold">Female: </span>
                <span className="font-extrabold text-rose-900 tabular-nums">{liveStats.femaleTotal}</span>
              </div>
              <div className="px-3.5 py-1.5 rounded-xl bg-indigo-50 border border-indigo-100 text-xs">
                <span className="text-indigo-800 font-semibold">Total: </span>
                <span className="text-base font-extrabold text-indigo-700 tabular-nums">
                  {liveStats.grandTotal}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold shadow-sm transition-all cursor-pointer"
              >
                {mode === 'add' ? 'Save Survey Entry' : 'Update Entry'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 4. MANAGE FIELDS MODAL (CENTRALIZED ZIONS & AGE GROUPS EDITOR WITH GENDER)
// ============================================================================
function ManageFieldsModal({
  zions,
  setZions,
  ageGroups,
  setAgeGroups,
  onRequestDelete,
  onClose,
  showToast,
}) {
  const [newZion, setNewZion] = useState('');
  const [editingZionId, setEditingZionId] = useState(null);
  const [editingZionName, setEditingZionName] = useState('');

  const [newAgeGroup, setNewAgeGroup] = useState('');
  const [newAgeGroupGender, setNewAgeGroupGender] = useState('male');
  const [editingAgId, setEditingAgId] = useState(null);
  const [editingAgLabel, setEditingAgLabel] = useState('');
  const [editingAgGender, setEditingAgGender] = useState('male');

  // Zion Actions
  const handleAddZion = (e) => {
    e.preventDefault();
    const trimmed = newZion.trim();
    if (!trimmed) return;
    setZions((prev) => [...prev, { id: `zion-${Date.now()}`, name: trimmed }]);
    setNewZion('');
    showToast(`Zion "${trimmed}" added`);
  };

  const handleSaveZion = (id) => {
    const trimmed = editingZionName.trim();
    if (!trimmed) return;
    setZions((prev) => prev.map((z) => (z.id === id ? { ...z, name: trimmed } : z)));
    setEditingZionId(null);
    showToast('Zion updated');
  };

  // Age Group Actions
  const handleAddAg = (e) => {
    e.preventDefault();
    const trimmed = newAgeGroup.trim();
    if (!trimmed) return;
    setAgeGroups((prev) => [
      ...prev,
      { id: `ag-${Date.now()}`, label: trimmed, gender: newAgeGroupGender },
    ]);
    setNewAgeGroup('');
    showToast(`Age group "${trimmed}" added`);
  };

  const handleSaveAg = (id) => {
    const trimmed = editingAgLabel.trim();
    if (!trimmed) return;
    setAgeGroups((prev) =>
      prev.map((ag) =>
        ag.id === id ? { ...ag, label: trimmed, gender: editingAgGender } : ag
      )
    );
    setEditingAgId(null);
    showToast('Age group updated');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/50 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-3xl overflow-hidden my-auto">
        <div className="px-6 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900">Manage Zions & Age Groups</h3>
            <p className="text-xs text-slate-500">
              Assign Male or Female tags to age groups so Male Total & Female Total stay accurate everywhere.
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200/60"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6 max-h-[75vh] overflow-y-auto">
          {/* Column 1: Zions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-indigo-600 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" />
              <span>Zions ({zions.length})</span>
            </h4>

            <form onSubmit={handleAddZion} className="flex gap-2">
              <input
                type="text"
                value={newZion}
                onChange={(e) => setNewZion(e.target.value)}
                placeholder="Add new Zion..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-indigo-500"
              />
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold"
              >
                Add
              </button>
            </form>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {zions.map((z) => (
                <div
                  key={z.id}
                  className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70"
                >
                  {editingZionId === z.id ? (
                    <div className="flex items-center gap-1.5 flex-1">
                      <input
                        type="text"
                        value={editingZionName}
                        onChange={(e) => setEditingZionName(e.target.value)}
                        autoFocus
                        className="flex-1 px-2 py-1 text-sm bg-white border border-indigo-300 rounded-lg"
                      />
                      <button
                        type="button"
                        onClick={() => handleSaveZion(z.id)}
                        className="p-1.5 rounded-lg bg-emerald-600 text-white"
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setEditingZionId(null)}
                        className="p-1.5 rounded-lg bg-slate-200 text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <>
                      <span className="text-sm font-medium text-slate-800">{z.name}</span>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingZionId(z.id);
                            setEditingZionName(z.name);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            onRequestDelete({ type: 'zion', id: z.id, label: z.name })
                          }
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Column 2: Age Groups */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5" />
              <span>Age / Demographic Groups ({ageGroups.length})</span>
            </h4>

            <form onSubmit={handleAddAg} className="flex gap-2">
              <input
                type="text"
                value={newAgeGroup}
                onChange={(e) => {
                  const val = e.target.value;
                  setNewAgeGroup(val);
                  setNewAgeGroupGender(inferGenderFromLabel(val));
                }}
                placeholder="Add new Age Group..."
                className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:border-emerald-500"
              />
              <select
                value={newAgeGroupGender}
                onChange={(e) => setNewAgeGroupGender(e.target.value)}
                className="px-2 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700"
              >
                <option value="male">Male</option>
                <option value="female">Female</option>
                <option value="other">Other</option>
              </select>
              <button
                type="submit"
                className="px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold"
              >
                Add
              </button>
            </form>

            <div className="space-y-1.5 max-h-64 overflow-y-auto pr-1">
              {ageGroups.map((ag) => {
                const g = ag.gender || inferGenderFromLabel(ag.label);
                return (
                  <div
                    key={ag.id}
                    className="flex items-center justify-between gap-2 px-3 py-2 rounded-xl bg-slate-50 border border-slate-200/70"
                  >
                    {editingAgId === ag.id ? (
                      <div className="flex items-center gap-1.5 flex-1">
                        <input
                          type="text"
                          value={editingAgLabel}
                          onChange={(e) => setEditingAgLabel(e.target.value)}
                          autoFocus
                          className="flex-1 px-2 py-1 text-sm bg-white border border-emerald-300 rounded-lg"
                        />
                        <select
                          value={editingAgGender}
                          onChange={(e) => setEditingAgGender(e.target.value)}
                          className="px-1.5 py-1 text-xs bg-white border border-emerald-300 rounded-lg"
                        >
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                        <button
                          type="button"
                          onClick={() => handleSaveAg(ag.id)}
                          className="p-1.5 rounded-lg bg-emerald-600 text-white"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => setEditingAgId(null)}
                          className="p-1.5 rounded-lg bg-slate-200 text-slate-600"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-2 min-w-0">
                          <span className="text-sm font-medium text-slate-800 truncate">{ag.label}</span>
                          <span
                            className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded shrink-0 ${
                              g === 'male'
                                ? 'bg-sky-100 text-sky-700'
                                : g === 'female'
                                ? 'bg-rose-100 text-rose-700'
                                : 'bg-slate-200 text-slate-600'
                            }`}
                          >
                            {g}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setEditingAgId(ag.id);
                              setEditingAgLabel(ag.label);
                              setEditingAgGender(g);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-white"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          {ageGroups.length > 1 && (
                            <button
                              type="button"
                              onClick={() =>
                                onRequestDelete({ type: 'ageGroup', id: ag.id, label: ag.label })
                              }
                              className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-white"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="px-6 py-3.5 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}

// ============================================================================
// 5. SURVEY ADD / EDIT MODAL
// ============================================================================
function CategoryModal({ mode, initialData, onClose, onSave }) {
  const [name, setName] = useState(initialData?.name || '');
  const [description, setDescription] = useState(initialData?.description || '');
  const [color, setColor] = useState(initialData?.color || 'indigo');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    onSave({ name, description, color });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="px-5 py-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
          <h3 className="text-base font-bold text-slate-900">
            {mode === 'add' ? 'Add Survey' : 'Edit Survey'}
          </h3>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Survey Name *
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g., Gathering, Education, Online Meeting..."
              required
              autoFocus
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-medium text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">
              Description (Optional)
            </label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Brief summary of this survey..."
              className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 focus:outline-none focus:border-indigo-500"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-2">
              Folder Color
            </label>
            <div className="flex flex-wrap gap-2">
              {FOLDER_COLORS.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setColor(c.id)}
                  className={`w-8 h-8 rounded-xl ${c.tab} flex items-center justify-center text-white transition-transform ${
                    color === c.id ? 'ring-2 ring-offset-2 ring-slate-800 scale-105' : 'opacity-80 hover:opacity-100'
                  }`}
                >
                  {color === c.id && <Check className="w-4 h-4" />}
                </button>
              ))}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold"
            >
              {mode === 'add' ? 'Add Survey' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ============================================================================
// 6. CUSTOM CONFIRMATION DIALOG (NO WINDOW.CONFIRM)
// ============================================================================
function ConfirmModal({ title, message, onCancel, onConfirm }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-sm p-5 space-y-4">
        <div className="flex items-start gap-3">
          <div className="w-10 h-10 rounded-full bg-rose-100 text-rose-600 flex items-center justify-center shrink-0">
            <Trash2 className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">{title}</h3>
            <p className="text-xs text-slate-500 mt-1 leading-relaxed">{message}</p>
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-2">
          <button
            onClick={onCancel}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}