<!-- 加载中遮罩模板 -->
<template>
  <div :class="['equipment', rarityClass[equipment.rarity]]" v-if="equipment" @click="containerClick">
    <div class="title-bar">
      {{ equipment.name }}
    </div>
    <div class="stats">
      <div class="property">{{ types[equipment.equipmentType] }}</div>
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
      <template v-if="equipment.magics">
        <!-- <div class="separator" v-if="renderSeparator()"></div> -->
        <div class="magics" v-if="equipment.magics">
          <template :key="k" v-for="k in Object.keys(equipment.magics) || []">
            <div v-html="magics[k] ? magics[k](equipment.magics[k]) : k"></div>
          </template>
        </div>
      </template>
    </div>
    <!-- <div class="affixes" v-if="equipment.affixes">
      <div v-for="a in equipment.affixes" :class="{ prefix: a.type === 1, suffix: a.type === 2 }" v-bind="a">{{ a.name }}</div>
    </div> -->
  </div>
</template>

<script>
// import g from '../lib/g'
import { magics, rarityClass } from "@/lib/data";
const types = {
  1: "单手剑",
  2: "单手斧",
  4: "法杖",
  8: "爪",
  16: "匕首",
  32: "细剑",
  64: "单手锤",
  128: "短杖",
  256: "符文匕首",
  512: "弓",
  1024: "长杖",
  2048: "双手剑",
  4096: "双手斧",
  8192: "双手锤",
  16384: "战杖",
  32768: "手套",
  65536: "手套",
  131072: "手套",
  262144: "手套",
  524288: "手套",
  1048576: "手套",
  2097152: "鞋子",
  4194304: "鞋子",
  8388608: "鞋子",
  16777216: "鞋子",
  33554432: "鞋子",
  67108864: "鞋子",
  134217728: "胸甲",
  268435456: "胸甲",
  536870912: "胸甲",
  1073741824: "胸甲",
  2147483648: "胸甲",
  4294967296: "胸甲",
  8589934592: "胸甲",
  17179869184: "头部",
  34359738368: "头部",
  68719476736: "头部",
  137438953472: "头部",
  274877906944: "头部",
  549755813888: "头部",
  1099511627776: "盾牌",
  2199023255552: "盾牌",
  4398046511104: "盾牌",
  8796093022208: "盾牌",
  17592186044416: "盾牌",
  35184372088832: "盾牌",
  70368744177664: "箭袋",
  140737488355328: "腰带",
  281474976710656: "项链",
  562949953421312: "戒指",
};
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
    let lineCount = 0;
    // let magics = magics;
    return { lineCount, magics, rarityClass, types };
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
  overflow: visible;

  .separator {
    background: var(--van-border-color) center no-repeat;
    height: 1px;
    // margin: 1px 0;
  }

  .magics {
    color: var(--magic-color);
  }

  .title-bar {
    line-height: 34px;
    text-align: center;
  }

  &.normal {
    background:
      url("../assets/header-normal-left.webp") top left no-repeat,
      url("../assets/header-normal-right.webp") top right no-repeat,
      url("../assets/header-normal-middle.webp") top center repeat-x;
  }

  &.magic {
    .title-bar {
      color: var(--magic-color);
    }

    background:
      url("../assets/header-magic-left.webp") top left no-repeat,
      url("../assets/header-magic-right.webp") top right no-repeat,
      url("../assets/header-magic-middle.webp") top center repeat-x;

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
    line-height: 34px;
    text-align: center;
  }

  .equipment.normal {
  }

  .equipment.magic {
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
