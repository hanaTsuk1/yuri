import { assert, describe, expect, it } from 'vitest'

import { NodeType, createNode, Node } from '../src/layout'

describe('set nodeStyle property', () => {
  it('layout', () => {
    const node = createNode(NodeType.Div)
    node.setStyle({
      layout: 'a',
    })
    assert.deepEqual(node.getStyle().layout, [NaN, 1])

    node.setStyle({
      layout: 'n',
    })
    assert.deepEqual(node.getStyle().layout, [Infinity, 1])

    node.setStyle({
      layout: '3',
    })
    assert.deepEqual(node.getStyle().layout, [3, 1])

    node.setStyle({
      layout: '3-a',
    })
    assert.deepEqual(node.getStyle().layout, [3, NaN])

    node.setStyle({
      layout: '3-n',
    })
    assert.deepEqual(node.getStyle().layout, [3, Infinity])

    node.setStyle({
      layout: '3-2',
    })
    assert.deepEqual(node.getStyle().layout, [3, 2])

    node.setStyle({
      layout: '3-2-2',
    })
    assert.deepEqual(node.getStyle().layout, [NaN, NaN])

    node.setStyle({
      layout: '',
    })
    assert.deepEqual(node.getStyle().layout, [NaN, NaN])
  })

  it('subarea', () => {
    const node = createNode(NodeType.Div)
    node.setStyle({
      subarea: '1,3 3,1',
    })
    assert.deepEqual(node.getStyle().subarea, [
      [1, 3],
      [3, 1],
    ])

    node.setStyle({
      subarea: '1',
    })
    assert.deepEqual(node.getStyle().subarea, [])
  })
})

describe('node', () => {
  it('compute layout and subare', () => {
    const node = createNode(NodeType.Div)
    node.setStyle({
      width: 400,
      height: 200,
      layout: '4-2',
      subarea: '2,2 4,1',
    })
    const child = createNode(NodeType.Div)
    const child2 = createNode(NodeType.Div)
    const child3 = createNode(NodeType.Div)
    node.appendChild(child)
    node.appendChild(child2)
    node.appendChild(child3)
    node.compute()
    const getArea = (node: Node) => {
      const { x, y, width, height } = node.getStyle()
      return {
        x,
        y,
        width,
        height,
      }
    }
    expect(getArea(child)).toMatchInlineSnapshot(`
      {
        "height": 200,
        "width": 200,
        "x": 0,
        "y": 0,
      }
    `)
    expect(getArea(child2)).toMatchInlineSnapshot(`
      {
        "height": 100,
        "width": 200,
        "x": 200,
        "y": 0,
      }
    `)
    expect(getArea(child3)).toMatchInlineSnapshot(`
      {
        "height": 100,
        "width": 200,
        "x": 200,
        "y": 100,
      }
    `)
  })
})
