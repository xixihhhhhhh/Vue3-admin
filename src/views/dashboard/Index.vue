<!--
 * @Description:
-->
<template>
  <div class="dashboard-container">
    <el-row class="first-row">
      <el-col :span="8">
        <div @keydown.enter="select()" :class="{ 'error-ipt': isError }">
          <el-input
            v-model.trim="keywords"
            size="large"
            placeholder="请输入邮箱或者用户名"
            :suffix-icon="Search"
            autofocus
            clearable
            ref="iptRef"
            @focus="isError = false"
          />
        </div>
        <span class="error-tip" v-if="isError">{{ msgTip }}</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-table :data="tableData" height="600" style="width: 100%">
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
      </el-col>
    </el-row>
  </div>
</template>

<script lang="ts">
import { reactive, defineComponent, ref, toRefs } from "vue";
import { Search } from "@element-plus/icons-vue";
import { debounce } from "@/utils";
import { searchFriendByName, searchFriendByEmail } from "@/api/blog";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/modules/user";
export default defineComponent({
  setup() {
    const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
    const keywords = ref("20zhzhang@stu.edu.cn");
    const router = useUserStore();
    const state = reactive({
      tableData: [],
      isError: false,
      msgTip: "格式错误或者用户不存在",
    });
    const iptRef = ref<HTMLInputElement | null>(null);
    interface User {
      name: string;
      email: string;
      avatar: string;
      blog: string;
    }
    const select = debounce(async function () {
      ElMessage({
        message: "hhh",
        type: "success",
        duration: 100000000,
      });
      let res = {};
      if (!keywords) {
        return;
      }
      if (reg.test(keywords.value)) {
        res = await searchFriendByEmail(keywords.value);
      } else {
        res = await searchFriendByName(keywords.value);
      }
      console.log(res, "hhh");

      if (res?.code === 200) {
        // this.name = res.data.user.Name
        // this.Email = res.data.user.Email
        // this.background = res.data.user.Icon
        // this.userId = res.data.user.ID
        // return this.$message.success(res.msg)
        const user: User = {
          name: "John Doe",
          email: "john.doe@example.com",
          avatar: "https://example.com/avatar.png",
          blog: "https://example.com/blog",
        };
        user.name = res.data.user.Name;
        user.email = res.data.user.email;
        user.avatar = router.imgBaseUrl + res.data.user.Icon;
        user.blog =
          router.blogBaseUrl + res.data.user.Name + res.data.user.Blog;
        state.tableData.push(user)
      } else {
        state.isError = true;
        state.msgTip = res.msg;
        iptRef.value?.blur();
      }
    }, 500);
    return {
      Search,
      ...toRefs(state),
      select,
      keywords,
      iptRef,
    };
  },
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
  padding-left: 100px;
  .error-ipt {
    box-shadow: 0 0 1px 1px red;
  }
  .first-row {
    .error-tip {
      color: red;
      font-size: 12px;
      margin-top: 4px;
    }
  }
}
</style>