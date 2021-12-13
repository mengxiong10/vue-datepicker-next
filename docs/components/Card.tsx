import { defineComponent, ref } from 'vue';
import IconCollapse from '../svg/collapse.svg';
import IconExpand from '../svg/expand.svg';

export default defineComponent({
  name: 'Card',
  props: {
    id: String,
    title: String,
    description: String,
    code: String,
    active: Boolean,
  },
  setup(props, { slots }) {
    const codeVisible = ref(false);

    const handleCollapse = () => {
      codeVisible.value = !codeVisible.value;
    };

    return () => {
      const { id, title, description, code } = props;
      return (
        <div class={['card', { active: props.active }]}>
          <section id={id} class="card-title" innerHTML={title}></section>
          <section class="card-description markdown-body" innerHTML={description}></section>
          <section class="card-demo markdown-body">{slots.default?.()}</section>
          <section class="card-actions" onClick={handleCollapse}>
            {codeVisible.value ? <IconCollapse /> : <IconExpand />}
          </section>
          <section style={{ display: codeVisible.value ? 'block' : 'none' }} class="card-code">
            <pre class="highlight-code">
              <code innerHTML={code}></code>
            </pre>
          </section>
        </div>
      );
    };
  },
});
