<!-- 加载中遮罩模板 -->
<template>
  <div :class="['equipment', rarityClass[equipment.rarity]]" v-if="equipment" @click="containerClick">
    <div class="title-bar">
      {{ equipment.name }}
    </div>
    <div class="stats">
      <div class="property">{{ equipmentFilterTypes[equipment.equipmentType] }}</div>
      <div class="property" v-if="equipment.quality">品质: {{ equipment.quality }}%</div>
      <div class="property">物品等级: {{ equipment.itemLevel }}</div>
      <div class="property" v-if="equipment.physicalDamage">物理伤害: {{ equipment.physicalDamage.min }}-{{ equipment.physicalDamage.max }}</div>
      <div class="property" v-if="equipment.criticalStrikeChance">攻击暴击率: {{ equipment.criticalStrikeChance }}%</div>
      <div class="property" v-if="equipment.attackSpeed">每秒攻击次数: {{ equipment.attackSpeed }}</div>
      <div class="property" v-if="equipment.blockChance">格挡几率: {{ equipment.blockChance }}%</div>
      <div class="property" v-if="equipment.armour">护甲值: {{ equipment.armour }}</div>
      <div class="property" v-if="equipment.evasion">闪避值: {{ equipment.evasion }}</div>
      <div class="property" v-if="equipment.energyShield">能量护盾: {{ equipment.energyShield }}</div>
      <div class="property" v-if="equipment.ward">结界: {{ equipment.ward }}</div>
      <!-- <div class="separator" v-if="renderSeparator()"></div> -->
      <template v-if="equipment.requirements">
        <!-- <div class="separator" v-if="renderSeparator()"></div> -->
        <div class="property requirements" :class="{ 'text-error': equipment.isNotAvailable }">
          <span>需求</span>
          <span v-if="equipment.requirements.level">等级 {{ equipment.requirements.level }}</span>
          <span v-if="equipment.requirements.strength">力量 {{ equipment.requirements.strength }}</span>
          <span v-if="equipment.requirements.dexterity">敏捷 {{ equipment.requirements.dexterity }}</span>
          <span v-if="equipment.requirements.intelligence">智慧 {{ equipment.requirements.intelligence }}</span>
        </div>
      </template>
      <template v-if="equipment.sockets">
        <!-- <div class="separator" v-if="renderSeparator()"></div> -->
        <div class="sockets" v-if="equipment.sockets">
          <div :key="i" v-for="(g, i) in equipment.sockets" class="socket-group">
            <div
              :key="i"
              v-for="(s, i) in g"
              class="socket"
              :class="{ red: s.type === 1, green: s.type === 2, blue: s.type === 3, grey: s.type === 0, fill: s.skillId }"
            ></div>
          </div>
        </div>
      </template>
      <template v-if="equipment.fixedMagics">
        <!-- <div class="separator" v-if="renderSeparator()"></div> -->
        <div class="magics">
          <template :key="k" v-for="k in Object.keys(equipment.fixedMagics) || []">
            <div v-html="magics[k] ? magics[k](equipment.fixedMagics[k]) : k"></div>
          </template>
        </div>
      </template>
      <template v-if="equipment.affixes">
        <div class="separator"></div>
        <div class="affix" v-for="affix in equipment.affixes" :key="affix" :class="{ locked: affix.isLocked, crafted: affix.isCrafted }">
          <div class="info">
            <span class="tier" v-if="affix.isCrafted">工艺</span>
            <span class="tier" v-else-if="affix.tier">T{{ affix.tier + " " }}</span>
            <span v-if="affix.type === 1">前缀</span>
            <span v-else-if="affix.type === 2">后缀</span>
            <span class="name">{{ affix.name }}</span>
          </div>
          <div class="magics" v-if="affix.magics">
            <template :key="k" v-for="k in Object.keys(affix.magics) || []">
              <div v-html="magics[k] ? magics[k](affix.magics[k]) : k"></div>
            </template>
          </div>
        </div>
      </template>
      <template v-if="false && equipment.magics">
        <!-- <div class="separator" v-if="renderSeparator()"></div> -->
        <div class="magics" v-if="equipment.magics">
          <template :key="k" v-for="k in Object.keys(equipment.magics) || []">
            <div v-html="magics[k] ? magics[k](equipment.magics[k]) : k"></div>
          </template>
        </div>
      </template>
      <div class="copied" v-if="equipment.isCopy">已复制</div>
      <div class="corrupted" v-if="equipment.corrupted">已腐化</div>
    </div>
    <!-- <div class="affixes" v-if="equipment.affixes">
      <div v-for="a in equipment.affixes" :class="{ prefix: a.type === 1, suffix: a.type === 2 }" v-bind="a">{{ a.name }}</div>
    </div> -->
  </div>
</template>

<script>
// import g from '../lib/g'
import { magics, rarityClass } from "@/lib/data";
import { equipmentFilterTypes } from "@/hooks";
import { useStore } from "@/stores";
export default {
  props: ["equipment"],
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
      // username: "",
      // phone: "",
      // validator,
    };
  },
  methods: {
    renderSeparator() {
      return this.lineCount++ > 0;
    },
    resetLineCount: () => {
      this.lineCount = 0;
    },
  },
  setup(props) {
    const lineCount = ref(0);
    // const store = useStore();
    // const forceUpdate = ref(0);
    // const equipment = reactive(store.equipmentModify);
    // console.log("equipmentModify", equipment);
    // onMounted(() => {
    //   console.log("equipmentModify", equipment);
    // });
    // watch(
    //   () => store.equipmentModify,
    //   (newVal, oldVal) => {
    //     console.log("equipmentModify changed", newVal, oldVal);
    //     // equipment.value = newVal;
    //     // forceUpdate.value++;
    //     //更新dom
    //     // this.$nextTick(() => {
    //     //     this.$refs.equipmentDetailDialog.resetLineCount();
    //     // });
    //   },
    //   { deep: true }
    // );
    // let magics = magics;
    return { lineCount, magics, rarityClass, equipmentFilterTypes };
  },
};

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
.corrupted {
  color: #ff0000;
}

