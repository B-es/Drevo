import type { NodeData, TreeData } from '@/types'
import jsonData from './init_data.json'

export default class DataManager {
  private individuals: Array<NodeData>
  private treeData: TreeData

  constructor() {
    const data = jsonData
    this.individuals = jsonData['individuals'] as Array<NodeData>
    this.treeData = { id: data.id, name: data.name }
  }

  get getDataJson(): string {
    return JSON.stringify(this.individuals)
  }

  get getData(): Array<NodeData> {
    return this.individuals
  }

  getNodeDataById(id: string): NodeData | undefined {
    return this.individuals.find((d) => d.id === id)
  }

  add(node: NodeData) {
    this.individuals.push(node)
  }

  update(id: string, node: NodeData): void {
    const index = this.individuals.findIndex((item) => item.id === id)

    if (index !== -1) {
      // Заменяем объект по индексу
      this.individuals[index] = node
    } else {
      console.warn(`Person with id ${id} not found`)
    }
  }
}
