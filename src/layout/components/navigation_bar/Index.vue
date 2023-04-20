<!--
 * @Description: 导航栏
 * @Author: ZY
 * @Date: 2020-12-17 15:52:19
 * @LastEditors: ZY
 * @LastEditTime: 2021-01-27 19:16:50
-->
<template>
  <div class="navbar">
    <Hamburger
      id="hamburger-container"
      :is-active="sidebar.opened"
      class="hamburger-container"
      @toggle-click="toggleSideBar"
    />
    <BreadCrumb id="breadcrumb-container" class="breadcrumb-container" />
    <div class="right-menu">
      <template v-if="device !== 'mobile'">
        <Screenfull class="right-menu-item hover-effect" />
      </template>
      <el-dropdown
        class="avatar-container right-menu-item hover-effect"
        trigger="click"
      >
        <div class="avatar-wrapper">
          <img :src="avatar" class="user-avatar" />
        </div>
        <template #dropdown>
          <el-dropdown-menu>
            <router-link to="/">
              <el-dropdown-item>
                {{ "navbar.dashboard" }}
              </el-dropdown-item>
            </router-link>
            <a
              target="_blank"
              href="https://github.com/rcyj-FED/vue3-composition-admin"
            >
              <el-dropdown-item>
                {{ "navbar.github" }}
              </el-dropdown-item>
            </a>
            <a
              target="_blank"
              href="https://armour.github.io/vue-typescript-admin-docs/"
            >
              <el-dropdown-item>Docs</el-dropdown-item>
            </a>
            <el-dropdown-item divided @click="logout">
              <span style="display: block">
                {{ "退出登录" }}
              </span>
            </el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<script>
import BreadCrumb from "@/components/bread-crumb/Index.vue";
import Hamburger from "@/components/hamburger/Index.vue";
import Screenfull from "@/components/screenfull/Index.vue";
import LangSelect from "@/components/lang_select/Index.vue";
import SizeSelect from "@/components/size_select/Index.vue";
import { removeToken } from "@/utils/cookies";

import { computed, reactive, toRefs } from "vue";
import { useStore } from "@/stores";
import { useRoute, useRouter } from "vue-router";
export default {
  components: {
    BreadCrumb,
    Hamburger,
    Screenfull,
    LangSelect,
    SizeSelect,
  },
  setup() {
    const store = useStore();
    const route = useRoute();
    const router = useRouter();
    const sidebar = computed(() => {
      return store.app.sidebar;
    });
    const device = computed(() => {
      return store.app.device.toString();
    });
    const avatar = computed(() => {
      return store.user.avatar;
    });
    const state = reactive({
      toggleSideBar: () => {
        store.app.toggleSideBar(false);
      },
      logout: () => {
        removeToken();
        useStore().user.setRoleLevel(1);
        useStore().user.setToken("");
        router.push(`/login?redirect=${route.fullPath}`).catch((err) => {
          console.warn(err);
        });
      },
    });
    return {
      sidebar,
      device,
      avatar,
      ...toRefs(state),
    };
  },
};
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #fff;
  box-shadow: 0 1px 4px rgba(0, 21, 41, 0.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    padding: 0 15px;
    cursor: pointer;
    transition: background 0.3s;
    -webkit-tap-highlight-color: transparent;

    &:hover {
      background: rgba(0, 0, 0, 0.025);
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .errLog-container {
    display: inline-block;
    vertical-align: top;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;

    &:focus {
      outline: none;
    }

    .right-menu-item {
      display: inline-block;
      padding: 0 8px;
      height: 100%;
      font-size: 18px;
      color: #5a5e66;
      vertical-align: text-bottom;

      &.hover-effect {
        cursor: pointer;
        transition: background 0.3s;

        &:hover {
          background: rgba(0, 0, 0, 0.025);
        }
      }
    }

    .avatar-container {
      .avatar-wrapper {
        margin-top: 5px;
        margin-right: 16px;
        margin-left: 16px;
        position: relative;

        .user-avatar {
          cursor: pointer;
          width: 40px;
          height: 40px;
          border-radius: 10px;
        }

        .el-icon-caret-bottom {
          cursor: pointer;
          position: absolute;
          right: -20px;
          top: 25px;
          font-size: 12px;
        }
      }
    }
  }
}
</style>
