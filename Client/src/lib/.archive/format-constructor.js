import { fs } from 'fs';

class FormatConstructor {
  constructor(fileName) {
    this.template = JSON.parse(fs.readFileSync(fileName));
  }

  getBaseNode() {
    const result = {};
    this.template
      .forEach((t) => {
        switch (t.type.toLowerCase) {
          case 'string':
            result[t.key] = '';
            break;
          case 'array':
            result[t.key] = [];
            break;
          default:
            break;
        }
      });
    return result;
  }

  /**
   * 指定のノードの子を取得します.
   * 親ノードを指定するには、ルートから対象までのノードキーをピリオドでつないで指定
   * @param {String} parentKeys 例: 'root.foo.var'
   */
  getChildNode(parentKeys) {
    const keys = parentKeys.split('.');
    let layer = this.template.find((t) => t.key === keys[0]);
    for (let i = 0; i < keys.length; i++) {
      layer = layer.find((t) => t.key === keys);
    }
  }
}

export default FormatConstructor;
