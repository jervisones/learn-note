import { mount } from "./mount";
import { diff } from "./diff.js";
import { odiff } from "./optimization-diff.js";

const patchChildren = (prev, next, parent) => {
  // diff 比较耗性能，可以前置做一些处理，提升效率
  if (!prev) {
    if (!next) {
      // do nothing
    } else {
      next = Array.isArray(next) ? next : [next];

      for (const c of next) {
        mount(c, parent);
      }
    }
  } else if (prev && !Array.isArray(prev)) {
    // 只有一个 children 的时候

    if (!next) {
      parent.removeChild(prev.el);
    } else if (next && !Array.isArray(next)) {
      patch(prev, next, parent);
    } else {
      parent.removeChild(prev.el);
      for (const c of next) {
        mount(c, parent);
      }
    }
  } else {
    // 老的多个 children 新的也是多个的时候
    odiff(prev, net, parent);
  }
};

export const patch = (prev, next, parent) => {
  // 如果整个节点改变，直接删除后挂载新的 e.g type: 'div' -> type: 'p'
  if (prev.type !== next.type) {
    parent.removeChild(prev.el);
    mount(next, parent);
    return;
  }

  // type 一样 diff props
  const {
    props: { children: prevChildren, ...prevProps },
  } = prev;
  const {
    props: { children: nextChildren, ...nextProps },
  } = next;

  // patchProps

  const el = (next.el = prev.el);
  for (let key of Object.keys(nextProps)) {
    let prev = prevProps[key],
      next = nextProps[key];
    patchProps(key, prev, next, el);
  }

  for (let key of Object.keys(prevProps)) {
    if (!nextProps.hasOwnProperty(key))
      patchProps(key, prevProps[key], null, el); // 老的有，新的没有
  }

  // patch children ⚠️
  patchChildren(prevChildren, nextChildren, el);
};

/**
 *  新旧 props 进行对比，并且直接作用在 dom 元素节点上
 * @param {*} key
 * @param {*} prev 旧值
 * @param {*} next 新值
 * @param {*} el 挂载节点
 */
export const patchProps = (key, prev, next, el) => {
  // style
  if (key === "style") {
    if (next)
      for (let k in next) {
        el.style[k] = next[k];
      }
    if (prev)
      for (let k in prev) {
        if (!next.hasOwnProperty(k)) {
          el.style[k] = "";
        }
      }
  }
};
