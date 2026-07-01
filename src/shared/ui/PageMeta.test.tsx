import { render, waitFor } from '@testing-library/react'
import PageMeta from './PageMeta'

describe('PageMeta', () => {
  it('atualiza title, description, Open Graph e canonical', async () => {
    render(
      <PageMeta
        title="Adoção"
        description="Conheça os cães disponíveis para adoção."
        path="/adocao"
      />,
    )

    await waitFor(() => {
      expect(document.title).toBe('Adoção | Abrigo')
    })

    expect(document.head.querySelector('meta[name="description"]')).toHaveAttribute(
      'content',
      'Conheça os cães disponíveis para adoção.',
    )
    expect(document.head.querySelector('meta[property="og:title"]')).toHaveAttribute(
      'content',
      'Adoção | Abrigo',
    )
    expect(document.head.querySelector('link[rel="canonical"]')).toHaveAttribute(
      'href',
      'http://localhost:3000/site_do_abrigo/adocao',
    )
  })
})
