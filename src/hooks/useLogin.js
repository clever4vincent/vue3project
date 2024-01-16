import { login } from "@/api";
import { useTokenStoreWithOut, useAccountStore, useStore } from "@/stores";
import { EventBus } from "@/lib/EventBus";
export async function loginProgress(user) {
  return new Promise((resolve, reject) => {
    // window.vaptchaObj.validate();
    EventBus.emit("validate");
    // 监听验证码验证成功事件
    EventBus.on("vaptchaPass", async (reuslt) => {
      if (reuslt) {
        // const serverToken = window.vaptchaObj.getServerToken();
        // login({ticket: res.ticket, randStr: res.randstr})
        try {
          await login({ ...user, ...reuslt }).then(async (res) => {
            if (res.token) {
              useTokenStoreWithOut().setToken(res.token);
              // await useTokenStore()
            }
            resolve(res);
          });
        } catch (error) {
          reject("出错了" + error);
        }
      } else {
        reject("验证码取消");
      }

      EventBus.off("vaptchaPass");
    });
  });
}
