import { useState } from 'react'

const PIX_KEY = 'abrigodamarcia@gmail.com'

export default function DoacaoSection() {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(PIX_KEY)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <section id="doacao" className="bg-gray-50 py-14 dark:bg-gray-800 sm:py-20">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Ajude o Abrigo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Sua doação mantém a ração, os remédios e os cuidados veterinários dos animais
            que estão sob nossa proteção. Qualquer valor faz diferença.
          </p>

          <div className="inline-flex w-full max-w-md flex-col items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-6 dark:border-gray-700 dark:bg-gray-900 sm:px-8">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              PIX
            </p>
            <p className="select-all break-all text-center font-mono text-base font-medium text-gray-900 dark:text-gray-100 sm:text-lg">
              {PIX_KEY}
            </p>
            <button
              onClick={handleCopy}
              className="mt-1 min-h-10 rounded-lg bg-gray-100 px-4 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-200 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
            >
              {copied ? 'Copiado!' : 'Copiar chave'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
