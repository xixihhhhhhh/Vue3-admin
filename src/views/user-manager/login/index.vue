<!--
 * @Description: 登录页面
-->
<template>
  <div class="login-container">
    <video
      poster="../../../assets/images/login/video-cover.jpeg"
      loop
      autoplay
      muted
    >
      <source src="../../../assets/images/login/night.mp4" />
    </video>

    <el-form
      ref="loginFormRef"
      :model="loginForm"
      :rules="loginRules"
      class="login-form"
      autocomplete="on"
      label-position="left"
    >
      <div class="title-container">
        <h3 class="title">系统登录</h3>
      </div>

      <el-form-item prop="Email">
        <span class="svg-container">
          <el-icon :size="14" style="position: relative; top: 4px">
            <User />
          </el-icon>
        </span>
        <el-input
          ref="userNameRef"
          v-model="loginForm.Email"
          placeholder="邮箱"
          name="username"
          type="text"
          tabindex="1"
          autocomplete="on"
        />
      </el-form-item>

      <el-tooltip
        :visible="capsTooltip"
        content="Caps lock is On"
        placement="right"
        trigger="contextmenu"
      >
        <el-form-item prop="Password">
          <span class="svg-container">
            <el-icon :size="14" style="position: relative; top: 4px">
              <Lock />
            </el-icon>
          </span>
          <el-input
            :key="passwordType"
            ref="passwordRef"
            v-model="loginForm.Password"
            :type="passwordType"
            placeholder="密码"
            name="password"
            tabindex="2"
            autocomplete="on"
            @keyup="checkCapslock"
            @blur="capsTooltip = false"
            @keyup.enter="handleLogin"
          />
          <span
            class="show-pwd"
            @click="showPwd"
            v-if="passwordType !== 'password'"
          >
            <el-icon :size="14" style="position: relative; top: 4px">
              <View />
            </el-icon>
          </span>
          <span class="show-pwd" @click="showPwd" v-else>
            <el-icon :size="14" style="position: relative; top: 4px">
              <Hide />
            </el-icon>
          </span>
        </el-form-item>
      </el-tooltip>

      <el-button
        :loading="loading"
        type="primary"
        style="width: 100%; margin: 15px 0"
        @click.prevent="handleLogin"
      >
        登录
      </el-button>
    </el-form>
  </div>
</template>
  
