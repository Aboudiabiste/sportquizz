'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import type { QuizColumn } from '@/lib/supabase'
import type { QuizTemplate } from '@/lib/quiz/generator'

interface QuizSummary { id: string; title: string; sport: string; created_at: string }

const SPORTS = ['football', 'f1', 'tennis', 'cyclisme', 'autre']
const SPORT_EMOJI: Record<string, string> = { football: '⚽', f1: '🏎️', tennis: '🎾', cyclisme: '🚴', autre: '🏆' }

type Tab = 'list' | 'manual' | 'generate'

export default function AdminPage() {
  const [tab, setTab] = useState<Tab>('list')
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([])

  async function loadQuizzes() {
    const res = await fetch('/api/quizzes')
    if (res.ok) setQuizzes(await res.json())
  }

  useEffect(() => { loadQuizzes() }, [])

  async function deleteQuiz(id: string) {
    if (!confirm('Supprimer ce quiz ?')) return
    await fetch(`/api/quizzes/${id}`, { method: 'DELETE' })
    setQuizzes(prev => prev.filter(q => q.id !== id))
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white flex flex-col">
      {/* Header */}
      <div className="relative px-5 pt-10 pb-5 overflow-hidden">
        <div className="absolute inset-0 bg-linear-to-br from-zinc-900 via-zinc-950 to-zinc-950" />
        <div className="relative z-10">
          <Link href="/" className="text-zinc-500 text-sm hover:text-zinc-300 transition-colors">← Accueil</Link>
          <h1 className="text-2xl font-black mt-1">Admin — Quiz</h1>
        </div>
      </div>

      {/* Tabs */}
      <div className="px-5 flex gap-1 border-b border-zinc-800">
        {([['list', '📚 Bibliothèque'], ['manual', '✏️ Manuel'], ['generate', '⚡ Générer']] as [Tab, string][]).map(([t, label]) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm font-medium border-b-2 transition-colors ${tab === t ? 'border-sky-500 text-white' : 'border-transparent text-zinc-500 hover:text-zinc-300'}`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="flex-1 px-5 py-5 max-w-2xl">
        {tab === 'list' && (
          <div className="space-y-3">
            {quizzes.length === 0 && (
              <div className="text-center py-16">
                <p className="text-zinc-500 mb-3">Aucun quiz dans la bibliothèque</p>
                <button onClick={() => setTab('manual')} className="text-sky-400 text-sm hover:underline">
                  Créer manuellement →
                </button>
              </div>
            )}
            {quizzes.map(q => (
              <div key={q.id} className="flex items-center gap-4 bg-zinc-900 px-5 py-4 rounded-2xl">
                <span className="text-2xl">{SPORT_EMOJI[q.sport] ?? '🏆'}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">{q.title}</p>
                  <p className="text-zinc-500 text-xs capitalize">{q.sport} · {new Date(q.created_at).toLocaleDateString('fr-FR')}</p>
                </div>
                <button onClick={() => deleteQuiz(q.id)} className="text-zinc-600 hover:text-red-400 text-sm transition-colors shrink-0">
                  🗑
                </button>
              </div>
            ))}
          </div>
        )}

        {tab === 'manual' && (
          <QuizCreator onCreated={() => { loadQuizzes(); setTab('list') }} />
        )}

        {tab === 'generate' && (
          <QuizGenerator onCreated={() => { loadQuizzes(); setTab('list') }} />
        )}
      </div>
    </div>
  )
}

// ── Manual Creator ────────────────────────────────────────────────

interface Column { key: string; label: string; is_answer: boolean; hint_order: number }

function QuizCreator({ onCreated }: { onCreated: () => void }) {
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [sport, setSport] = useState('football')
  const [columns, setColumns] = useState<Column[]>([
    { key: 'name', label: 'Joueur', is_answer: true, hint_order: 0 },
    { key: 'hint1', label: 'Indice 1', is_answer: false, hint_order: 1 },
  ])
  const [rawRows, setRawRows] = useState('')
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  function addColumn() {
    const idx = columns.length
    setColumns(prev => [...prev, { key: `col${idx}`, label: '', is_answer: false, hint_order: prev.filter(c => !c.is_answer).length }])
  }

  function updateColumn(i: number, field: keyof Column, value: string | boolean) {
    setColumns(prev => prev.map((c, j) => {
      if (j !== i) return c
      const updated = { ...c, [field]: value }
      if (field === 'label') updated.key = (value as string).toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '').slice(0, 20) || `col${i}`
      return updated
    }))
  }

  function parseRows(): Record<string, string>[] | null {
    const lines = rawRows.trim().split('\n').filter(l => l.trim())
    if (!lines.length) return null
    return lines.map(line => {
      const parts = line.split('|').map(p => p.trim())
      const row: Record<string, string> = {}
      columns.forEach((c, i) => { row[c.key] = parts[i] ?? '' })
      return row
    })
  }

  async function save() {
    const rows = parseRows()
    if (!title.trim()) { setError('Titre requis'); return }
    if (!rows) { setError('Lignes requises'); return }
    if (!columns.some(c => c.is_answer)) { setError('Au moins une colonne réponse requise'); return }
    setSaving(true); setError('')
    const res = await fetch('/api/quizzes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title, description, sport, columns, rows }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setSaving(false); return }
    onCreated()
  }

  const exampleLine = columns.map(c => c.label || c.key).join(' | ')

  return (
    <div className="space-y-5">
      <input className="w-full bg-zinc-900 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500" placeholder="Titre du quiz" value={title} onChange={e => setTitle(e.target.value)} />
      <input className="w-full bg-zinc-900 rounded-xl px-4 py-3 outline-none text-sm" placeholder="Description (optionnel)" value={description} onChange={e => setDescription(e.target.value)} />

      <div className="flex gap-2 flex-wrap">
        {SPORTS.map(s => (
          <button key={s} onClick={() => setSport(s)} className={`px-3 py-1 rounded-full text-sm transition-colors ${sport === s ? 'bg-sky-500 text-black font-bold' : 'bg-zinc-800 hover:bg-zinc-700'}`}>
            {SPORT_EMOJI[s]} {s}
          </button>
        ))}
      </div>

      <div>
        <div className="flex justify-between mb-2">
          <p className="text-sm font-medium text-zinc-400">Colonnes</p>
          <button onClick={addColumn} className="text-sky-400 text-sm">+ Ajouter</button>
        </div>
        <div className="space-y-2">
          {columns.map((col, i) => (
            <div key={i} className="flex items-center gap-2 bg-zinc-900 px-3 py-2 rounded-xl">
              <input
                className="flex-1 bg-zinc-800 rounded-lg px-3 py-1.5 text-sm outline-none focus:ring-1 ring-sky-500"
                placeholder="Nom de la colonne"
                value={col.label}
                onChange={e => updateColumn(i, 'label', e.target.value)}
              />
              <label className="flex items-center gap-1.5 text-xs cursor-pointer shrink-0">
                <input type="checkbox" checked={col.is_answer} onChange={e => updateColumn(i, 'is_answer', e.target.checked)} className="accent-sky-500" />
                <span className={col.is_answer ? 'text-sky-400' : 'text-zinc-500'}>{col.is_answer ? '🎯' : '💡'}</span>
              </label>
              {columns.length > 2 && <button onClick={() => setColumns(p => p.filter((_, j) => j !== i))} className="text-zinc-700 hover:text-red-400 transition-colors">✕</button>}
            </div>
          ))}
        </div>
      </div>

      <div>
        <p className="text-sm font-medium text-zinc-400 mb-1">Données <span className="text-zinc-600 font-normal">— séparées par |</span></p>
        <p className="text-zinc-600 text-xs font-mono mb-2">{exampleLine}</p>
        <textarea
          className="w-full bg-zinc-900 rounded-xl px-4 py-3 font-mono text-sm h-40 resize-none outline-none focus:ring-2 ring-sky-500"
          placeholder={`Cristiano Ronaldo | Portugais | 140\nLionel Messi | Argentin | 129`}
          value={rawRows}
          onChange={e => setRawRows(e.target.value)}
        />
        <p className="text-zinc-600 text-xs mt-1">{rawRows.trim().split('\n').filter(l => l.trim()).length} ligne(s)</p>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      <button onClick={save} disabled={saving} className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black font-bold py-4 rounded-2xl transition-colors">
        {saving ? 'Sauvegarde…' : 'Créer le quiz'}
      </button>
    </div>
  )
}

// ── Auto Generator ────────────────────────────────────────────────

function QuizGenerator({ onCreated }: { onCreated: () => void }) {
  const [templates, setTemplates] = useState<QuizTemplate[]>([])
  const [selectedTemplate, setSelectedTemplate] = useState<QuizTemplate | null>(null)
  const [paramValues, setParamValues] = useState<Record<string, string>>({})
  const [preview, setPreview] = useState<{ title: string; rows: Record<string, string>[]; columns: QuizColumn[] } | null>(null)
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    fetch('/api/generate').then(r => r.json()).then(data => {
      if (Array.isArray(data)) setTemplates(data)
    })
  }, [])

  function selectTemplate(t: QuizTemplate) {
    setSelectedTemplate(t)
    setPreview(null)
    setError('')
    const defaults: Record<string, string> = {}
    t.params?.forEach(p => {
      if (p.type === 'number') {
        if (p.key === 'season') defaults[p.key] = String(new Date().getFullYear() - 1)
        else if (p.key === 'from') defaults[p.key] = '2000'
        else if (p.key === 'to') defaults[p.key] = String(new Date().getFullYear() - 1)
        else if (p.key === 'limit') defaults[p.key] = '15'
      } else if (p.options?.length) {
        defaults[p.key] = p.options[0].value
      }
    })
    setParamValues(defaults)
  }

  async function generate() {
    if (!selectedTemplate) return
    setLoading(true); setError(''); setPreview(null)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: selectedTemplate.id, params: paramValues, save: false }),
    })
    const data = await res.json()
    if (!res.ok) { setError(data.error); setLoading(false); return }
    setPreview(data.quiz)
    setLoading(false)
  }

  async function saveQuiz() {
    if (!selectedTemplate) return
    setSaving(true)
    const res = await fetch('/api/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ template_id: selectedTemplate.id, params: paramValues, save: true }),
    })
    if (res.ok) onCreated()
    else { const d = await res.json(); setError(d.error); setSaving(false) }
  }

  const SPORT_TABS = [...new Set(templates.map(t => t.sport))]

  return (
    <div className="space-y-5">
      {!process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('supabase') ? null : (
        <div className="bg-amber-900/30 border border-amber-800 text-amber-300 text-xs px-4 py-3 rounded-xl">
          ⚠️ Nécessite une clé <strong>API_FOOTBALL_KEY</strong> dans .env.local pour le football. F1 fonctionne sans clé.
        </div>
      )}

      {/* Template list */}
      {!selectedTemplate ? (
        <div className="space-y-2">
          <p className="text-zinc-400 text-sm font-medium">Choisis un template</p>
          {SPORT_TABS.map(sport => (
            <div key={sport}>
              <p className="text-zinc-600 text-xs uppercase tracking-wider mb-2 mt-3">{SPORT_EMOJI[sport]} {sport}</p>
              {templates.filter(t => t.sport === sport).map(t => (
                <button
                  key={t.id}
                  onClick={() => selectTemplate(t)}
                  className="w-full text-left bg-zinc-900 hover:bg-zinc-800 px-4 py-3 rounded-xl transition-colors mb-2"
                >
                  <p className="font-medium text-sm">{t.label}</p>
                  <p className="text-zinc-500 text-xs mt-0.5">{t.description}</p>
                </button>
              ))}
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-4">
          <button onClick={() => { setSelectedTemplate(null); setPreview(null) }} className="text-zinc-500 text-sm hover:text-zinc-300">
            ← Changer de template
          </button>
          <div className="bg-zinc-900 px-4 py-3 rounded-xl">
            <p className="font-bold">{selectedTemplate.label}</p>
            <p className="text-zinc-500 text-xs">{selectedTemplate.description}</p>
          </div>

          {/* Params */}
          {selectedTemplate.params?.map(p => (
            <div key={p.key}>
              <label className="text-zinc-400 text-sm block mb-1">{p.label}</label>
              {p.type === 'select' ? (
                <select
                  className="w-full bg-zinc-900 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500"
                  value={paramValues[p.key] ?? ''}
                  onChange={e => setParamValues(prev => ({ ...prev, [p.key]: e.target.value }))}
                >
                  {p.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              ) : (
                <input
                  type="number"
                  className="w-full bg-zinc-900 rounded-xl px-4 py-3 outline-none focus:ring-2 ring-sky-500"
                  value={paramValues[p.key] ?? ''}
                  onChange={e => setParamValues(prev => ({ ...prev, [p.key]: e.target.value }))}
                />
              )}
            </div>
          ))}

          {error && <p className="text-red-400 text-sm">{error}</p>}

          <button onClick={generate} disabled={loading} className="w-full bg-zinc-700 hover:bg-zinc-600 disabled:opacity-40 font-bold py-3 rounded-xl transition-colors">
            {loading ? 'Génération…' : '👁 Prévisualiser'}
          </button>

          {/* Preview */}
          {preview && (
            <div className="space-y-3">
              <div className="bg-zinc-900 px-4 py-3 rounded-xl">
                <p className="font-bold">{preview.title}</p>
                <p className="text-zinc-500 text-xs">{preview.rows.length} lignes · {preview.columns.length} colonnes</p>
              </div>
              <div className="overflow-x-auto rounded-xl border border-zinc-800 max-h-48">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="bg-zinc-900">
                      {preview.columns.map(c => (
                        <th key={c.key} className="px-3 py-2 text-left text-zinc-400 whitespace-nowrap">
                          {c.label}{c.is_answer && ' 🎯'}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {preview.rows.slice(0, 5).map((row, i) => (
                      <tr key={i} className="border-t border-zinc-800">
                        {preview.columns.map(c => <td key={c.key} className="px-3 py-2 text-zinc-300 whitespace-nowrap">{row[c.key]}</td>)}
                      </tr>
                    ))}
                    {preview.rows.length > 5 && (
                      <tr className="border-t border-zinc-800">
                        <td colSpan={preview.columns.length} className="px-3 py-2 text-zinc-600 text-center">
                          + {preview.rows.length - 5} lignes…
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
              <button onClick={saveQuiz} disabled={saving} className="w-full bg-sky-500 hover:bg-sky-400 disabled:opacity-40 text-black font-bold py-4 rounded-2xl transition-colors">
                {saving ? 'Sauvegarde…' : '✓ Sauvegarder ce quiz'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