.copied {
  color: forestgreen;
}

.action-bar {
  .action-equip {
    color: #1890ff;
  }
}

.sockets {
  display: flex;
  flex-wrap: wrap;
  flex-direction: row;
  justify-content: center;
  gap: 4px;

  .socket-group {
    border: 2px solid #7f7f7f;
    display: flex;
    border-radius: 4px;
    flex-wrap: wrap;
    flex-direction: row;
  }

  .socket {
    width: 12px;
    height: 12px;
    border: 2px solid #7f7f7f;
    border-radius: 50%;
    margin: 2px;
    // box-shadow: 0 0 3px 3px #1b1b1b;
    background-color: var(--bg1);

    &.red {
      border-color: #d20000;
    }

    &.green {
      border-color: #46a239;
    }

    &.blue {
      border-color: #8888ff;
    }
  }
}

body.light .equipment {
  * .separator {
    // background: none;
    // height: 1px;
    // margin: 3px 0;
    // border-bottom: 1px dashed var(--van-border-color);
  }

  &.normal,
  &.magic,
  &.rare,
  &.unique {
    background: none;
  }

  .title-bar {
    border-bottom: 1px dashed var(--van-border-color);
  }
}

.equipment {
  max-width: 500px;
  min-width: 200px;
  color: #7f7f7f;
  display: flex;
  flex-direction: column;
  overflow: auto;

  .separator {
    background: var(--van-border-color) center no-repeat;
    height: 1px;
    // margin: 1px 0;
  }
  .affix.locked {
    .magics {
      color: var(--fractured-color);
    }
  }

  .affix.crafted {
    .magics {
      color: var(--crafted-color);
    }
  }
  .magics {
    color: var(--magic-color);
  }

  .title-bar {
    line-height: 34px;
    text-align: center;
  }

  &.magic {
    .title-bar {
      color: var(--magic-color);
    }

    .separator {
      background: var(--van-border-color) center no-repeat;
      height: 1px;
      // margin: 1px 0;
    }
  }

  &.rare {
    .title-bar {
      color: var(--rare-color);
    }

    .separator {
      // background: var(--van-border-color) center no-repeat;
      height: 1px;
    }
  }
  .text-error {
    color: var(--error-color) !important;
  }
  &.unique {
    .title-bar {
      color: var(--unique-color);
    }
    .separator {
      background: var(--van-border-color) center no-repeat;
      height: 1px;
      // margin: 1px 0;
    }
  }

  .affixes {
    position: absolute;
    left: 100%;
    top: 0;
    font-size: smaller;
    background-color: var(--bg1);
    box-shadow: 5px 0 5px 0 var(--shadow-color);
    border-radius: 5px;

    .prefix {
      color: #1ba29b;
      text-shadow: 0 0 1px #1ba29b;
    }

    .suffix {
      color: #966400;
      text-shadow: 0 0 1px #966400;
    }

    & > div {
      padding: 2px;
      text-align: center;
      width: 40px;
      border-bottom: 1px var(--border-type) #3b3b3b;

      &:last-child {
        border-bottom: none;
      }
    }
  }

  .stats {
    flex: 1;
    text-align: center;
    background-color: var(--bg1);
    padding: 10px 8px;
    overflow-y: auto;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    position: relative;
  }
  body.light .equipment.magic,
  body.light .equipment.normal,
  body.light .equipment.rare,
  body.light .equipment.unique {
    background: none;
  }

  body.light .equipment .title-bar {
    border-bottom: 1px dashed var(--border-color);
  }

  .equipment {
    max-width: 500px;
    min-width: 200px;
    color: #7f7f7f;
    display: flex;
    flex-direction: column;
    overflow: visible;
  }

  .equipment .separator {
  }

  .equipment .magics {
    color: var(--magic-color);
  }

  .equipment .title-bar {
    line-height: 24px;
    text-align: center;
  }

  .equipment.magic .title-bar {
    color: var(--magic-color);
  }

  .equipment.rare .title-bar {
    color: var(--rare-color);
  }

  .equipment.unique .title-bar {
    color: var(--unique-color);
  }

  .equipment .affixes {
    position: absolute;
    left: 100%;
    top: 0;
    font-size: smaller;
    background-color: var(--bg1);
    box-shadow: 5px 0 5px 0 var(--shadow-color);
    border-radius: 5px;
  }

  .equipment .affixes .prefix {
    color: #1ba29b;
    text-shadow: 0 0 1px #1ba29b;
  }

  .equipment .affixes .suffix {
    color: #966400;
    text-shadow: 0 0 1px #966400;
  }

  .equipment .affixes > div {
    padding: 2px;
    text-align: center;
    width: 40px;
    border-bottom: 1px var(--border-type) #3b3b3b;
  }

  .equipment .affixes > div:last-child {
    border-bottom: none;
  }

  .equipment .stats {
    flex: 1;
    text-align: center;
    background-color: var(--bg1);
    padding: 10px 8px;
    overflow-y: auto;
    border-bottom-left-radius: 10px;
    border-bottom-right-radius: 10px;
    position: relative;
  }

  .requirements {
    span::after {
      content: ", ";
    }

    span:first-child::after {
      content: " ";
    }

    span:last-child::after {
      content: "";
    }
  }
}
</style>
