<template>
    <input class="dialog-input" ref="inputRef" type="text" style="text-align: right;"/>
  </template>
  
  <script>
  import { useCurrencyInput } from 'vue-currency-input'
  import { watchDebounced } from '@vueuse/core'
  import { watch } from 'vue'
  
  export default {
    name: 'DebouncedCurrencyInput',
    props: {
      modelValue: Number,
      options: Object,
    },
    setup (props, { emit }) {
      const { inputRef, numberValue, setValue } = useCurrencyInput(props.options, false)
  
      watchDebounced(numberValue, (value) => emit('update:modelValue', value), { debounce: 1000 })

      watch(
        () => props.modelValue,
        (value) => {
          setValue(value)
        }
      )
      return { inputRef }
    }
  }
  </script>

  <style scoped>
  @import url("../../css/base/input.css");
  </style>