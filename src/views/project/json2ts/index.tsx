import Result from "@/views/components/global/Result/Result";
import JsonToTS from "json-to-ts";

const Demo = defineComponent({
  setup() {
    const state = reactive({
      target: localStorage.getItem("json2tsTarget") || "",
      result: localStorage.getItem("json2tsResult") || [""],
    });
    const getDataByString = (data: string) => {
      return new Function("", "return " + data);
    };
    const json2ts = () => {
      if (!state?.target) {
        return;
      }
      try {
        const target = getDataByString(state?.target)();
        const res = JsonToTS(target);
        state.result = res;
      } catch (err) {
        state.result = ["格式错误 参考{name: 1}"];
      }
    };
    return () => {
      return (
        <div>
          <div class="label">转换数据</div>
          <textarea
            class="textarea"
            rows={5}
            placeholder="请输入"
            value={state.target}
            onChange={(e) => {
              state.target = e.target.value?.trim();
            }}
          />
          <div class="btn" onClick={json2ts}>
            开始转换
          </div>
          <Result value={state.result} />
        </div>
      );
    };
  },
});

export default Demo;