<script lang="ts">
import {
  defineComponent,
  nextTick,
  ref,
  reactive,
  toRefs,
  watch,
  onMounted,
} from "vue";
import { isEmail } from "@/utils/validate";
import { useRoute, useRouter } from "vue-router";
import type { LocationQuery } from "vue-router";
import { ElMessage } from "element-plus";
import { useStore } from "@/stores";
import type { FormInstance } from "element-plus";
import { login, getPersonMsg } from "@/api/user";
export default defineComponent({
  setup() {
    const userNameRef = ref(null);
    const passwordRef = ref(null);
    const router = useRouter();
    const route = useRoute();
    const store = useStore();
    const loginFormRef = ref<FormInstance>();
    const baseUrl = "http://icon.mgaronya.com/";
    const validateEmail = (rule: any, value: string, callback: Function) => {
      if (!isEmail(value)) {
        callback(new Error("邮箱格式不正确"));
      } else {
        callback();
      }
    };
    const validatePassword = (rule: any, value: string, callback: Function) => {
      if (value.length < 6) {
        callback(new Error("密码不能少于六位"));
      } else {
        callback();
      }
    };
    const state = reactive({
      loginForm: {
        Email: "20zhzhang@stu.edu.cn",
        Password: "123456",
      },

      loginRules: {
        Email: [
          { validator: validateEmail, trigger: "blur" },
          {
            required: true,
            message: "请输入邮箱",
            trigger: "blur",
          },
        ],
        Password: [
          {
            required: true,
            message: "请输入密码",
            trigger: "blur",
          },
          {
            min: 6,
            max: 18,
            message: "密码长度六到18位",
            trigger: "blur",
          },
        ],
      },
      passwordType: "password",
      loading: false,
      showDialog: false,
      capsTooltip: false,
      redirect: "",
      otherQuery: {},
    });

    const methods = reactive({
      checkCapslock: (e: KeyboardEvent) => {
        const { key } = e;
        state.capsTooltip =
          key !== null && key.length === 1 && key >= "A" && key <= "Z";
      },
      showPwd: () => {
        if (state.passwordType === "password") {
          state.passwordType = "";
        } else {
          state.passwordType = "password";
        }
        nextTick(() => {
          (passwordRef.value as any).focus();
        });
      },
      handleLogin: () => {
        (loginFormRef.value as any).validate(async (valid: boolean) => {
          if (valid) {
            state.loading = true;
            const res = await login(state.loginForm);
            console.log(res);
            if (res.code === 200) {
              state.loading = false;
              store.user.token = res.data.token;
              window.localStorage.setItem("token", res.data.token);
              store.user.setEmail(state.loginForm.Email);
              const { data } = await getPersonMsg();
              store.user.setAvatar(baseUrl + data.user.Icon);
              router.push({
                path: state.redirect || "/",
                query: state.otherQuery,
              });
            } else {
              state.loading = false;
              ElMessage({
                message: "Congrats, this is a success message.",
                type: "success",
              });
            }
          }
        });
      },
    });
    /**
     * 从当前路由的查询参数中获取除了 "redirect" 以外的其它参数
     * @param query 当前路由的查询参数
     * @returns 返回一个新的对象，包含所有除了 "redirect" 以外的其它参数
     */
    function getOtherQuery(query: LocationQuery): LocationQuery {
      // 使用 Object.keys() 方法获取查询参数对象中的所有属性名，并返回一个数组
      // 然后使用 reduce() 方法对数组中的每个元素进行处理
      return Object.keys(query).reduce((acc, cur) => {
        // 如果当前属性名不是 "redirect"，则将其添加到新的对象中
        if (cur !== "redirect") {
          acc[cur] = query[cur]; // 将当前属性添加到新对象中
        }
        return acc;
      }, {} as LocationQuery); // 将一个空对象作为初始值传入 reduce() 方法
    }
    onMounted(() => {
      if (state.loginForm.Email === "") {
        (userNameRef.value as any).focus();
      } else if (state.loginForm.Password === "") {
        (passwordRef.value as any).focus();
      }
    });
    watch(
      // 监听的数据，返回当前路由的 query 对象
      () => route.query,
      // 数据变化时执行的操作
      (query) => {
        // 解构获取 query 中的 redirect 和其他参数
        if (query) {
          state.redirect = query.redirect?.toString() ?? ""; // 如果 redirect 不存在，则赋值为空字符串
          state.otherQuery = getOtherQuery(query); // 将其他参数保存到 state.otherQuery 中
        }
      }
    );
    return {
      userNameRef,
      passwordRef,
      loginFormRef,
      ...toRefs(state),
      ...toRefs(methods),
    };
  },
});
</script>

<style lang="scss">
// References: https://www.zhangxinxu.com/wordpress/2018/01/css-caret-color-first-line/
@supports (-webkit-mask: none) and (not (cater-color: $loginCursorColor)) {
  .login-container .el-input {
    input {
      color: $loginCursorColor;
    }
    input::first-line {
      color: $lightGray;
    }
  }
}

.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 85%;
    border: none;
    box-shadow: none;

    .el-input__wrapper {
      width: 100%;
      height: 100%;
      background: transparent;
      border: 0px;
      box-shadow: none;
      input {
        height: 47px;
        background: transparent;
        border-radius: 0px;
        padding: 12px 5px 12px 15px;
        color: $lightGray;
        caret-color: $loginCursorColor;
        -webkit-appearance: none;

        &:-webkit-autofill {
          -webkit-text-fill-color: #fff !important;
        }
      }
    }
    .is-focus {
      box-shadow: none;
    }
  }

  .el-form-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(0, 0, 0, 0.1);
    border-radius: 5px;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
.login-container {
  height: 100%;
  width: 100%;
  overflow: hidden;
  // background-color: $loginBg;
  video {
    position: absolute;
    /* Vertical and Horizontal center*/
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }
  .login-form {
    position: relative;
    width: 520px;
    max-width: 100%;
    padding: 160px 35px 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .tips {
    font-size: 14px;
    color: #fff;
    margin-bottom: 10px;

    span {
      &:first-of-type {
        margin-right: 16px;
      }
    }
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $darkGray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    position: relative;

    .title {
      font-size: 26px;
      color: $lightGray;
      margin: 0px auto 40px auto;
      text-align: center;
      font-weight: bold;
    }

    .set-language {
      color: #fff;
      position: absolute;
      top: 3px;
      font-size: 18px;
      right: 0px;
      cursor: pointer;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $darkGray;
    cursor: pointer;
    user-select: none;
  }

  .thirdparty-button {
    position: absolute;
    right: 0;
    bottom: 6px;
  }

  @media only screen and (max-width: 470px) {
    .thirdparty-button {
      display: none;
    }
  }
}
</style>