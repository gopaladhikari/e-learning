import { createRootRoute, Outlet } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'

import Header from '../components/Header'

import TanstackQueryLayout from '../integrations/tanstack-query/layout'

import TanstackQueryProvider from '../integrations/tanstack-query/provider'

export const Route = createRootRoute({
  component: () => (
    <>
      <TanstackQueryProvider>
        <Header />

        <Outlet />
        <TanStackRouterDevtools />

        <TanstackQueryLayout />
      </TanstackQueryProvider>
    </>
  ),
})
