<!--
 * @Description:
-->
<template>
  <div class="dashboard-container">
    <el-row>
      <el-col :span="8">
        <div @keydown.enter="select()">
          <el-input
            v-model.trim="keywords"
            class="w-50 m-2"
            size="large"
            placeholder="请输入邮箱或者用户名"
            :suffix-icon="Search"
            autofocus
          />
        </div>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="20">
        <el-table :data="tableData" height="600" style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
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
import { Message } from "@/message";
import { ElMessage } from "element-plus";
export default defineComponent({
  setup() {
    const reg = /^([a-zA-Z\d][\w-]{2,})@(\w{2,})\.([a-z]{2,})(\.[a-z]{2,})?$/;
    const keywords = ref("20zhzhang@stu.edu.cn");
    const state = reactive({
      tableData: [],
    });

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
      } else {
      }
    }, 500);
    return {
      Search,
      ...toRefs(state),
      select,
      keywords,
    };
  },
});
</script>

<style lang="scss" scoped>
.dashboard-container {
  padding: 10px;
  padding-left: 100px;
}
</style>