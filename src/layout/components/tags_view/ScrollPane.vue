<!--
 * @Description:
 * @Author: ZY
 * @Date: 2021-01-05 19:11:34
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-09 11:00:55
-->
<!--  定义滚动条容器的引用， 监听鼠标滚轮事件，调用 handleScroll 方法进行处理 -->
<template>
  <el-scrollbar
    ref="scrollContainerRef"
    :vertical="false"
    class="scroll-container"
    @wheel.prevent="handleScroll"
  >
    <!--  表示滚动条容器内部可以插入任意内容 -->
    <slot />
  </el-scrollbar>
</template>

<script lang="ts">
import {
  defineComponent,
  reactive,
  ref,
  toRefs,
  computed,
  onMounted,
  onBeforeUnmount,
  getCurrentInstance,
} from "vue";
export default defineComponent({
  emits: ["scroll"], // 定义了一个名为 scroll 的自定义事件
  setup(_, context) {
    const scrollContainerRef = ref(null); // 定义了一个名为 scrollContainerRef 的变量，用于保存滚动条容器的引用
    const scrollWrapper = computed(() => { // 定义了一个名为 scrollWrapper 的计算属性，用于获取滚动条容器内部的 wrap 元素
      return (scrollContainerRef.value as any).$refs.wrapRef as HTMLElement;
    });
    const { ctx } = getCurrentInstance() as any; // 获取当前实例（组件）的上下文
    const tagSpacing = 4; // 定义标签之间的间距

    const state = reactive({  // 定义了一个名为 state 的响应式对象，用于保存组件的状态
      handleScroll: (e: WheelEvent) => { // 定义了一个名为 handleScroll 的方法，用于处理鼠标滚轮事件
        const eventDelta = (e as any).wheelDelta || -e.deltaY * 40;
        scrollWrapper.value.scrollLeft =
          scrollWrapper.value.scrollLeft + eventDelta / 4;
      },
      moveToCurrentTag: (currentTag: HTMLElement) => { // 定义了一个名为 handleScroll 的方法，用于处理鼠标滚轮事件
        const container = (scrollContainerRef.value as any).$el as HTMLElement; // 获取滚动条容器元素
        const containerWidth = container.offsetWidth; // 获取滚动条容器元素
        const tagList = ctx.$parent.$refs.tag as any[]; // 获取父组件中所有的标签元素
        let fristTag = null; // 定义了一个名为 fristTag 的变量，用于保存第一个标签元素
        let lastTag = null; // 定义了一个名为 lastTag 的变量，用于保存最后一个标签元素

        // 找到第一个标签元素和最后一个标签元素
        if (tagList.length > 0) {
          fristTag = tagList[0];
          lastTag = tagList[tagList.length - 1];
        }

        if (fristTag === currentTag) {  // 找到第一个标签元素和最后一个标签元素
          scrollWrapper.value.scrollLeft = 0;
        } else if (lastTag === currentTag) {  // 如果当前标签是最后一个标签，将滚动条滚动到最右边
          scrollWrapper.value.scrollLeft =
            scrollWrapper.value.scrollWidth - containerWidth; 
        } else { // 如果当前标签不是第一个标签也不是最后一个标签，将当前标签滚动到可视区域内
          // 找到前一个标签和后一个标签
          const currentIndex = tagList.findIndex((item) => item === currentTag); 
          const prevTag = tagList[currentIndex - 1];
          const nextTag = tagList[currentIndex + 1];

          // 计算后一个标签在滚动条中的偏移量
          const afterNextTagOffsetLeft =
            nextTag.$el.offsetLeft + nextTag.$el.offsetWidth + tagSpacing;
          // 计算后一个标签在滚动条中的偏移量
          const beforePrevTagOffsetLeft = prevTag.$el.offsetLeft - tagSpacing;

          // 如果后一个标签在可视区域的右侧，则将滚动条向右滚动，使得后一个标签出现在可视区域的最左边
          if (
            afterNextTagOffsetLeft >
            scrollWrapper.value.scrollLeft + containerWidth
          ) {
            scrollWrapper.value.scrollLeft =
              afterNextTagOffsetLeft - containerWidth;
          } else if (beforePrevTagOffsetLeft < scrollWrapper.value.scrollLeft) {
             // 如果前一个标签在可视区域的左侧，则将滚动条向左滚动，使得前一个标签出现在可视区域的最左边
            scrollWrapper.value.scrollLeft = beforePrevTagOffsetLeft;
          }
        }
      },
    });

    const emitScroll = () => { // 定义了一个名为 emitScroll 的方法，用于触发 scroll 事件
      context.emit("scroll");
    };

    onMounted(() => { // 在组件挂载后，为滚动条容器内部的 wrap 元素添加滚动事件监听器
      scrollWrapper.value.addEventListener("scroll", emitScroll, true);
    });

    onBeforeUnmount(() => { // 在组件挂载后，为滚动条容器内部的 wrap 元素添加滚动事件监听器
      scrollWrapper.value.removeEventListener("scroll", emitScroll);
    });

    return { // 返回所有需要暴露给模板的变量和方法
      scrollContainerRef,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.scroll-container {
  .el-scrollbar__bar {
    bottom: 0px; // 设置滚动条的位置为底部
  }

  .el-scrollbar__wrap {
    height: 49px; // 设置滚动条容器内部的 wrap 元素高度为 49 像素
  }
}
</style>

<style lang="scss" scoped>
.scroll-container {
  white-space: nowrap; // 禁用自动换行
  position: relative; // 设置滚动条容器为相对定位
  overflow: hidden; // 隐藏溢出部分
  width: 100%; // 设置滚动条容器的宽度为 100%
}
</style>
