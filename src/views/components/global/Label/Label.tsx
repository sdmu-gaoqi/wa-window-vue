const Label = defineComponent({
  props: ["label"],
  setup(p: { label: string }) {
    return () => {
      return <span className="text-[--vscode-focusBorder]">{p.label}：</span>;
    };
  },
});

export default Label;
