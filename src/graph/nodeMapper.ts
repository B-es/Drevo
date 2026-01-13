import type { NodeData } from '@/types'
import { type Node } from 'vue-vis-network2'

export function nodeToNode(node: NodeData): Node {
  const baseImg =
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTIwIiBoZWlnaHQ9IjE2MCIgZmlsbD0iI2Y1ZjVmNSIvPjxjaXJjbGUgY3g9IjYwIiBjeT0iNjAiIHI9IjQwIiBmaWxsPSIjZGRkIi8+PHRleHQgeD0iNjAiIHk9IjYwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM3NzciIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj4/PC90ZXh0Pjwvc3ZnPg=='
  return {
    id: node.id,
    font: {
      color: 'white',
    },
    label:
      node.firstName +
      ' ' +
      node.lastName +
      (node.deathDate
        ? '\n' +
          new Date(node.birthDate).getFullYear() +
          '-' +
          new Date(node.deathDate || '').getFullYear()
        : ''),
    shape: 'circularImage',
    image:
      node.photo ||
      'https://avatars.mds.yandex.net/get-vertis-journal/3934100/no_photo-1024x1024.png_1752756875488/orig',
    brokenImage: baseImg,
    shadow: {
      enabled: true,
      color: node.deathDate ? 'gray' : node.gender === 'male' ? 'red' : 'magenta',
      size: 15,
    },
  }
}
