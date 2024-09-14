<template>
  <form class="popup-prompt-window" v-if="isOpen">
    <h3>{{ title }}</h3>
    <div class="body">
      <div :class="{ row: (parts.row === true) }"
        v-for="(parts, index) of body" :key="index"
      >
        <h4 v-if="parts.type === 'title'">{{ parts.text }}</h4>
        <label v-else-if="parts.type === 'input'" :for="parts.name">
          <input type="text" autocomplete="off"
            :name="parts.name" :id="parts.name"
            v-model="vmList[vmIdxTable[index]]"
            @change="onInputChange(index)"
          >
        </label>
        <input type="button" :class="{ centering: (parts.centering === true)}"
          v-else-if="parts.type === 'button'"
          :name="parts.name" :id="parts.name" :value="parts.value"
          @click="onButtonClick(index)"
        >
      </div>
    </div>
    <div class="footer">
      <input type="reset" :value="resetLabel" @click="onReset">
      <input type="submit" :value="submitLabel" @click="onSubmit">
    </div>
  </form>
</template>

<script>
export default {
  name: 'PopupPromptWindow',
  props: {
    title: {
      type: String,
      default: 'POPPED-UP PROMPT WINDOW',
    },
    body: {
      type: Array,
      default: (() => [
        { type: 'title', text: 'INPUT FIELD' },
        { type: 'input', name: 'input-name', value: 'This is input' },
        { type: 'title', text: 'BUTTON FIELD' },
        { type: 'button', name: 'button-name-1', value: 'Push Me' },
        {
          type: 'button', name: 'button-name-3', value: 'Centered', centering: true,
        },
        {
          type: 'button', name: 'button-name-4', value: 'Row', row: true,
        },
        {
          type: 'button', name: 'button-name-5', value: 'Row', row: true,
        },
        { type: 'hidden', name: 'something-id', value: 'x123' },
      ])(),
    },
    submitLabel: {
      type: String,
      default: 'OK',
    },
    resetLabel: {
      type: String,
      default: 'Cancel',
    },
  },
  emits: ['submit', 'reset', 'inputchange', 'buttonclick'],
  data() {
    return {
      vmList: [],
      vmIdxTable: {},
      isOpen: true,
    };
  },
  methods: {
    onInputChange(index) {
      console.log('[PopupPromptWindow] onInputChange. Value: %s. Row:', this.vmList[this.vmIdxTable[index]], this.body[index]);
      this.$emit('inputchange', {
        name: this.body[index].name,
        value: this.vmList[this.vmIdxTable[index]],
      });
    },
    onButtonClick(index) {
      console.log('[PopupPromptWindow] onButtonClick. Row:', this.body[index]);
      this.$emit('buttonclick', {
        name: this.body[index].name,
      });
    },
    onSubmit() {
      const next = [];
      for (let index = 0; index < this.body.length; index += 1) {
        const row = this.body[index];
        if (row.type === 'input') {
          row.value = this.vmList[this.vmIdxTable[index]];
        }
        next.push(row);
      }
      console.log('[PopupPromptWindow] onSubmit. Next: ', next);
      this.$emit('submit', next);
      this.isOpen = false;
    },
    onReset() {
      console.log('[PopupPromptWindow] onReset');
      this.$emit('reset', this.body);
      this.isOpen = false;
    },
  },
  watch: {
  },
  created() {
    const vmScale = this.body.filter((row) => row.type === 'input').length;
    this.vmList = [...Array(vmScale)].map(() => '');
    this.vmIdxTable = {};
    let vmIdxCounter = -1;
    this.body.forEach((row, index) => {
      if (row.type === 'input') {
        vmIdxCounter += 1;
        this.vmIdxTable[index] = vmIdxCounter;
        this.vmList[vmIdxCounter] = row.value;
      }
    });
  },
};
</script>

<style lang="scss" scoped>
@use "@/assets/styles/color.scss" as c;

.popup-prompt-window {
  width: 80vw;
  min-width: 300px;
  max-width: 500px;
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translateX(-50%)
             translateY(-50%);
  padding: 1rem;
  border: 1px solid c.cp("black");
  border-radius: .5rem;
  background-color: c.cp("white");
  box-shadow: 0 10px 25px 0 rgba(0, 0, 0, .5);

  h3 {
    font-size: 1.5rem;
    margin: .5rem 0;
  }
  .body {
    &>.row {
      display: inline-block
    }
    h4 {
      font-size: 1.3rem;
    }
    label {
      display: inline-block;
      margin: .3rem 0;
      width: 100%;
    }
    input[type=text] {
      font-size: 1.2rem;
      width: 100%;
      padding: .4rem .6rem; /*ボックスを大きくする*/
      border-radius: 3px; /*ボックス角の丸み*/
      border: 2px solid #ddd; /*枠線*/
      box-sizing: border-box; /*横幅の解釈をpadding, borderまでとする*/
      transition: .6s;
      &:focus {
        box-shadow: 0 0 5px 0 rgba(0, 0, 0, 1);
        border: 2px solid #FFF !important;
        outline: 0;
      }
    }
    input[type=button] {
      font-size: 1.2rem;
      padding: .2rem .4rem;
      border-radius: 3px;
      // border: 2px solid c.cp("black");
      margin: .2rem 0;
      transition: .6s;

      &.centering {
        display: block;
        margin: .2rem auto;
      }
    }
  }
  .footer {
    display: flex;
    justify-content: space-between;
    input {
      font-size: 1.2rem;
      padding: .2rem .4rem;
      border-radius: 3px;
      transition: .6s;

      &[type=reset] {
        background-color: c.cp("white");
        color: c.cp("blue");
        border: 0;
        &:hover {
          color: c.cp("blue", "hovered");
          cursor: pointer;
        }
      }
      &[type=submit] {
        background-color: c.cp("blue");
        color: c.cp("white");
        border: 0;
        &:hover {
          background-color: c.cp("blue", "hovered");
          cursor: pointer;
        }
      }
    }
  }
}
</style>
