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
    <section id="doacao" className="py-20 bg-gray-50 dark:bg-gray-800">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-4">
            Ajude o Abrigo
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-10">
            Sua doação mantém a ração, os remédios e os cuidados veterinários dos animais
            que estão sob nossa proteção. Qualquer valor faz diferença.
          </p>

          <div className="inline-flex flex-col items-center gap-3 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 px-8 py-6">
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-widest">
              PIX
            </p>
            <p className="select-all font-mono text-lg font-medium text-gray-900 dark:text-gray-100">
              {PIX_KEY}
            </p>
            <button
              onClick={handleCopy}
              className="mt-1 rounded-lg bg-gray-100 dark:bg-gray-800 px-4 py-1.5 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            >
              {copied ? 'Copiado!' : 'Copiar chave'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
