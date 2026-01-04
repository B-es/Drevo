export interface NodeData {
  id: string
  firstName: string
  lastName: string
  maidenName: string // Девичья фамилия
  birthDate: string
  birthPlace: string
  deathDate: string
  deathPlace: string
  gender: string
  photo: string
  bio: string
  parents: Array<string> // id родителей, например ["person_3", "person_4"]
  spouses: Array<string> // id супругов
  children: Array<string> // id детей
}
