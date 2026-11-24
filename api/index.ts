import type { VercelRequest, VercelResponse } from '@vercel/node'

const handlers = {
  'admin-login': () => import('../src/server/handlers/admin-login.js'),
  announcements: () => import('../src/server/handlers/announcements.js'),
  assignments: () => import('../src/server/handlers/assignments.js'),
  classes: () => import('../src/server/handlers/classes.js'),
  'dashboard-stats': () => import('../src/server/handlers/dashboard-stats.js'),
  import: () => import('../src/server/handlers/import.js'),
  internships: () => import('../src/server/handlers/internships.js'),
  'kampus-launch': () => import('../src/server/handlers/kampus-launch.js'),
  login: () => import('../src/server/handlers/login.js'),
  notifications: () => import('../src/server/handlers/notifications.js'),
  projects: () => import('../src/server/handlers/projects.js'),
  students: () => import('../src/server/handlers/students.js'),
  support: () => import('../src/server/handlers/support.js'),
} satisfies Record<string, () => Promise<{ default: (req: VercelRequest, res: VercelResponse) => unknown }>>

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const route = req.query.__handler
  if (typeof route !== 'string' || !Object.hasOwn(handlers, route)) {
    return res.status(404).json({ success: false, error: 'Unknown API endpoint' })
  }

  delete req.query.__handler
  const endpoint = await handlers[route as keyof typeof handlers]()
  return endpoint.default(req, res)
}
