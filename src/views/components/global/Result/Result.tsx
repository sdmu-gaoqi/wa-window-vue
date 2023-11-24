import copy from "copy-to-clipboard";
const Result = defineComponent({
  props: ["value"],
  setup(props: { value: string }) {
    return () => {
      return (
        <>
          <div
            class="cursor-pointer mr-6 text-[12px]"
            onClick={() => {
              copy(props.value || "");
            }}
          >
            点击复制结果
          </div>
          <div class="text-[--vscode-textBlockQuote-background]">
            {props.value || ""}
          </div>
        </>
      );
    };
  },
});

export default Result;
