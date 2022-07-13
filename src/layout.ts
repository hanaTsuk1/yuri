import { isEmptyString, isUndefined, warn } from './util'

export enum NodeType {
  Root,
  Div,
}

interface TransformInputNodeStyle {
  layout: string
}

interface TransformOutputNodeStyle {
  layout: [number, number]
}

class NodeStyle {
  #x = 0
  #y = 0
  #width = 0
  #height = 0
  #layout: [number, number] = [NaN, NaN]
  #tag: Array<number> = []
  #tagMap = new Map<number, Array<number>>()

  static validateLayout(value: string) {
    const toNumber = (str?: string) => (str === 'n' ? Infinity : Number(str))
    const process = (value: string): [number, number] => {
      if (isEmptyString(value)) {
        return [NaN, NaN]
      }
      const result = value.split('-')
      if (result.length > 2) {
        return [NaN, NaN]
      }
      const [col, row] = result
      if (isUndefined(row) || isEmptyString(row)) {
        return [toNumber(col), 1]
      } else {
        return [toNumber(col), toNumber(row)]
      }
    }
    const result = process(value)
    return {
      match: !result.some((i) => isNaN(i)),
      result,
    }
  }

  set layout(value: any) {
    const { match, result } = NodeStyle.validateLayout(value)
    this.#layout = result
    if (!match) {
      warn('invalid layout value')
    }
  }

  get layout() {
    return this.#layout
  }
}

class Node {
  children: Array<Node> = []
  #style = new NodeStyle()

  constructor(public type: NodeType) {}

  setStyle(style: Partial<TransformInputNodeStyle>) {
    for (const key in style) {
      this.#style[key] = style[key]
    }
  }

  getStyle(): TransformOutputNodeStyle {
    const { layout } = this.#style
    return {
      layout,
    }
  }
}

export const createNode = (type: NodeType) => new Node(type)
