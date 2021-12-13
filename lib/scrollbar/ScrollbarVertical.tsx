import { defineComponent, ref, onMounted, onUnmounted } from 'vue';
import { usePrefixClass } from '../context';
import { getScrollbarWidth } from '../util/dom';

export const ScrollbarVertical = defineComponent({
  setup(props, { slots }) {
    const prefixClass = usePrefixClass();

    const wrapper = ref<HTMLDivElement>();

    const thumbHeight = ref(''); // %
    const thumbTop = ref('');

    const getThumbHeight = () => {
      if (!wrapper.value) return;
      const el = wrapper.value;
      const heightPercentage = (el.clientHeight * 100) / el.scrollHeight;
      thumbHeight.value = heightPercentage < 100 ? `${heightPercentage}%` : '';
    };

    onMounted(getThumbHeight);

    const scrollbarWidth = getScrollbarWidth();

    const handleScroll = (evt: UIEvent) => {
      const el = evt.currentTarget as HTMLElement;
      const { scrollHeight, scrollTop } = el;
      thumbTop.value = `${(scrollTop * 100) / scrollHeight}%`;
    };

    let draggable = false;
    let prevY = 0;
    const handleDragstart = (evt: MouseEvent) => {
      evt.stopImmediatePropagation();
      const el = evt.currentTarget as HTMLElement;
      const { offsetTop } = el;
      draggable = true;
      prevY = evt.clientY - offsetTop;
    };

    const handleDraging = (evt: MouseEvent) => {
      if (!draggable || !wrapper.value) return;
      const { clientY } = evt;
      const { scrollHeight, clientHeight } = wrapper.value;
      const offsetY = clientY - prevY;
      const top = (offsetY * scrollHeight) / clientHeight;
      wrapper.value.scrollTop = top;
    };

    const handleDragend = () => {
      draggable = false;
    };

    onMounted(() => {
      document.addEventListener('mousemove', handleDraging);
      document.addEventListener('mouseup', handleDragend);
    });
    onUnmounted(() => {
      document.addEventListener('mousemove', handleDraging);
      document.addEventListener('mouseup', handleDragend);
    });

    return () => (
      <div class={`${prefixClass}-scrollbar`} style={{ position: 'relative', overflow: 'hidden' }}>
        <div
          ref={wrapper}
          class={`${prefixClass}-scrollbar-wrap`}
          style={{ marginRight: `-${scrollbarWidth}px` }}
          onScroll={handleScroll}
        >
          {slots.default?.()}
        </div>
        <div class={`${prefixClass}-scrollbar-track`}>
          <div
            class={`${prefixClass}-scrollbar-thumb`}
            style={{ height: thumbHeight.value, top: thumbTop.value }}
            onMousedown={handleDragstart}
          ></div>
        </div>
      </div>
    );
  },
});
