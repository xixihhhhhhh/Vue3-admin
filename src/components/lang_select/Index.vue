<!--
 * @Description: 语言选择
 * @Author: ZY
 * @Date: 2020-12-23 20:06:29
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-25 20:05:16
-->
<template>
  <div>
    <el-dropdown>
      <svg
        class="icon"
        aria-hidden="true"
        font-size="20px"
        :class="{'svg-color': isWhite}"
      >
        <use xlink:href="#iconlanguage" />
      </svg>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item
            v-for="item in languages"
            :key="item.value"
            :disabled="language===item.value"
          >
            <span @click="handleSetLanguage(item.value)">{{ item.name }}</span>
          </el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>

<script lang="ts">
import { useStore } from '@/stores'
import { computed, defineComponent, reactive, toRefs } from 'vue'
import { ElMessage } from 'element-plus'
type Language = {
    name: string
    value: string
}

export default defineComponent({
  props: {
    isWhite: {
      type: Boolean,
      default: false
    }
  },
  setup() {
    const store = useStore()

    const state = reactive({
      languages: [{ name: 'en', value: 'en' }, { name: '中文', value: 'zh-cn' }] as Array<Language>,
      handleSetLanguage: (lang: string) => {
        store.app.setLanguage(lang)
        ElMessage({
          message: 'Switch Language Success',
          type: 'success'
        })
      }
    })
    const language = computed(() => {
      return store.app.language
    })
    return {
      ...toRefs(state),
      language
    }
  }
})

</script>

<style lang="scss" scoped>
.svg-color{
  fill: white;
}
</style>
