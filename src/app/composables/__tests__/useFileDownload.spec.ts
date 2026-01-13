import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { useFileDownload } from '../useFileDownload'

describe('useFileDownload', () => {
  let originalCreateObjectURL: any
  let originalRevokeObjectURL: any

  beforeEach(() => {
    originalCreateObjectURL = URL.createObjectURL
    originalRevokeObjectURL = URL.revokeObjectURL

    // Моки для URL
    URL.createObjectURL = vi.fn(() => 'blob://123')
    URL.revokeObjectURL = vi.fn()
  })

  afterEach(() => {
    URL.createObjectURL = originalCreateObjectURL
    URL.revokeObjectURL = originalRevokeObjectURL
  })

  it('calls the necessary DOM methods to download a file', () => {
    const { download } = useFileDownload()

    // Создаем настоящий элемент <a>
    const a = document.createElement('a')
    document.body.appendChild(a) // чтобы не падал appendChild
    const clickMock = vi.spyOn(a, 'click')

    // Мокаем createElement, чтобы вернуть наш элемент
    vi.spyOn(document, 'createElement').mockReturnValue(a)

    download('{"key":"value"}', 'test.json')

    expect(URL.createObjectURL).toHaveBeenCalled()
    expect(a.download).toBe('test.json')
    expect(clickMock).toHaveBeenCalled()
    expect(document.body.contains(a)).toBe(false) // проверяем, что удалили
    expect(URL.revokeObjectURL).toHaveBeenCalledWith('blob://123')
  })
})
