export interface NodeData {
  id: string
  firstName: string
  lastName: string
  patronymic: string
  maidenName: string // Девичья фамилия
  birthDate: string
  birthPlace: string
  deathDate: string
  deathPlace: string
  gender: string
  photo: string
  bio: string
  siblings: Array<string> // id братьев и сестёр
  parents: Array<string> // id родителей, например ["person_3", "person_4"]
  spouses: Array<string> // id супругов
  children: Array<string> // id детей
}
