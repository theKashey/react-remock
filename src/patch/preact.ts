import {resolver} from '../resolver';

const preact = require('preact');

function patchReact(preact: any) {

  const oldHandler = preact.options.vnode;
  preact.options.vnode = (vnode: any) => {
    const {nodeName: type, attributes: props, children: args} = vnode;

    const {type: newType = type, props: newProps = props, children = args} = resolver(type as any, props, args);
    const node = {
      nodeName: newType,
      arguments: newProps,
      children,
    };

    return oldHandler
      ? oldHandler(node)
      : node;
  }
}

patchReact(preact);