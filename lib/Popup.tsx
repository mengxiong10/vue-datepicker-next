import { Transition, ref, watchEffect, Teleport, SetupContext, StyleValue } from 'vue';
import { usePrefixClass } from './context';
import { ClassValue } from './type';
import {
  getPopupElementSize,
  getRelativePosition,
  getScrollParent,
  mousedownEvent,
} from './util/dom';
import { rafThrottle } from './util/throttle';
import { withDefault, defineVueComponent, keys } from './vueUtil';

export interface PopupProps {
  style?: StyleValue;
  className?: ClassValue;
  visible: boolean;
  appendToBody?: boolean;
  onClickOutside: (evt: MouseEvent | TouchEvent) => void;
  getRelativeElement: () => HTMLElement | undefined;
}

function Popup(originalProps: PopupProps, { slots }: SetupContext) {
  const props = withDefault(originalProps, {
    appendToBody: true,
  });
  const prefixClass = usePrefixClass();
  const popup = ref<HTMLElement | null>(null);
  const position = ref({ left: '', top: '' });

  const displayPopup = () => {
    if (!props.visible || !popup.value) return;
    const relativeElement = props.getRelativeElement();
    if (!relativeElement) return;
    const { width, height } = getPopupElementSize(popup.value);
    position.value = getRelativePosition(relativeElement, width, height, props.appendToBody);
  };

  watchEffect(displayPopup, { flush: 'post' });

  watchEffect(
    (onInvalidate) => {
      const relativeElement = props.getRelativeElement();
      if (!relativeElement) return;
      const scrollElement = getScrollParent(relativeElement) || window;
      const handleMove = rafThrottle(displayPopup);
      scrollElement.addEventListener('scroll', handleMove);
      window.addEventListener('resize', handleMove);
      onInvalidate(() => {
        scrollElement.removeEventListener('scroll', handleMove);
        window.removeEventListener('resize', handleMove);
      });
    },
    { flush: 'post' }
  );

  const handleClickOutside = (evt: MouseEvent | TouchEvent) => {
    if (!props.visible) return;
    const target = evt.target as Node;
    const el = popup.value;
    const relativeElement = props.getRelativeElement();
    if (el && !el.contains(target) && relativeElement && !relativeElement.contains(target)) {
      props.onClickOutside(evt);
    }
  };

  watchEffect((onInvalidate) => {
    document.addEventListener(mousedownEvent, handleClickOutside);
    onInvalidate(() => {
      document.removeEventListener(mousedownEvent, handleClickOutside);
    });
  });

  return () => {
    return (
      <Teleport to="body" disabled={!props.appendToBody}>
        <Transition name={`${prefixClass}-zoom-in-down`}>
          {props.visible && (
            <div
              ref={popup}
              class={`${prefixClass}-datepicker-main ${prefixClass}-datepicker-popup ${props.className}`}
              style={[{ position: 'absolute', ...position.value }, props.style || {}]}
            >
              {slots.default?.()}
            </div>
          )}
        </Transition>
      </Teleport>
    );
  };
}

const popupProps = keys<PopupProps>()([
  'style',
  'className',
  'visible',
  'appendToBody',
  'onClickOutside',
  'getRelativeElement',
]);

export default defineVueComponent(Popup, popupProps);
