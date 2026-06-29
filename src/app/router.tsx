import { lazy, Suspense } from 'react'
import { createBrowserRouter, Outlet, RouterProvider } from 'react-router-dom'
import LandingPage from '../pages/public/LandingPage'
import LoginPage from '../pages/auth/LoginPage'
import EnrollTOTPPage from '../pages/auth/EnrollTOTPPage'
import VerifyTOTPPage from '../pages/auth/VerifyTOTPPage'
import SetPasswordPage from '../pages/auth/SetPasswordPage'
import AdminGuard from './AdminGuard'
import InviteHandler from './InviteHandler'

const AdminPage = lazy(() => import('../pages/admin/AdminPage'))

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
      ],
    },
  ],
  { basename: '/site_do_abrigo' },
)

export default function Router() {
  return <RouterProvider router={router} />
}
