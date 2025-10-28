// src/types/ssthouse-vue3-tree-chart.d.ts
declare module '@ssthouse/vue3-tree-chart' {
  import { Component } from 'vue'

  export interface TreeNode {
    name: string
    value?: number
    children?: TreeNode[]
    [key: string]: any
  }

  export interface TreeChartProps {
    data: TreeNode[]
    width?: number
    height?: number
    nodeWidth?: number
    nodeHeight?: number
    duration?: number
    collapsible?: boolean
    // Добавьте другие пропсы по необходимости
  }

  export const TreeChart: Component<TreeChartProps>
  export default TreeChart
}
