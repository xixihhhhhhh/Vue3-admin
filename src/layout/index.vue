<!--
 * @Description: app 布局入口
-->

<template>
  <div :class="classObj" class="app-wrapper">
    <!-- 侧边栏背景 -->
    <div  
      v-if="classObj.mobile && sidebar.opened"
      class="drawer-bg"
      @click="handleClickOutside"
    />
    <!-- 侧边栏 -->
    <Sidebar class="sidebar-container" />
    <!-- 主体内容 -->
    <div :class="{ hasTagsView: showTagsView }" class="main-container">
      <!-- 顶部导航栏和标签栏 -->
      <div :class="{ 'fixed-header': fixedHeader }">
        <Navbar />
        <TagsView v-if="showTagsView" />
      </div>
      <!-- 应用主体区域 -->
      <AppMain />
    </div>
  </div>
</template>

<script lang="ts">
import { DeviceType } from "@/stores/modules/app";
import {
  computed,
  defineComponent,
  onBeforeMount,
  onBeforeUnmount,
  onMounted,
  reactive,
  toRefs,
} from "vue";
import { useStore } from "@/stores";
import Navbar from './components/navigation_bar/Index.vue'
import { AppMain, Settings, TagsView, Sidebar } from "./components";
import RightPanel from "@/components/right_panel/Index.vue";
import resize from "./resize";
export default defineComponent({
  name: "Layout",
  components: {
    AppMain,
    Navbar,
    RightPanel,
    Settings,
    Sidebar,
    TagsView,
  },
  setup() {
    const store = useStore();
    const {
      sidebar,
      device,
      addEventListenerOnResize,
      resizeMounted,
      removeEventListenerResize,
      watchRouter,
    } = resize();
    const state = reactive({
      // 因此，当点击页面的空白处时，该箭头函数将被调用，从而关闭侧边栏。
      handleClickOutside: () => {
        store.app.closeSidebar(false);
      },
    });

    // 这个计算属性的作用是为了方便模板中绑定class，通过绑定class来实现不同样式的展示效果。
    const classObj = computed(() => {
      
      return {
        hideSidebar: !sidebar.value.opened,
        openSidebar: sidebar.value.opened,
        withoutAnimation: sidebar.value.withoutAnimation,
        mobile: device.value === DeviceType.Mobile,
      };
    });

    const showSettings = computed(() => {
      return store.settings.showSettings;
    });
    const showTagsView = computed(() => {
      return store.settings.showTagsView;
    });
    const fixedHeader = computed(() => {
      return store.settings.fixedHeader;
    });

    watchRouter();
    onBeforeMount(() => {
      addEventListenerOnResize();
    });

    onMounted(() => {
      resizeMounted();
    });

    onBeforeUnmount(() => {
      removeEventListenerResize();
    });
    return {
      classObj,
      sidebar,
      showSettings,
      showTagsView,
      fixedHeader,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
.app-wrapper {
  @include clearfix;
  position: relative;
  height: 100%;
  width: 100%;
}

.drawer-bg {
  background: #000;
  opacity: 0.3;
  width: 100%;
  top: 0;
  height: 100%;
  position: absolute;
  z-index: 999;
}

.main-container {
  min-height: 100%;
  transition: margin-left 0.28s;
  margin-left: $sideBarWidth;
  position: relative;
}

.sidebar-container {
  transition: width 0.28s;
  width: $sideBarWidth !important;
  height: 100%;
  position: fixed;
  font-size: 0px;
  top: 0;
  bottom: 0;
  left: 0;
  z-index: 1001;
  overflow: hidden;
}

.fixed-header {
  position: fixed;
  top: 0;
  right: 0;
  z-index: 9;
  width: calc(100% - #{$sideBarWidth});
  transition: width 0.28s;
}

.hideSidebar {
  .main-container {
    margin-left: 54px;
  }

  .sidebar-container {
    width: 54px !important;
  }

  .fixed-header {
    width: calc(100% - 54px);
  }
}

/* for mobile response 适配移动端 */
.mobile {
  .main-container {
    margin-left: 0px;
  }

  .sidebar-container {
    transition: transform 0.28s;
    width: $sideBarWidth !important;
  }

  &.openSidebar {
    position: fixed;
    top: 0;
  }

  &.hideSidebar {
    .sidebar-container {
      pointer-events: none;
      transition-duration: 0.3s;
      transform: translate3d(-$sideBarWidth, 0, 0);
    }
  }

  .fixed-header {
    width: 100%;
  }
}

.withoutAnimation {
  .main-container,
  .sidebar-container {
    transition: none;
  }
}
</style>
