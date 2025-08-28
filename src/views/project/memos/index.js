class Vue {
  constructor(config) {
    this.vm = this;
    this.data = config.data;
    this.el = document.querySelector(config.el);

    proxy(this, this.data);

    new Observer(config.data);

    new Compiler(this);
  }
}

class Compiler {
  constructor(vm) {
    this.vm = vm;
    this.el = vm.el;
    this.complier(this.el);
  }

  complier(el) {
    const dom = el.childNodes;

    Array.from(dom).forEach((node) => {
      switch (node.nodeType) {
        case 1:
          break;
        case 3:
          this.complierText(node);
          break;
      }
      if (node.childNodes && node.childNodes.length > 0) {
        this.complier(node);
      }
    });
  }

  complierText(node) {
    const value = node.textContent?.trim();
    const reg = /\{\{(.+?)\}\}/g;
    const tokens = [];

    let index,
      result,
      lastIndex = 0;
    while ((result = reg.exec(value))) {
      index = result.index;

      if (index > lastIndex) {
        tokens.push(value.slice(lastIndex, index));
      }

      const key = result[1]?.trim();
      tokens.push(this.vm[key]);

      lastIndex = index + result[0].length;

      const pops = tokens.length - 1;

      new Watch(this.vm, key, (newValue) => {
        tokens[pops] = newValue;
        node.textContent = tokens.join("");
      });
    }
    if (lastIndex < value.length) {
      tokens.push(value.slice(lastIndex));
    }
    if (tokens.length) {
      node.textContent = tokens.join("");
    }
  }
}

class Watch {
  constructor(vm, key, callback) {
    this.vm = vm;
    this.key = key;
    this.callback = callback;

    Dep.target = this;
    this.oldValue = vm[key];
    Dep.target = null;
  }

  update() {
    this.callback(this.vm[this.key]);
  }
}

class Dep {
  constructor(data) {
    this.subs = [];
  }

  addSub(sub) {
    this.subs.push(sub);
  }

  notify() {
    this.subs.forEach((sub) => sub.update());
  }
}

class Observer {
  constructor(data) {
    this.data = data;
    this.dep = new Dep();
    this.walk(this.data);
  }

  walk(data) {
    Object.keys(data).forEach((key) => {
      const dep = this.dep;
      defineProperty(data, key, data[key], dep);
    });
  }
}

function defineProperty(data, key, value, dep) {
  if (typeof value === "object" && value) {
    return new Observer(value);
  }

  Object.defineProperty(data, key, {
    enumerable: true,
    configurable: true,
    get() {
      Dep.target && dep.addSub(Dep.target);
      return value;
    },
    set(newValue) {
      value = newValue;
      if (typeof value === "object" && newValue) {
        return new Observer(value);
      }
      dep.notify();
    },
  });
}

function proxy(target, data) {
  Object.keys(data).forEach((key) => {
    Object.defineProperty(target, key, {
      enumerable: true,
      configurable: true,
      get: () => {
        // if (typeof data[key] === "object" && data[key]) {
        //   return proxy(data[key]);
        // }
        return data[key];
      },
      set: (newValue) => {
        data[key] = newValue;
      },
    });
  });
}

window.Vue = Vue;
