import { aesDecrypt } from "@/utils/aes";
import Result from "@/views/components/global/Result/Result";
import Select from "@/views/components/global/Select/Select";

const Demo = defineComponent({
  setup() {
    const state = reactive({
      target: localStorage.getItem("target") || "",
      result: localStorage.getItem("result") || "",
      aesKey: localStorage.getItem("aesKey") || "",
      digit: 16,
    });
    return () => {
      return (
        <div>
          <div class="label">aesKey</div>
          <input
            class="input"
            v-model:value={state.aesKey}
            value={state.aesKey}
            onChange={(e) => {
              state.aesKey = e.target.value?.trim();
            }}
            placeholder="请输入"
          />
          <div class="label">目标数据</div>
          <textarea
            class="textarea"
            rows={5}
            placeholder="请输入"
            value={state.target}
            onChange={(e) => {
              state.target = e.target.value?.trim();
            }}
          />
          <div class="label">位数</div>
          <Select
            value={state.digit}
            options={[
              { label: "16位", value: 16 },
              { label: "24位", value: 24 },
              { label: "32位", value: 32 },
            ]}
          />
          <div
            class="btn"
            onClick={() => {
              const res = aesDecrypt(state.target, state.aesKey, {
                digit: state.digit,
              });
              localStorage.setItem("aesKey", state.aesKey);
              localStorage.setItem("target", state.target);
              localStorage.setItem("result", res);
              state.result = res;
            }}
          >
            解码
          </div>
          <Result value={state.result} />
        </div>
      );
    };
  },
});

export default Demo;
