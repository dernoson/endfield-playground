import type { Edge, Node } from '@vue-flow/core'

export type FactoryNodeData = {
  label: string
  machineType?: string
}

export type FactoryNode = Node<FactoryNodeData>
export type FactoryEdge = Edge
