import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import LandingPage from '../pages/public/LandingPage'
import AdocaoPage from '../pages/public/AdocaoPage'
import HistoriasPage from '../pages/public/HistoriasPage'
import EventosPage from '../pages/public/EventosPage'
import LoginPage from '../pages/auth/LoginPage'
import EnrollTOTPPage from '../pages/auth/EnrollTOTPPage'
import VerifyTOTPPage from '../pages/auth/VerifyTOTPPage'
import SetPasswordPage from '../pages/auth/SetPasswordPage'
import AdminGuard from './AdminGuard'
import InviteHandler from './InviteHandler'

const AdminPage = lazy(() => import('../pages/admin/AdminPage'))
const AdminDogsPage = lazy(() => import('../pages/admin/dogs/AdminDogsPage'))
const AdminStoriesPage = lazy(() => import('../pages/admin/stories/AdminStoriesPage'))
const AdminEventsPage = lazy(() => import('../pages/admin/events/AdminEventsPage'))

function RootLayout() {
  return (
    <>
      <InviteHandler />
      <Outlet />
    </>
  )
}

const router = createBrowserRouter(
  [
    {
      element: <RootLayout />,
      children: [
        { path: '/', element: <LandingPage /> },
        { path: '/adocao', element: <AdocaoPage /> },
        { path: '/historias', element: <HistoriasPage /> },
        { path: '/eventos', element: <EventosPage /> },
        { path: '/admin/login', element: <LoginPage /> },
        { path: '/admin/enroll', element: <EnrollTOTPPage /> },
        { path: '/admin/verify', element: <VerifyTOTPPage /> },
        { path: '/admin/definir-senha', element: <SetPasswordPage /> },
        {
          path: '/admin',
          element: (
            <AdminGuard>
              <Suspense fallback={null}>
                <AdminPage />
              </Suspense>
            </AdminGuard>
          ),
        },
        {
          path: '/admin/dogs',
          element: (
            <AdminGuard>
              <Suspense fallback={null}>
                <AdminDogsPage />
              </Suspense>
            </AdminGuard>
          ),
        },
        {
          path: '/admin/stories',
          element: (
            <AdminGuard>
              <Suspense fallback={null}>
                <AdminStoriesPage />
              </Suspense>
            </AdminGuard>
          ),
        },
        {
          path: '/admin/events',
          element: (
            <AdminGuard>
              <Suspense fallback={null}>
                <AdminEventsPage />
              </Suspense>
            </AdminGuard>
          ),
        },
      ],
    },
  ],
  { basename: '/site_do_abrigo' },
)

export default function Router() {
  return <RouterProvider router={router} />
}
