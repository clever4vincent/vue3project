import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', () => {
  const theme = ref(
    document.documentElement.classList.contains('van-theme-dark') ? 'dark' : 'light'
  )

  function toDark() {
    theme.value = 'dark'
  }
  function toLight() {
    theme.value = 'light'
  }

  return { theme, toLight, toDark }
})
