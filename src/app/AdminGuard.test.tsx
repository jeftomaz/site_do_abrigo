import { render, screen, waitFor } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import AdminGuard from './AdminGuard'
import { useSession } from '../features/auth/hooks'
import { getAssuranceLevel, listFactors } from '../features/auth/api'

vi.mock('../features/auth/hooks', () => ({ useSession: vi.fn() }))
vi.mock('../features/auth/api', () => ({
  getAssuranceLevel: vi.fn(),
  listFactors: vi.fn(),
}))

const mockSession = { user: { id: 'u1' } } as never

function renderGuard() {
  return render(
    <MemoryRouter initialEntries={['/admin']}>
      <Routes>
        <Route
          path="/admin"
          element={
            <AdminGuard>
              <p>conteúdo admin</p>
            </AdminGuard>
          }
        />
        <Route path="/admin/login" element={<p>página login</p>} />
        <Route path="/admin/enroll" element={<p>página enroll</p>} />
        <Route path="/admin/verify" element={<p>página verify</p>} />
      </Routes>
    </MemoryRouter>,
  )
}

describe('AdminGuard', () => {
  beforeEach(() => {
    vi.mocked(getAssuranceLevel).mockResolvedValue({
      data: { currentLevel: 'aal1', nextLevel: 'aal2' },
      error: null,
    } as never)
    vi.mocked(listFactors).mockResolvedValue({
      data: { totp: [], phone: [] },
      error: null,
    } as never)
  })

  it('sem sessão redireciona para /admin/login', async () => {
    vi.mocked(useSession).mockReturnValue(null)
    renderGuard()
    await waitFor(() => {
      expect(screen.getByText('página login')).toBeInTheDocument()
    })
  })

  it('aal1 sem TOTP enrollado redireciona para /admin/enroll', async () => {
    vi.mocked(useSession).mockReturnValue(mockSession)
    vi.mocked(getAssuranceLevel).mockResolvedValue({
      data: { currentLevel: 'aal1', nextLevel: 'aal2' },
      error: null,
    } as never)
    vi.mocked(listFactors).mockResolvedValue({
      data: { totp: [], phone: [] },
      error: null,
    } as never)

    renderGuard()
    await waitFor(() => {
      expect(screen.getByText('página enroll')).toBeInTheDocument()
    })
  })

  it('aal1 com TOTP enrollado redireciona para /admin/verify', async () => {
    vi.mocked(useSession).mockReturnValue(mockSession)
    vi.mocked(getAssuranceLevel).mockResolvedValue({
      data: { currentLevel: 'aal1', nextLevel: 'aal2' },
      error: null,
    } as never)
    vi.mocked(listFactors).mockResolvedValue({
      data: { totp: [{ id: 'f1', status: 'verified' }], phone: [] },
      error: null,
    } as never)

    renderGuard()
    await waitFor(() => {
      expect(screen.getByText('página verify')).toBeInTheDocument()
    })
  })

  it('aal2 libera o conteúdo protegido', async () => {
    vi.mocked(useSession).mockReturnValue(mockSession)
    vi.mocked(getAssuranceLevel).mockResolvedValue({
      data: { currentLevel: 'aal2', nextLevel: 'aal2' },
      error: null,
    } as never)

    renderGuard()
    await waitFor(() => {
      expect(screen.getByText('conteúdo admin')).toBeInTheDocument()
    })
  })
})
