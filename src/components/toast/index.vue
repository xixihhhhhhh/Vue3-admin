<template>
  <div class="el-message" :class="`el-message--${type}`" v-if="show">
    <span class="el-message__content">{{ message }}</span>
    <i class="el-message__closeBtn el-icon-close" @click="close"></i>
  </div>
</template>

<script>
import { defineComponent, reactive } from 'vue';

let timer = null;

export default defineComponent({
  name: 'ElMessage',
  props: {
    message: {
      type: String,
      default: ''
    },
    type: {
      type: String,
      default: 'success'
    },
    duration: {
      type: Number,
      default: 3000
    }
  },
  setup(props) {
    const state = reactive({
      show: true
    });

    const close = () => {
      state.show = false;
    };

    const startTimer = () => {
      if (props.duration > 0) {
        timer = setTimeout(() => {
          close();
        }, props.duration);
      }
    };

    startTimer();

    return {
      state,
      close
    };
  },
  beforeUnmount() {
    if (timer) {
      clearTimeout(timer);
    }
  }
});
</script>

<style scoped>
.el-message {
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  padding: 12px 20px;
  border-radius: 4px;
  color: #fff;
  font-size: 14px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.12);
  transition: opacity 0.3s;
}

.el-message--success {
  background-color: #67c23a;
}

.el-message--warning {
  background-color: #e6a23c;
}

.el-message--error {
  background-color: #f56c6c;
}

.el-message__content {
  display: inline-block;
  margin-right: 10px;
}

.el-message__closeBtn {
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translateY(-50%);
  cursor: pointer;
}
</style>