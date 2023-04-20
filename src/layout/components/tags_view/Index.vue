<!--
 * @Description:
 * @Author: ZY
 * @Date: 2020-12-24 10:35:59
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-28 16:31:09
-->
<!-- 这是一个 Vue.js 模板，用于创建标签视图容器组件。
该组件用于显示已访问视图的标签，并允许用户与这些标签进行交互，例如关闭或刷新标签。
该模板包含一个 ScrollPane 组件，该组件包装了一个 router-link 组件，用于每个标签的呈现。
router-link 组件用于将标签呈现为可点击链接，可以导航到相应的视图。
该模板还包含一个上下文菜单，在用户右键单击标签时显示。上下文菜单包含刷新、关闭、关闭其他或关闭所有标签的选项。 -->

<template>
  <div id="tags-view-container" class="tags-view-container">
    <!--  ScrollPane 组件包装了每个标签的 router-link 组件。 -->
    <ScrollPane
      ref="scrollPaneRef"
      class="tags-view-wrapper"
      @scroll="handleScroll"
    >
      <router-link
        v-for="tag in visitedViews"
        ref="tag"
        :key="tag.path"
        :class="isActive(tag) ? 'active' : ''"
        :to="{ path: tag.path, query: tag.query, fullPath: tag.fullPath }"
        class="tags-view-item"
        @click.middle="!isAffix(tag) ? closeSelectedTag(tag) : ''"
        @contextmenu.prevent="openMenu(tag, $event)"
      >
        <template v-slot:default="{ href, navigate }">
          <span :href="href" @click="navigate()">
            {{ tag.meta.title }}
            <!--  当用户点击非固定标签的关闭图标时，将调用 closeSelectedTag 函数。 -->

            <el-icon
              v-if="!isAffix(tag)"
              :size="8"
              @click.prevent.stop="closeSelectedTag(tag)"
            >
              <CloseBold />
            </el-icon>
          </span>
        </template>
      </router-link>
    </ScrollPane>
    <!--  当用户点击非固定标签的关闭图标时，将调用 closeSelectedTag 函数。 -->
    <ul
      v-show="visible"
      :style="{ left: left + 'px', top: top + 'px' }"
      class="contextmenu"
    >
      <li @click="refreshSelectedTag(selectedTag)">
        {{ "刷新" }}
      </li>
      <li v-if="!isAffix(selectedTag)" @click="closeSelectedTag(selectedTag)">
        {{ "关闭" }}
      </li>
      <li @click="closeOthersTags">
        {{ "关闭其他" }}
      </li>
      <li @click="closeAllTags(selectedTag)">
        {{ "关闭所有" }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts">
import { useStore } from "@/stores";
import { TagView } from "@/stores/modules/tagsview";
import {
  computed,
  defineComponent,
  getCurrentInstance,
  nextTick,
  onBeforeMount,
  reactive,
  ref,
  toRefs,
  watch,
} from "vue";
import { RouteRecordRaw, useRoute, useRouter } from "vue-router";
import ScrollPane from "./ScrollPane.vue";
export default defineComponent({
  components: {
    ScrollPane,
  },
  setup() {
    const store = useStore();
    const router = useRouter();
    const instance = getCurrentInstance();
    const currentRoute = useRoute();
    const scrollPaneRef = ref(null);
    const { ctx } = instance as any;
    /*该函数用于将最后访问的视图跳转到当前视图
     @param visitedViews 已访问的视图数组
     @param view 当前视图
    */
    const toLastView = (visitedViews: TagView[], view: TagView) => {
      // 获取最后访问的视图
      const latestView = visitedViews.slice(-1)[0];
      // 如果最后访问的视图存在并且其fullPath不为空，则跳转到该视图
      if (latestView !== undefined && latestView.fullPath !== undefined) {
        router.push(latestView.fullPath).catch((err) => {
          console.warn(err);
        });
      } else {
        // 如果不存在tags-view，则默认跳转到主页
        if (view.name === "Dashboard") {
          // 重定向到主页
          router.push({ path: "/redirect" + view.fullPath }).catch((err) => {
            console.warn(err);
          });
        } else {
          // 跳转到主页
          router.push("/").catch((err) => {
            console.warn(err);
          });
        }
      }
    };

    const state = reactive({
      visible: false, //标签菜单是否可见，初始值为false。
      top: 0, //  标签菜单出现的纵坐标，初始值为0。
      left: 0, // 标签菜单出现的纵坐标，初始值为0。
      selectedTag: {} as TagView, //当前选中的标签视图，初始值为空对象。
      affixTags: [] as TagView[], //固定的标签视图数组，初始值为空数组。
      // 用于判断传入的标签视图是否为当前路由的视图，是则返回true，否则返回false。
      isActive: (route: TagView) => {
        return route.path === currentRoute.path;
      },
      //用于判断传入的标签视图是否为当前路由的视图，是则返回true，否则返回false。
      isAffix: (tag: TagView) => {
        return tag.meta && tag.meta.affix;
      },
      // 刷新当前选中的标签视图，将传入的标签视图添加到已访问的视图数组中，并使用路由替换当前路由。
      refreshSelectedTag: (view: TagView) => {
        state.visible = false;
        store.tagsView.addVisitedView(view);
        const { fullPath } = view;
        nextTick(() => {
          router.replace({ path: "/redirect" + fullPath }).catch((err) => {
            console.warn(err);
          });
        });
      },
      // 关闭当前选中的标签视图，从已访问的视图数组和缓存的视图数组中删除该视图，并根据情况跳转到其他视图。
      closeSelectedTag: (view: TagView) => {
        state.visible = false;
        store.tagsView.delVisitedView(view);
        store.tagsView.delCachedView(view);
        if (state.isActive(view)) {
          toLastView(store.tagsView.visitedViews, view);
        }
      },
      //关闭除当前选中的标签视图外的其他所有标签视图，从已访问的视图数组和缓存的视图数组中删除这些视图。
      closeOthersTags: () => {
        state.visible = false;
        if (
          state.selectedTag.fullPath !== currentRoute.path &&
          state.selectedTag.fullPath !== undefined
        ) {
          router.push(state.selectedTag.fullPath).catch((err) => {
            console.log(err);
          });
        }
        store.tagsView.delOthersVisitedViews(state.selectedTag as TagView);
        store.tagsView.delOthersCachedViews(state.selectedTag as TagView);
      },
      // 关闭所有标签视图，从已访问的视图数组和缓存的视图数组中删除这些视图，并根据情况跳转到其他视图。
      closeAllTags: (view: TagView) => {
        state.visible = false;
        store.tagsView.delAllVisitedViews();
        store.tagsView.delAllCachedViews();
        if (state.affixTags.some((tag) => tag.path === currentRoute.path)) {
          return;
        }
        toLastView(store.tagsView.visitedViews, view);
      },
      // 打开标签菜单，传入标签视图和鼠标事件。计算标签菜单出现的位置，并将selectedTag设置为传入的标签视图。
      openMenu: (tag: TagView, e: MouseEvent) => {
        const menuMinWidth = 105;
        const offsetLeft = ctx.$el.getBoundingClientRect().left; // container margin left
        const offsetWidth = ctx.$el.offsetWidth; // container width
        const maxLeft = offsetWidth - menuMinWidth; // left boundary
        const left = e.clientX - offsetLeft + 15; // 15: margin right
        if (left > maxLeft) {
          state.left = maxLeft;
        } else {
          state.left = left;
        }
        state.top = e.clientY;
        state.visible = true;
        state.selectedTag = tag;
      },
      // 关闭标签菜单，将visible设置为false。
      closeMenu: () => {
        state.visible = false;
      },
      // 监听页面滚动事件，关闭标签菜单。
      handleScroll: () => {
        state.closeMenu();
      },
    });

    const visitedViews = computed(() => {
      return store.tagsView.visitedViews;
    });
    const routes = computed(() => store.permission.routes);

    /*
    filterAffixTags函数的作用是过滤出具有affix属性的路由，并将这些路由转换成TagView对象存储在tags数组中。
    @param routes: RouteRecordRaw[] - 路由配置列表
    @param basePath: string - 路由基础路径，默认为"/"
    @returns TagView[] - 存储了具有affix属性的路由信息的TagView对象数组
    */
    const filterAffixTags = (routes: RouteRecordRaw[], basePath = "/") => {
      let tags: TagView[] = [];

      routes.forEach((route) => {
        if (route.meta && route.meta.affix) {
          basePath = basePath === "/" ? "" : basePath;
          const tagPath = `${basePath}/${route.path}`;

          tags.push({
            fullPath: tagPath,
            path: tagPath,
            name: route.name,
            meta: { ...route.meta },
          });
        }

        if (route.children) {
          const childTags = filterAffixTags(route.children, route.path);
          if (childTags.length >= 1) {
            tags = tags.concat(childTags);
          }
        }
      });
      return tags;
    };

    //该函数的作用是初始化标签栏，将具有affix属性的路由添加到标签栏中，保证这些路由不会被关闭。
    const initTags = () => {
      state.affixTags = filterAffixTags(routes.value);
      for (const tag of state.affixTags) {
        // Must have tag name
        store.tagsView.addVisitedView(tag as TagView);
      }
    };

    // 返回false，用于阻止默认行为。
    // 总之，该函数的作用是向标签栏中添加当前路由，并将其缓存起来，以提高后续访问速度。
    const addTags = () => {
      if (currentRoute.name) {
        store.tagsView.addVisitedView(currentRoute as TagView);
        store.tagsView.addCacheView(currentRoute as TagView);
      }
      return false;
    };

    // 该函数的作用是将标签栏滚动到当前路由所在的位置，
    // 并且如果当前路由的fullPath与visitedViews数组中的路由信息不一致，则更新visitedViews数组中当前路由的位置。
    const moveToCurrentTag = () => {
      const tags = instance?.refs.tag as any[];
      nextTick(() => {
        if (tags === null || tags === undefined) {
          return;
        }
        for (const tag of tags) {
          if ((tag.to as TagView).path === currentRoute.path) {
            (scrollPaneRef.value as any).moveToCurrentTag(tag);
            // When query is different then update
            if ((tag.to as TagView).fullPath !== currentRoute.fullPath) {
              store.tagsView.updateVistitedView(currentRoute as TagView);
            }
          }
        }
      });
    };

    // 当currentRoute.name发生变化时，
    // 调用addTags函数向标签栏中添加当前路由，
    // 并调用moveToCurrentTag函数将标签栏滚动到当前路由所在的位置。
    watch(
      () => currentRoute.name,
      () => {
        addTags();
        moveToCurrentTag();
      }
    );

    // watch(state.visible.value, (value) => {
    //   if (value) {
    //     document.body.addEventListener('click', state.closeMenu)
    //   } else {
    //     document.body.removeEventListener('click', state.closeMenu)
    //   }
    // })

    // life cricle
    onBeforeMount(() => {
      initTags();
      addTags();
    });

    return {
      visitedViews,
      routes,
      scrollPaneRef,
      ...toRefs(state),
    };
  },
});
</script>

<style lang="scss" scoped>
// 重置el-icon-close元素的CSS样式
.tags-view-wrapper {
  // 选择标签栏容器
  .tags-view-item {
    // 选择标签栏中的每个标签
    .el-icon {
      width: 16px;
      height: 16px;
      vertical-align: 2px;
      border-radius: 50%;
      text-align: center;
      transition: all 0.3s cubic-bezier(0.645, 0.045, 0.355, 1);
      transform-origin: 100% 50%;

      &:before {
        transform: scale(0.6);
        display: inline-block;
        vertical-align: -3px;
      }

      &:hover {
        background-color: #b4bccc;
        color: #fff;
      }
    }
  }
}
</style>
<style lang="scss" scoped>
.tags-view-container {
  height: 34px;
  width: 100%;
  background: #fff;
  border-bottom: 1px solid #d8dce5;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.12), 0 0 3px 0 rgba(0, 0, 0, 0.04);

  .tags-view-wrapper {
    .tags-view-item {
      display: inline-block;
      position: relative;
      cursor: pointer;
      height: 26px;
      line-height: 26px;
      border: 1px solid #d8dce5;
      color: #495060;
      background: #fff;
      padding: 0 8px;
      font-size: 12px;
      margin-left: 5px;
      margin-top: 4px;

      &:first-of-type {
        margin-left: 15px;
      }

      &:last-of-type {
        margin-right: 15px;
      }

      &.active {
        background-color: #42b983;
        color: #fff;
        border-color: #42b983;

        &::before {
          content: "";
          background: #fff;
          display: inline-block;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          position: relative;
          margin-right: 2px;
        }
      }
    }
  }

  .contextmenu {
    margin: 0;
    background: #fff;
    z-index: 3000;
    position: absolute;
    list-style-type: none;
    padding: 5px 0;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 400;
    color: #333;
    box-shadow: 2px 2px 3px 0 rgba(0, 0, 0, 0.3);

    li {
      margin: 0;
      padding: 7px 16px;
      cursor: pointer;

      &:hover {
        background: #eee;
      }
    }
  }
}
</style>
