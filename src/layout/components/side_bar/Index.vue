<!--
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-24 10:35:47
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-27 09:04:08
-->
<template>
  <!-- 绑定class，如果showLogo为true，则添加名为'has-logo'的class -->
  <div :class="{ 'has-logo': showLogo }">
    <!-- 如果showLogo为true，则展示SidebarLogo组件 -->
    <SidebarLogo v-if="showLogo" :collapse="isCollapse" />
    <!-- el-scrollbar组件，用于实现滚动条功能 -->
    <el-scrollbar wrap-class="scrollbar-wrapper">
      <!-- el-menu组件，用于展示菜单 -->
      <el-menu
        :collapse="!isCollapse"
        :unique-opened="false"
        :default-active="activeMenu"
        background-color="#545c64"
        text-color="#fff"
        :active-text-color="menuActiveTextColor"
        mode="vertical"
      >
        <SidebarItem
          v-for="route in routes"
          :key="route.path"
          :item="route"
          :base-path="route.path"
          :is-collapse="isCollapse"
        />
      </el-menu>
    </el-scrollbar>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import SidebarItem from "./SidebarItem.vue";
import SidebarLogo from "./SidebarLogo.vue";
import { useStore } from "@/stores";
import { useRoute } from "vue-router";

export default defineComponent({
  components: {
    SidebarItem,
    SidebarLogo,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const sidebar = computed(() => {
      return store.app.sidebar;
    });
    const routes = computed(() => {
      console.log(store.permission.routes);
      return store.permission.routes;
    });
    const showLogo = computed(() => {
      return store.settings.showSidebarLogo;
    });

    // 动态设置侧边栏选中项的文字颜色。
    const menuActiveTextColor = computed(() => {
      if (store.settings.sidebarTextTheme) {
        return store.settings.theme;
      }
    });

    // 获取当前选中的菜单项。如果当前路由的meta中有activeMenu属性，
    // 则使用activeMenu作为选中菜单项，否则使用当前路由的path作为选中菜单项。
    const activeMenu = computed(() => {
      const { meta, path } = route;
      if (meta !== null || meta !== undefined) {
        if (meta.activeMenu) {
          return meta.activeMenu;
        }
      }
      return path;
    });

    const isCollapse = computed(() => {
      return sidebar.value.opened;
    });

    return {
      sidebar,
      routes,
      showLogo,
      menuActiveTextColor,
      activeMenu,
      isCollapse,
    };
  },
});
</script>

<style lang="scss">
.sidebar-container {
  // reset element-ui css
  .horizontal-collapse-transition {
    transition: 0s width ease-in-out, 0s padding-left ease-in-out,
      0s padding-right ease-in-out;
  }

  .scrollbar-wrapper {
    overflow-x: hidden !important;
  }

  .el-scrollbar__view {
    height: 100%;
  }

  .el-scrollbar__bar {
    &.is-vertical {
      right: 0px;
    }

    &.is-horizontal {
      display: none;
    }
  }
}
</style>

<style lang="scss" scoped>
.el-scrollbar {
  height: 100%;
}

.has-logo {
  .el-scrollbar {
    height: calc(100% - 50px);
  }
}

.el-menu {
  border: none;
  height: 100%;
  width: 100% !important;
}
</style>
