/**
 * get the hidden element width, height
 * @param {HTMLElement} element dom
 */
export function getPopupElementSize(element: HTMLElement) {
  const originalDisplay = element.style.display;
  const originalVisibility = element.style.visibility;
  element.style.display = 'block';
  element.style.visibility = 'hidden';
  const styles = window.getComputedStyle(element);
  const width =
    element.offsetWidth + parseInt(styles.marginLeft, 10) + parseInt(styles.marginRight, 10);
  const height =
    element.offsetHeight + parseInt(styles.marginTop, 10) + parseInt(styles.marginBottom, 10);
  element.style.display = originalDisplay;
  element.style.visibility = originalVisibility;
  return { width, height };
}

/**
 * get the popup position
 * @param {HTMLElement} el relative element
 * @param {Number} targetWidth target element's width
 * @param {Number} targetHeight target element's height
 * @param {Boolean} fixed
 */
export function getRelativePosition(
  el: HTMLElement,
  targetWidth: number,
  targetHeight: number,
  fixed: boolean
) {
  let left = 0;
  let top = 0;
  let offsetX = 0;
  let offsetY = 0;
  const relativeRect = el.getBoundingClientRect();
  const dw = document.documentElement.clientWidth;
  const dh = document.documentElement.clientHeight;
  if (fixed) {
    offsetX = window.pageXOffset + relativeRect.left;
    offsetY = window.pageYOffset + relativeRect.top;
  }
  if (dw - relativeRect.left < targetWidth && relativeRect.right < targetWidth) {
    left = offsetX - relativeRect.left + 1;
  } else if (relativeRect.left + relativeRect.width / 2 <= dw / 2) {
    left = offsetX;
  } else {
    left = offsetX + relativeRect.width - targetWidth;
  }
  if (relativeRect.top <= targetHeight && dh - relativeRect.bottom <= targetHeight) {
    top = offsetY + dh - relativeRect.top - targetHeight;
  } else if (relativeRect.top + relativeRect.height / 2 <= dh / 2) {
    top = offsetY + relativeRect.height;
  } else {
    top = offsetY - targetHeight;
  }
  return { left: `${left}px`, top: `${top}px` };
}

export function getScrollParent(node: Element | null, until = document.body): Element | null {
  if (!node || node === until) {
    return null;
  }

  const style = (value: Element, prop: string) =>
    getComputedStyle(value, null).getPropertyValue(prop);

  const regex = /(auto|scroll)/;

  const scroll = regex.test(
    style(node, 'overflow') + style(node, 'overflow-y') + style(node, 'overflow-x')
  );

  return scroll ? node : getScrollParent(node.parentElement, until);
}

let scrollBarWidth: number;

export function getScrollbarWidth() {
  if (typeof window === 'undefined') return 0;
  if (scrollBarWidth !== undefined) return scrollBarWidth;

  const outer = document.createElement('div');
  outer.style.visibility = 'hidden';
  outer.style.overflow = 'scroll';
  outer.style.width = '100px';
  outer.style.position = 'absolute';
  outer.style.top = '-9999px';
  document.body.appendChild(outer);

  const inner = document.createElement('div');
  inner.style.width = '100%';
  outer.appendChild(inner);

  scrollBarWidth = outer.offsetWidth - inner.offsetWidth;
  (outer.parentNode as HTMLElement).removeChild(outer);

  return scrollBarWidth;
}

export const mousedownEvent = 'ontouchend' in document ? 'touchstart' : 'mousedown';
