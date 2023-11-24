import { aesDecrypt } from "@/utils/aes";
import EInput from "@/views/components/global/EInput/EInput";
import Label from "@/views/components/global/Label/Label";
import Result from "@/views/components/global/Result/Result";
import Select from "@/views/components/global/Select/Select";

const Demo = defineComponent({
  setup() {
    const state = reactive({
      target: "",
      result: "",
      aesKey: localStorage.getItem("aesKey") || "",
      digit: 16,
    });
    return () => {
      return (
        <div>
          <Label label="需要解码数据" />
          <textarea class="textarea" v-model:value={state.target} />
          <EInput v-model:value={state.aesKey} label="aesKey" />
          <Label label="位数" />
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
