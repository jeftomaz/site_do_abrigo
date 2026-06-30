import { screen, waitFor } from '@testing-library/react'
import { useAvailableDogs } from '../features/dogs/hooks'
import { dogFixture } from './msw/handlers'
import { renderWithProviders } from './render'

function DogsStub() {
  const { data, isLoading } = useAvailableDogs()
  if (isLoading) return <p>Carregando…</p>
  return <ul>{data?.map(d => <li key={d.id}>{d.name}</li>)}</ul>
}

it('renderWithProviders exibe dados retornados pelo handler MSW', async () => {
  renderWithProviders(<DogsStub />)

  await waitFor(() => {
    expect(screen.getByText(dogFixture.name)).toBeInTheDocument()
  })
})
