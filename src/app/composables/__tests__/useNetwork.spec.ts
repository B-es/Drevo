import { useNetwork } from '../useNetwork'
import { describe, it, expect } from 'vitest'

describe('useNetwork', () => {
  it('updates network after setting networkRef', () => {
    const { networkRef, network, initNetwork } = useNetwork()
    expect(network.value).toBeNull()

    networkRef.value = { network: { some: 'object' } }
    initNetwork()

    expect(network.value).toEqual({ some: 'object' })
  })
})
