<template>
  <img :src="src" :srcset="srcset" />
</template>

<script>
/**
 * 图片组件，根据图片名自动寻找对应的图片，具体规则如下：
 *
 * - 使用文件夹 `src/assets/png` 中的 png 图标，png 图标支持多倍图
 */

/**
 * png 图片汇总
 * @type {{ [name: string]: { src?: string, srcset?: string }}} 图标名对应的图片属性
 *
 * @example
 * - src/assets/png/logo.png
 * - src/assets/png/logo@2x.png
 * - src/assets/png/logo@3x.png
 * PNG_ICONS === {
 *   logo: {
 *     src: 'src/assets/png/logo.png',
 *     srcset: 'src/assets/png/logo@2x.png,src/assets/png/logo@3x.png'
 *   }
 * }
 */
const PNG_ICONS = ((images) => {
  const ICONS = Object.create(null);
  /**
   * @type {{ [name: string]: { [dpr: string]: string }}}
   * @example
   * META === {
   *   logo: {
   *     '1x': 'src/assets/png/logo.png',
   *     '2x': 'src/assets/png/logo@2x.png',
   *     '3x': 'src/assets/png/logo@3x.png',
   *   }
   * }
   */
  const META = Object.create(null);
  for (const key of Object.keys(images)) {
    const [, name, dpr = "1x"] = key
      .split("/")
      .pop()
      .split(".")
      .slice(0, -1)
      .join(".")
      .match(/^(.+?)(?:@(\d+x))?$/);
    META[name] = META[name] || Object.create(null);
    META[name][dpr] = images[key];
  }
  for (const name of Object.keys(META)) {
    const dpr2url = META[name];
    ICONS[name] = {};
    const srcset = [];
    for (const dpr of Object.keys(dpr2url).sort((a, b) => parseInt(a) - parseInt(b))) {
      const url = dpr2url[dpr];
      if (dpr === "1x") {
        ICONS[name].src = url;
      } else {
        srcset.push(`${url} ${dpr}`);
      }
    }
    if (srcset.length > 0) {
      ICONS[name].srcset = srcset.join(",");
    }
  }
  return ICONS;
})(import.meta.glob("@/assets/png/*.png", { eager: true, as: "url" }));

export default {
  props: {
    /** 图标名 */
    name: String,
  },
  computed: {
    src() {
      return PNG_ICONS[this.name]?.src;
    },
    srcset() {
      return PNG_ICONS[this.name]?.srcset;
    },
  },
};
</script>

<style lang="scss" scoped>
img {
  vertical-align: middle;
}
</style>
