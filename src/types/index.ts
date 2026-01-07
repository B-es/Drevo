export type Gender = 'male' | 'female'
export type NodeID = string

export interface NodeData {
  id: string
  firstName: string
  lastName: string
  patronymic: string
  maidenName: string // Девичья фамилия
  birthDate: string
  birthPlace: string
  deathDate?: string
  deathPlace?: string
  gender: Gender
  photo?: string
  bio: string
  siblings: NodeID[] // id братьев и сестёр
  parents: NodeID[] // id родителей, например ["person_3", "person_4"]
  spouses: NodeID[] // id супругов
  children: NodeID[] // id детей
}

export interface TreeMeta {
  id: string
  name: string
}
