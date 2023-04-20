import { ref, defineComponent, h } from 'vue'

type MessageType = 'success' | 'warning' | 'info' | 'error'

interface MessageOptions {
  message: string
  type: MessageType
}

interface MessageItem extends MessageOptions {
  id: number
}

export const Message = defineComponent({
  setup() {
    const messageList = ref<MessageItem[]>([])
    let id = 1

    const showMessage = (options: MessageOptions) => {
      const message = {
        ...options,
        id: id++
      }
      messageList.value.push(message)
    }

    const closeMessage = (id: number) => {
      const index = messageList.value.findIndex(item => item.id === id)
      if (index !== -1) {
        messageList.value.splice(index, 1)
      }
    }

    return {
      messageList,
      showMessage,
      closeMessage
    }
  },
  render() {
    return h('div', { class: 'el-message' }, this.messageList.map(item => (
      h('div', {
        class: ['el-message__item', `el-message__${item.type}`],
        key: item.id
      }, [
        h('span', { class: 'el-message__content' }, item.message),
        h('i', {
          class: 'el-message__closeBtn',
          onClick: () => this.closeMessage(item.id)
        }, 'x')
      ])
    )))
  }
})