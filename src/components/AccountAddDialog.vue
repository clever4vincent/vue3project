<!-- 加载中遮罩模板 -->
<template>
  <van-form ref="formRef">
    <van-cell-group inset>
      <van-field v-model="username" required label="账号" placeholder="请输入账号" :rules="[{ required: true, message: '请输入账号' }]" />
      <van-field v-model="password" required label="密码" placeholder="请输入密码" :rules="[{ required: true, message: '请输入密码' }]" />
      <div v-if="mode == DialogModeEnum.SUB_MULTIPLE_ADD">
        <div class="tips">尾号会加在账号的后面</div>
        <van-field v-model="start" required label="起始尾号" placeholder="" :rules="[{ required: true, message: '请输入起始尾号' }]" />
        <van-field v-model="end" required label="结束尾号" placeholder="" :rules="[{ required: true, message: '请输入结束尾号' }]" />
      </div>
    </van-cell-group>
  </van-form>
</template>

<script>
// import g from '../lib/g'
import { DialogModeEnum } from "@/enums/appEnum";
import { useAccountStore } from "@/stores";
export default {
  props: ["mode"],
  // props: {
  //     mode: {
  //         type: String,
  //         required: true,
  //     },
  // },
  data() {
    // 校验函数返回 true 表示校验通过，false 表示不通过
    // let validator = (val) => /1\d{10}/.test(val);

    return {
      DialogModeEnum,
      // username: "",
      // phone: "",
      // validator,
    };
  },
  methods: {
    getForm() {
      return this.$refs.formRef; // 这将打印出 van-form 组件的实例
    },
  },
  setup(props) {
    const accountStore = useAccountStore();
    const username = ref("");
    username.value = accountStore.accountNo || "a6669852";
    const password = ref("123456");
    const start = ref(0);
    const end = ref(10);
    const clearFields = () => {
      username.value = "";
      password.value = "";
    };
    const isMatched = () => {
      if (props.mode === DialogModeEnum.SUB_SINGLE_ADD || props.mode === DialogModeEnum.MAIN_UPDATE || props.mode === DialogModeEnum.CREATE_ACCOUNT) {
        return !!username.value && !!password.value;
      } else if (props.mode === DialogModeEnum.SUB_MULTIPLE_ADD) {
        return !!username.value && !!password.value && !!start.value && !!end.value && start.value <= end.value;
      }
    };

    return {
      isMatched,
      accountStore,
      clearFields,
      password,
      username,
      start,
      end,
    };
  },
};
// 另一种写法 写在父组件中 用JSX 记得要在script标签中加上lang="jsx"
// const beforeClose = (action) =>
//     new Promise((resolve) => {
//         if (action === "confirm") {
//             if (username.value && password.value) {
//                 // 拦截确认操作
//                 username.value = "";
//                 password.value = "";
//                 resolve(true);
//             } else {
//                 // dialogRef.value.form;
//                 formRef.value.validate();
//                 // 拦截取消操作
//                 resolve(false);
//             }
//         } else {
//             formRef.value.resetValidation();
//             // 拦截取消操作
//             resolve(true);
//         }
//     });

// const render = () => {
//     return (
//         <van-form ref={formRef}>
//             <van-cell-group inset>
//                 <van-field
//                     modelValue={username.value}
//                     onUpdate:modelValue={(val) => (username.value = val)}
//                     required
//                     label="账号"
//                     placeholder="请输入账号"
//                     rules={[{ required: true, message: "请输入账号" }]}
//                 />
//                 <van-field
//                     modelValue={password.value}
//                     onUpdate:modelValue={(val) => (password.value = val)}
//                     required
//                     label="密码"
//                     placeholder="请输入密码"
//                     rules={[{ required: true, message: "请输入密码" }]}
//                 />
//             </van-cell-group>
//         </van-form>
//     );
// };
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style rel="stylesheet/scss" lang="scss" scoped>
.tips {
  font-size: 10px;
  text-align: left;
  padding: var(--van-cell-vertical-padding) var(--van-cell-horizontal-padding);
}
</style>
