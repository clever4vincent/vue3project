import { login } from "@/api";
import { useTokenStoreWithOut, useAccountStore, useStore } from "@/stores";
import { EventBus } from "@/lib/EventBus";
export async function loginProgress(user) {
  return new Promise((resolve, reject) => {
    if (!window.vaptchaObj) {
      reject("验证模块未加载!");
      return;
    }
    window.vaptchaObj.validate();
    // 监听验证码验证成功事件
    EventBus.on("vaptchaPass", async (reuslt) => {
      if (reuslt) {
        const serverToken = window.vaptchaObj.getServerToken();
        try {
          await login({ ...user, ...serverToken }).then(async (res) => {
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
