import copy from "copy-to-clipboard";
const Result = defineComponent({
  props: ["value"],
  setup(props: { value: string }) {
    return () => {
      return (
        <>
          <div class="cursor-pointer mr-6 text-[12px]">点击结果可复制</div>
          <div
            class="text-[--vscode-textLink-activeForeground] cursor-pointer"
            onClick={() => {
              copy(props.value || "");
            }}
          >
            {props.value || ""}
          </div>
        </>
      );
    };
  },
});

export default Result;
