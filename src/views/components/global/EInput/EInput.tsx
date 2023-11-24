import Label from "../Label/Label";

const EInput = defineComponent({
  emits: ["update:value"],
  props: ["value", "label"],
  setup(props: { value: string; label: string }, { emit }) {
    return () => {
      return (
        <>
          <Label label={props.label} />
          <input
            value={props.value}
            class="w-[100%] h-[20px]"
            onInput={(e) => {
              emit("update:value", e.target?.value || "");
            }}
          ></input>
        </>
      );
    };
  },
});

export default EInput;
