import { assert, describe, it } from 'vitest'

import { NodeType, createNode } from '../src/layout'

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
