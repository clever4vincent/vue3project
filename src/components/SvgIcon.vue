<template>
  <svg width="1em" height="1em" aria-hidden="true">
    <use :xlink:href="`#icon-${name}`"></use>
  </svg>
</template>

<script>
// 生成雪碧图DOM节点并插入文档
import "virtual:svg-icons-register";

export default {
  props: {
    /** 图标名 */
    name: String,
  },
};
</script>

<style lang="scss" scoped>
svg {
  vertical-align: middle;
}
</style>
