import fs from 'fs'
import path from 'path'

const dataDir = '.data'
const dataFile = path.join(dataDir, 'db.json')

type JsonRoot = {
  organizations: any[]
  profiles: any[]
  tags: any[]
  profile_tags: { profile_id: string; tag_id: string }[]
  experiences: any[]
  users: any[]
}

function ensureFile() {
  if (!fs.existsSync(dataDir)) fs.mkdirSync(dataDir, { recursive: true })
  if (!fs.existsSync(dataFile)) {
    const now = new Date().toISOString()
    const initial: JsonRoot = {
      organizations: [
        { id: 'org-owner', name: 'InoPeak Technologies', type: 'owner', created_at: now },
        { id: 'org-partner-a', name: 'TechPartner A', type: 'partner', created_at: now }
      ],
      tags: [
        { id: 't-mod-fi', category: 'module', key: 'SAP-FI', display: 'SAP FI', active: true, created_at: now },
        { id: 't-mod-sd', category: 'module', key: 'SAP-SD', display: 'SAP SD', active: true, created_at: now },
        { id: 't-tech-abap', category: 'tech', key: 'ABAP', display: 'ABAP', active: true, created_at: now },
        { id: 't-tech-fiori', category: 'tech', key: 'Fiori', display: 'Fiori', active: true, created_at: now },
        { id: 't-tech-rap', category: 'tech', key: 'RAP', display: 'RAP', active: true, created_at: now }
      ],
      profiles: [
        {
          id: 'p-1', organization_id: 'org-partner-a', first_name: 'Ahmet', last_name: 'Yılmaz',
          email: 'ahmet@example.com', phone: null, city: 'İstanbul', country: 'Turkey', title: 'Senior SAP ABAP Developer',
          seniority_years: 8, work_scope: 'FullCycle', summary: 'ABAP, RAP ve Fiori ile uçtan uca geliştirme deneyimi.',
          visibility_level: 'public_masked', status: 'published', created_at: now, updated_at: now,
          tags: [ { id: 't-tech-abap' }, { id: 't-tech-rap' } ]
        }
      ],
      profile_tags: [],
      experiences: [],
      users: [
        { id: 'u-owner', email: 'owner@inopeak.com', name: 'Owner User', role: 'owner', organization_id: 'org-owner', created_at: now, last_login_at: null },
        { id: 'u-pa-1', email: 'admin@partnera.com', name: 'Partner Admin', role: 'partner_admin', organization_id: 'org-partner-a', created_at: now, last_login_at: null },
        { id: 'u-pu-1', email: 'user@partnera.com', name: 'Partner User', role: 'partner_user', organization_id: 'org-partner-a', created_at: now, last_login_at: null }
      ]
    }
    fs.writeFileSync(dataFile, JSON.stringify(initial, null, 2), 'utf-8')
  }
}

export function readJson(): JsonRoot {
  ensureFile()
  const raw = fs.readFileSync(dataFile, 'utf-8')
  return JSON.parse(raw)
}

export function writeJson(data: JsonRoot) {
  ensureFile()
  fs.writeFileSync(dataFile, JSON.stringify(data, null, 2), 'utf-8')
}

export function generateId(): string {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) return crypto.randomUUID()
  return 'id-' + Math.random().toString(36).slice(2) + Date.now().toString(36)
}


