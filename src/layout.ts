import { isEmptyString, isNull, isUndefined, warn } from './util'

export enum NodeType {
  Root,
  Div,
}

type NodeStylePropertyKey = 'layout' | 'tag' | 'subarea'

type TransformInputNodeStyle = Record<NodeStylePropertyKey, string>

interface TransformOutputNodeStyle {
  layout: [number, number]
  tag: number
  subarea: Array<[number, number]>
}

class NodeStyle {
  #x = 0
  #y = 0
  #width = 0
  #height = 0
  #layout: [number, number] = [NaN, NaN]
  #tag: number = NaN
  #subarea = []
  #transformMap = new Map<NodeStylePropertyKey, boolean>()

  validate(value, key: NodeStylePropertyKey) {
    let data: { valid: boolean; result }
    switch (key) {
      case 'layout':
        data = NodeStyle.validateLayout(value)
        break
      case 'tag':
        data = NodeStyle.validateTag(value)
        break
      case 'subarea':
        data = NodeStyle.validateSubarea(value)
        break
    }
    const { valid, result } = data
    this.#transformMap.set(key, valid)
    if (!valid) {
      warn(`invalid ${key} value: ${value}`)
    }
    return result
  }

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
      valid: !result.some((i) => isNaN(i)),
      result,
    }
  }

  set layout(value: any) {
    this.#layout = this.validate(value, 'layout')
  }

  get layout() {
    return this.#layout
  }

  static validateTag(value: string) {
    const result = Number(value)
    return {
      valid: !isNaN(result),
      result,
    }
  }

  set tag(value: any) {
    this.#tag = this.validate(value, 'tag')
  }

  get tag() {
    return this.#tag
  }

  static validateSubarea(value: string) {
    const part = value.split(' ')
    const match = part.map((i) => /^(\d+),(\d+)$/.exec(i))
    if (match.some(isNull)) {
      return {
        valid: false,
        result: [],
      }
    }
    return {
      valid: true,
      result: (match as RegExpExecArray[]).map((i) => [i[1], i[2]].map(Number)),
    }
  }

  set subarea(value: any) {
    this.#subarea = this.validate(value, 'subarea')
  }

  get subarea() {
    return this.#subarea
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
    const { layout, tag, subarea } = this.#style
    return {
      layout,
      tag,
      subarea,
    }
  }
}

export const createNode = (type: NodeType) => new Node(type)
