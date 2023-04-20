/*
 * @Description: app state
 */

import layoutSettings from '@/config/default/layout'
import { defineStore } from 'pinia'

export interface SettingsState {
    theme: string
    fixedHeader: boolean
    showSettings: boolean
    showTagsView: boolean
    showSidebarLogo: boolean
    sidebarTextTheme: boolean
}

// 定义設置store
export const useSettingStore = defineStore({
    // 定义store的id
    id: 'settings',
    state: (): SettingsState => ({
        theme: '#1890ff',
        fixedHeader: layoutSettings.fixedHeader,
        showSettings: layoutSettings.showSettings,
        showTagsView: layoutSettings.showTagsView,
        showSidebarLogo: layoutSettings.showSidebarLogo,
        sidebarTextTheme: layoutSettings.sidebarTextTheme
    }),
    // 定义store的action，设置用户信息啊
    actions: {
        changeSetting(payload: { key: string, value: any }) {
            const { key, value } = payload
            switch (key) {
                case 'theme':
                    this.theme = value
                    break
                case 'fixedHeader':
                    this.fixedHeader = value
                    break
                case 'showSettings':
                    this.showSettings = value
                    break
                case 'showSidebarLogo':
                    this.showSidebarLogo = value
                    break
                case 'showTagsView':
                    this.showTagsView = value
                    break
                case 'sidebarTextTheme':
                    this.sidebarTextTheme = value
                    break
                default:
                    break
            }
        }
    }
})