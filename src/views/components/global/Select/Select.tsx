type Props = {
  options: { label: string; value: any }[];
  value: any;
};

const Select = defineComponent({
  props: ["options"],
  emits: ["update:value"],
  setup(props: Props, { emit }) {
    return () => {
      return (
        <select
          class="w-[100%] my-[4px] h-[20px]"
          onChange={(e) => {
            emit("update:value", e);
          }}
        >
          {props.options?.map(({ label, value }) => {
            return <option value={value}>{label}</option>;
          })}
        </select>
      );
    };
  },
});

export default Select;
