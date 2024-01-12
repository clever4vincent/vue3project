import { EventBus } from "@/lib/EventBus";
import { getCharacterInfo } from "@/api";
import { useAccountStoreWithOut } from "@/stores";
let currentInterval;
const TIME = 1000 * 30;
function getInterval() {
  let timer = null;
  return {
    start: (fn, time) => {
      timer = setInterval(() => {
        fn();
      }, time);
    },
    stop: () => {
      clearInterval(timer);
    },
  };
}
export async function initUseInterval() {
  currentInterval = getInterval();
  EventBus.on("startQueryLevelThread", () => {
    console.log("startQueryLevelThread");
    currentInterval.stop();
    currentInterval.start(async () => {
      // EventBus.emit("interval");
      let result = true;
      await useAccountStoreWithOut().batchAccountsOperation(async (thirdToken) => {
        await getCharacterInfo(thirdToken).then((res) => {
          console.log("level:", res.level);
          result &= parseInt(res.level) > 2;
        });
      });
      if (result) {
        console.log("等级都大于2，停止轮询");
        EventBus.emit("initCharacterAll");
        currentInterval.stop();
      }
    }, TIME);
  });
}
export function destroyUseInterval() {
  currentInterval.stop();
  currentInterval = null;
  EventBus.off("startQueryLevelThread");
}
