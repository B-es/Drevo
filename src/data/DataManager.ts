import type { NodeData } from '@/types'
import jsonData from './init_data.json'

export default class DataManager {
  private data: Array<NodeData>

  constructor() {
    this.data = jsonData as Array<NodeData>
  }

  get getDataJson(): string {
    return JSON.stringify(this.data)
  }

  get getData(): Array<NodeData> {
    return this.data
  }

  getNodeDataById(id: string): NodeData | undefined {
    return this.data.find((d) => d.id === id)
  }
}
