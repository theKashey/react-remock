import {resolver} from '../resolver';

const preact = require('preact');
const oldHandler = preact.options.vnode;

function patchReact(preact: any) {
  preact.options.vnode = (vnode: any) => {
    const {nodeName: type, attributes: props, children: args} = vnode;

    const {type: newType = type, props: newProps = props, children = args} = resolver(type as any, props, args) as any;
    const node = {
      nodeName: newType,
      arguments: newProps,
      children: newProps && newProps.children || children,
    };

    return oldHandler
      ? oldHandler(node)
      : node;
  }
}

export const enable = () => patchReact(preact);
export const disable = () => preact.options.vnode = oldHandler;

enable();