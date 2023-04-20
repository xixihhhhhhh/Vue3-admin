<!--
 * @Description: 侧边栏item
 * @Author: ZY
 * @Date: 2020-12-25 11:34:00
 * @LastEditors: scy😊
 * @LastEditTime: 2021-01-25 08:47:38
-->

<template>
  <!-- 首先，通过v-if指令判断item.meta或item.meta.hidden是否存在，如果存在则继续渲染，否则不渲染。 -->
  <!-- 接下来，通过:class指令绑定一个class，
  数组中的第一项是根据isCollapse的值来判断是否使用'simple-mode'或'full-mode'类，
  第二项是当该菜单项为一级菜单时，添加'first-level'类。 -->
  <div
    v-if="!item.meta || !item.meta.hidden"
    :class="[
      { 'first-level': isFirstLevel },
    ]"
  >
    <!-- 只有一个子路由需要展示 -->
    <template
      v-if="!alwaysShowRootMenu && theOnlyOneChild && !theOnlyOneChild.children"
    >
      <SidebarItemLink
        v-if="theOnlyOneChild.meta"
        :to="resolvePath(theOnlyOneChild.path)"
      >
        <!-- 设置菜单项的 index 为路由路径 -->
        <el-menu-item
          :index="resolvePath(theOnlyOneChild.path)"
          :class="{ 'submenu-title-noDropdown': isFirstLevel }"
        >
          <!-- 如果该子菜单项有 icon 图标，则渲染图标 -->
          <svg
            v-if="theOnlyOneChild.meta.icon"
            class="icon"
            aria-hidden="true"
            font-size="17px"
          >
            <use :xlink:href="theOnlyOneChild.meta.icon" />
          </svg>
          <span v-if="theOnlyOneChild.meta.title" >{{
            theOnlyOneChild.meta.title
          }}</span>
        </el-menu-item>
      </SidebarItemLink>
    </template>
    <el-sub-menu v-else :index="resolvePath(item.path)" teleported>
      <template #title>
        <svg
          v-if="item.meta && item.meta.icon"
          class="icon"
          aria-hidden="true"
          font-size="16px"
        >
          <use :xlink:href="item.meta.icon" />
        </svg>
        <span v-if="item.meta && item.meta.title">{{ item.meta.title }}</span>
      </template>
      <template v-if="item.children">
        <sidebar-item
          v-for="child in item.children"
          :key="child.path"
          :item="child"
          :is-collapse="isCollapse"
          :is-first-level="false"
          :base-path="resolvePath(child.path)"
          class="nest-menu"
        />
      </template>
    </el-sub-menu>
  </div>
</template>

<script lang="ts">
import path from "path";
import { computed, defineComponent } from "vue";
import type { RouteRecordRaw } from "vue-router";
import type { PropType } from "vue";
import { isExternal } from "@/utils/validate";
import SidebarItemLink from "./SidebarItemLink.vue";
export default defineComponent({
  props: {
    item: {
      type: Object as PropType<RouteRecordRaw>,
      required: true,
    },
    isCollapse: {
      type: Boolean,
      required: false,
    },
    isFirstLevel: {
      type: Boolean,
      default: true,
    },
    basePath: {
      type: String,
      required: true,
    },
  },
  components: {
    SidebarItemLink,
  },
  setup(props) {
    const alwaysShowRootMenu = computed(() => {
      if (props.item.meta && props.item.meta.alwaysShow) {
        return true;
      } else {
        return false;
      }
    });

    // 将过滤后的子项数组的长度作为计算属性的值返回。
    const showingChildNumber = computed(() => {
      if (props.item.children) {
        const showingChildren = props.item.children.filter((item) => {
          if (item.meta && item.meta.hidden) {
            return false;
          } else {
            return true;
          }
        });
        return showingChildren.length;
      }
      return 0;
    });

    // 获取当前菜单项的第一个未被隐藏的子菜单项（如果有的话），以便在侧边栏中展示该子菜单项。
    const theOnlyOneChild = computed(() => {
      if (showingChildNumber.value > 1) {
        return null;
      }
      if (props.item.children) {
        for (const child of props.item.children) {
          if (!child.meta || !child.meta.hidden) {
            return child;
          }
        }
      }
      // If there is no children, return itself with path removed,
      // because this.basePath already conatins item's path information
      return { ...props.item, path: "" };
    });

    // 将routePath拼接到props.basePath后面，并返回新的路径字符串
    const resolvePath = (routePath: string) => {
      if (isExternal(routePath)) {
        return routePath;
      }
      if (isExternal(props.basePath)) {
        return props.basePath;
      }
      if (props.basePath === '/'){
        return '/dashboard'
      }
      return `${props.basePath}/${routePath}`;
    };

    return {
      alwaysShowRootMenu,
      showingChildNumber,
      theOnlyOneChild,
      resolvePath,
    };
  },
});
</script>

<style lang="scss" scoped>
.el-submenu.is-active > .el-submenu__title {
  color: $subMenuActiveText !important;
}

.full-mode {
  .nest-menu .el-submenu > .el-submenu__title,
  .el-submenu .el-menu-item {
    min-width: $sideBarWidth !important;
    background-color: $subMenuBg !important;

    &:hover {
      background-color: $subMenuHover !important;
    }
  }
}

.simple-mode {
  &.first-level {
    .submenu-title-noDropdown {
      padding: 0 !important;
      position: relative;

      .el-tooltip {
        padding: 0 !important;
      }
    }

    .el-submenu {
      overflow: hidden;

      & > .el-submenu__title {
        padding: 0px !important;

        .el-submenu__icon-arrow {
          display: none;
        }

        & > span {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<style lang="scss" scoped>
svg {
  margin-right: 16px;
}

.simple-mode {
  svg {
    margin-left: 20px;
  }
}
</style>
