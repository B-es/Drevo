import type { NodeData, TreeMeta, NodeID } from '@/types'
import jsonData from './init_data.json'

export default class DataManager {
  private individuals: NodeData[] = []
  private treeData: TreeMeta = { id: '', name: '' }

  constructor(json?: string) {
    this.load(json)
  }

  load(json?: string) {
    const data = json ? JSON.parse(json) : structuredClone(jsonData)
    this.individuals = data.individuals as NodeData[]
    this.treeData = { id: data.id, name: data.name }
  }

  /** Получить всех людей (глубокая копия) */
  getAll(): NodeData[] {
    return structuredClone(this.individuals)
  }

  /** Получить одного человека по ID */
  getById(id: NodeID): NodeData | undefined {
    const person = this.individuals.find((p) => p.id === id)
    return person ? structuredClone(person) : undefined
  }

  /** Добавить нового человека */
  add(person: NodeData): void {
    if (this.exists(person.id)) {
      console.warn(`Person with id ${person.id} already exists`)
      return
    }
    this.individuals.push(structuredClone(person))
  }

  /** Обновить существующего человека */
  update(id: NodeID, person: NodeData): void {
    const index = this.individuals.findIndex((p) => p.id === id)
    if (index === -1) {
      console.warn(`Person with id ${id} not found`)
      return
    }
    this.individuals[index] = structuredClone(person)
  }

  /** Проверка существования ID */
  exists(id: NodeID): boolean {
    return this.individuals.some((p) => p.id === id)
  }

  /** Удалить человека */
  remove(id: NodeID): void {
    this.individuals = this.individuals.filter((p) => p.id !== id)
  }

  /** Получить JSON для сохранения */
  toJSON(): string {
    return JSON.stringify({ ...this.treeData, individuals: this.individuals }, null, 2)
  }
}
