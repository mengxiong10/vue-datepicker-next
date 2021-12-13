import { ScrollbarVertical } from '../scrollbar/ScrollbarVertical';
import { usePrefixClass } from '../context';

export interface FixedListItem {
  value: Date;
  text: string;
}

export interface FixedListProps {
  options: FixedListItem[];
  getClasses: (v: Date, type: string) => string;
  onSelect: (v: Date, type: string) => void;
}

// TODO: 可否简化为 单列 Column
// TODO: 样式
export function FixedList(props: FixedListProps) {
  const prefixClass = usePrefixClass();

  return (
    <ScrollbarVertical>
      {props.options.map((item) => (
        <div
          key={item.text}
          class={[`${prefixClass}-time-option`, props.getClasses(item.value, 'time')]}
          onClick={() => props.onSelect(item.value, 'time')}
        >
          {item.text}
        </div>
      ))}
    </ScrollbarVertical>
  );
}
