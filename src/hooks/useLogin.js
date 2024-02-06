import { login } from "@/api";
import { useTokenStoreWithOut, useAccountStore, useStore } from "@/stores";
import { EventBus } from "@/lib/EventBus";
import { EventSourcePolyfill } from "event-source-polyfill";
import { getAppEnvConfig } from "@/utils/env";
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
// let eventStream = null;
export async function keepLoginAlive(token) {
  return new Promise((resolve, reject) => {
    // if (eventStream) eventStream.close();
    let eventStream = new EventSourcePolyfill(`${getAppEnvConfig().VITE_GLOB_API_URL}/character/sse`, {
      headers: {
        Authorization: "Bearer " + token,
      },
    });
    eventStream.addEventListener("character_update", (e) => {
      const data = JSON.parse(e.data);
      // console.log("character_update", data);
      eventStream.close();
      eventStream = null;
      resolve();
    });
    eventStream.addEventListener("error", () => {
      console.log(" error");
      eventStream = null;
      reject();
    });
  });
}
