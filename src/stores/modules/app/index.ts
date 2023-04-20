/*
 * @Description: app state
 * @Author: ZY
 * @Date: 2020-12-23 10:25:37
 * @LastEditors: ZY
 * @LastEditTime: 2020-12-23 10:30:35
 */
import { getSidebarStatus, getSize,setSidebarStatus } from '@/utils/cookies'
import { getLocale } from '@/locales'
// 导入定义store的方法
import { defineStore } from 'pinia'

export enum DeviceType {
    Mobile,
    Desktop,
}
export interface AppState {
    device: DeviceType
    sidebar: {
        opened: boolean
        withoutAnimation: boolean
    }
    language: string
    size: string
}
// 定义用户store
export const useAppStore = defineStore({
    // 定义store的id
    id: 'app',
    state: (): AppState => ({
        device: DeviceType.Desktop,
        sidebar: {
            opened: false,
            withoutAnimation: false
        },
        language: getLocale(),
        size: getSize() || 'medium'
    }),
    // 定义store的action，设置用户信息
    actions: {
        setSidebar(withoutAnimation: boolean) {
            this.sidebar.opened = false
            this.sidebar.withoutAnimation = withoutAnimation
        },
        setDevice(device: DeviceType) {
            this.device = device
        },
        setSize(size: string) {
            this.size = size
        },
        setLanguage(language: string) {
            this.language = language
        },
        closeSidebar(withoutAnimation: boolean) {
            this.sidebar.opened = false
            this.sidebar.withoutAnimation = withoutAnimation
            setSidebarStatus('closed')
        },
        toggleSideBar(withoutAnimation: boolean) {
            this.sidebar.opened = !this.sidebar.opened
            this.sidebar.withoutAnimation = withoutAnimation
            if (this.sidebar.opened) {
                setSidebarStatus('opened')
            } else {
                setSidebarStatus('closed')
            }
        }
    }
})

