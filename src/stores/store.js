import { reactive } from 'vue'

export const store  = reactive({
  theme: 'light',
  toDark() {
    this.theme = 'dark'
  },
  toLight() {
    this.theme = 'light'
  },
})


