<!-- 加载中遮罩模板 -->
<template>
  <div v-show="isShow || show" class="loading-mask">
    <div class="tip">
      <!--<i class="fa fa-spinner fa-spin"></i>-->
      <!--{{tip}}-->
    </div>
  </div>
</template>

<script>
// import g from '../lib/g'

export default {
  props: {
    show: null
  },
  data() {
    return {
      tip: '载入中...',
      isShow: false
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss">
.loading-mask {
  @import '@/assets/scss/common';
  @extend %abso-trbl;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 1001;
  background-color: transparent;
  text-align: center;
  .tip {
    @include position-center(40px);
    overflow: hidden;
    border-radius: 0.5rem;
    background: transparent url(../assets/images/Loading2.gif) no-repeat;
    background-size: 28px 28px;
    background-position: center;
    /*opacity: .7;*/
    // box-shadow: 1px 1px 10px rgba(0, 0, 0, .62);
    //color: $font-disabled-color;
    //font-size: .5rem;
    //.fa {
    //  padding: .3rem;
    //  display: block;
    //  font-size: 2.7rem;
    //  line-height: 2.7rem;
    //}
  }
}
</style>
