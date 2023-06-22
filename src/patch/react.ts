import ReactDefault from 'react';
import * as ReactAll from 'react';
import {resolver} from '../resolver';

const SIGN = 'isPatchedByReactRewiremock';

// to support old jest tests use two different types of import
const React = ReactDefault || ReactAll;

export const createElement = React.createElement;
export const cloneElement = React.cloneElement;
export const createFactory = React.createFactory;

/**
 * Wraps jsx factory with a mock
 */
const wrapJsx = <T extends typeof React.createElement>(jsxFactory: T): T => (
    (type: any, props: any = {}, ...args: any[]) => {
        const anyProps = props || {};
        const resolved = resolver(type, props, args) as any;
        // it could be resolved to a non-object, and that's legit for renderProp case
        if (resolved === undefined) {
            // @ts-ignore
            return jsxFactory.apply(this, arguments);
        }
        if (!resolved) {
            return resolved;
        }
        const {type: newType = type, props: newProps = props, children = args} = resolved;
        const key = anyProps.key;
        const ref = anyProps.ref;
        const finalProps = {
            key,
            ref,
            ...newProps
        };

        return finalProps && (finalProps.children !== anyProps.children)
            ? jsxFactory(newType, finalProps)
            : jsxFactory(newType, finalProps, ...children);
    }) as any as T;

/**
 * patches jsx-runtime
 * @example
 * ```tsx
 * import jsxRuntime from "react/jsx-runtime";
 * import jsxRuntimeDev from "react/jsx-dev-runtime";
 *
 * import {patchJsxRuntime} from 'react-remock';
 *
 * patchJsxRuntime(jsxRuntime);
 * patchJsxRuntime(jsxRuntimeDev);
 * ```
 */
export const patchJsxRuntime = <T extends {jsx:any; jsxs?:any; jsxDEV?:any}>(runtime:T): T => {
    // inspiration from https://github.com/preactjs/signals/blob/main/packages/react/runtime/src/auto.ts#L338
    runtime.jsx && /*   */ (runtime.jsx = wrapJsx(runtime.jsx));
    runtime.jsxs && /*  */ (runtime.jsxs = wrapJsx(runtime.jsxs));
    runtime.jsxDEV && /**/ (runtime.jsxDEV = wrapJsx(runtime.jsxDEV));

    return runtime;
}

function patchReact(React: any) {
    if (React) {
        if (!React.createElement[SIGN]) {

            React.createElement = wrapJsx(createElement);

            React.cloneElement =
                (type: any, props: any, ...args: any[]) => {
                    const newElement = cloneElement(type, props, ...args);
                    const key = newElement.key;
                    const ref = newElement.ref;
                    // extract children to separate prop
                    const {children = [], ...rest} = newElement.props || {};
                    return React.createElement(newElement.type, {
                        key,
                        ref,
                        ...rest
                    }, ...children);
                };

            React.createFactory = (type: any) => {
                const factory = React.createElement.bind(null, type);
                factory.type = type;
                return factory;
            }

            Object.defineProperty(React.createElement, SIGN, {
                configurable: false,
                writable: false,
                enumerable: false,
                value: true,
            });
        } else {
            console.log('skipping double patching');
        }
    }
}

export const enable = () => patchReact(React);
export const disable = () => {
    const R = React as any;
    R.createElement = createElement;
    R.cloneElement = cloneElement;
    R.createFactory = createFactory;
};

enable();