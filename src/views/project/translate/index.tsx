import { baiduLangs, PostmessageType } from "@/constants/content";
import bridge from "@/utils/bridge";
import Result from "@/views/components/global/Result/Result";
import Select from "@/views/components/global/Select/Select";

enum TransForm {
  小驼峰 = 1,
  大驼峰,
  下划线,
}

const toHump = (content: string, capitalLetters: number) => {
  if (capitalLetters === 0) {
    return content;
  }
  let result = content?.replace(/\s([a-z])/g, (_, target) => {
    switch (capitalLetters) {
      case TransForm.小驼峰:
      case TransForm.大驼峰:
        return (target || "").toLocaleUpperCase();
      case TransForm.下划线:
        return `_${target || ""}`;
    }
  });
  result = `${
    capitalLetters === TransForm.大驼峰
      ? result[0]?.toLocaleUpperCase()
      : result[0]?.toLocaleLowerCase()
  }${result?.slice(1) || ""}`;
  return result;
};

const Demo = defineComponent({
  setup() {
    const state = reactive({
      result: localStorage.getItem("translateResult") || "",
      target: "zh",
      current: "en",
      loading: false,
      content: localStorage.getItem("translateContent") || "",
      transform: 0,
    });

    onMounted(
      bridge[PostmessageType.翻译完成]((data) => {
        state.loading = false;
        const transformData = toHump(data, +state.transform);
        state.result = transformData;
        localStorage.setItem("translateResult", transformData);
      })
    );

    return () => {
      const translate = () => {
        state.loading = true;
        bridge[PostmessageType.翻译]({
          currentLang: state.current,
          targetLang: state.target,
          currentContent: state.content,
        });
        localStorage.setItem("translateContent", state.content);
      };

      return (
        <div>
          <div class="label">目标数据</div>
          <textarea
            class="textarea"
            rows={5}
            placeholder="请输入"
            value={state.content}
            onChange={(e) => {
              state.content = e.target.value?.trim();
            }}
          />
          <div class="label">当前语言</div>
          <Select
            v-model:value={state.current}
            options={baiduLangs}
            placeholder="请选择"
          />
          <div class="label">目标语言</div>
          <Select
            v-model:value={state.target}
            options={baiduLangs}
            placeholder="请选择"
          />
          <div class="label">是否转格式</div>
          <Select
            v-model:value={state.transform}
            options={[
              { label: "否", value: 0 },
              { label: "小驼峰", value: TransForm.小驼峰 },
              { label: "大驼峰", value: TransForm.大驼峰 },
              { label: "下划线", value: TransForm.下划线 },
            ]}
            placeholder="请选择"
          />
          <div class="btn" onClick={translate}>
            {state.loading ? "翻译中" : "翻译"}
          </div>
          <Result value={state.result} />
        </div>
      );
    };
  },
});

export default Demo;
