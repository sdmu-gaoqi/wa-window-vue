import { effect } from "vue";

type MemoItem = {
  key: string;
  content: string;
  complete: false;
};

type Memo = {
  globals: MemoItem[];
  workspace: MemoItem[];
};

const Demo = defineComponent({
  setup() {
    const memos = reactive<Memo>({
      globals: [],
      workspace: [],
    });
    onMounted(() => {});

    effect(
      () => {
        console.log(memos.globals);
      },
      {
        scheduler: () => {
          console.log(456);
        },
      }
    );

    return () => {
      return (
        <div>
          demo{JSON.stringify(memos)}
          <div
            onClick={() => {
              // memos.globals = [{}];
            }}
          >
            改变
          </div>
        </div>
      );
    };
  },
});

export default Demo;
