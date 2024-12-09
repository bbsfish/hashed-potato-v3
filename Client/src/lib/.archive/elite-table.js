/**
 * EliteTableNode
 * @param {object} node
 * @param {{ text, type, placeholder, value }} contents
 * @returns {{ contents: object }|{ contents: object, nodes: <EliteTableNode>[] }}
 */
function makeNode(node) {
  if (typeof node === 'string') return { contents: { label: node } };
  if (Array.isArray(node)) {
    return {
      contents: { label: 'Array' },
      nodes: node.map((child) => makeNode(child)),
    };
  }
  return {
    contents: { label: 'Object' },
    nodes: Object.keys(node).map((key) => makeNode(node[key])),
  };
}

export default function makeTree(parent) {
  console.debug('[elite-tabel.js] makeTree', parent);
  const result = makeNode(parent);
  console.debug('[elite-tabel.js] makeTree', result);
  return result;
}

/**
 * tree: {
        contents: { label: 'aaa' },
        nodes: [
          {
            contents: { label: '2.1' },
            nodes: [
              {
                contents: { label: '3.1' },
                nodes: [
                  { contents: { label: '4.1' } },
                  { contents: { label: '4.2' } },
                ],
              },
              { contents: { label: '3.2' } },
            ],
          },
          {
            contents: { label: '2.2' },
          },
        ],
      },
 */
