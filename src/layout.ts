import { isEmptyString, isNull, isUndefined, warn } from './util'

export enum NodeType {
  Root,
  Div,
}

type TransformNodeStylePropertyKey = 'layout' | 'tag' | 'subarea'

type NonTransformNodeStylePropertyKey = 'x' | 'y' | 'width' | 'height'

type TransformInputNodeStyle = {
  layout: string
  tag: string | number
  subarea: string
}

type InputNodeStyle = TransformInputNodeStyle &
  Pick<NodeStyle, NonTransformNodeStylePropertyKey>

type OutputNodeStyle = {
  layout: [number, number]
  tag: number
  subarea: Array<[number, number]>
} & Pick<NodeStyle, NonTransformNodeStylePropertyKey>

class NodeStyle {
  x = 0
  y = 0
  width = 0
  height = 0
  private _layout: [number, number] = [NaN, NaN]
  private _tag: number = NaN
  private _subarea = []
  private _transformValidPropMap = new Map<
    TransformNodeStylePropertyKey,
    boolean
  >()

  constructor() {
    this._transformValidPropMap.set('layout', false)
    this._transformValidPropMap.set('tag', false)
    this._transformValidPropMap.set('subarea', false)
  }

  private _validate(value, key: TransformNodeStylePropertyKey) {
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
    this._transformValidPropMap.set(key, valid)
    if (!valid) {
      warn(`invalid ${key} value: ${value}`)
    }
    return result
  }

  static validateLayout(value: TransformInputNodeStyle['layout']) {
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
    this._layout = this._validate(value, 'layout')
  }

  get layout() {
    return this._layout
  }

  static validateTag(value: TransformInputNodeStyle['tag']) {
    const result = Number(value)
    return {
      valid: !isNaN(result),
      result,
    }
  }

  set tag(value: any) {
    this._tag = this._validate(value, 'tag')
  }

  get tag() {
    return this._tag
  }

  static validateSubarea(value: TransformInputNodeStyle['subarea']) {
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
    this._subarea = this._validate(value, 'subarea')
  }

  get subarea() {
    return this._subarea
  }

  getValidityByKey(key: TransformNodeStylePropertyKey) {
    return this._transformValidPropMap.get(key)
  }
}

class Node {
  children: Array<Node> = []
  #style = new NodeStyle()

  constructor(public type: NodeType) {}

  setStyle(style: Partial<InputNodeStyle>) {
    for (const key in style) {
      this.#style[key] = style[key]
    }
  }

  getStyle(): OutputNodeStyle {
    const { layout, tag, subarea, x, y, width, height } = this.#style
    return {
      layout,
      tag,
      subarea,
      x,
      y,
      width,
      height,
    }
  }

  private _setChildrenTag() {
    if (this.#style.getValidityByKey('layout')) {
      this.children.forEach((node, index) =>
        node.setStyle({
          tag: index,
        })
      )
    }
  }

  appendChild(node: Node) {
    this.children.push(node)
    this._setChildrenTag()
  }

  removeChild(node: Node) {
    const index = this.children.findIndex((i) => i === node)
    if (index === -1) {
      this.children.splice(index, 1)
      this._setChildrenTag()
    }
  }

  compute() {
    if (
      this.#style.getValidityByKey('layout') &&
      this.#style.getValidityByKey('subarea')
    ) {
      const { layout, subarea, x, y, width, height } = this.#style
      const [col, row] = layout
      for (const child of this.children) {
        if (!child.#style.getValidityByKey('tag')) break
        const { tag } = child.#style
      }
    }
  }
}

export const createNode = (type: NodeType) => new Node(type)
