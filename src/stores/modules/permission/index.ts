/*
 * @Description: permission state
 */

import { defineStore } from 'pinia'
import { RouteRecordRaw } from 'vue-router'

export interface PermissionState {
    routes: RouteRecordRaw[]
    dynamicRoutes: RouteRecordRaw[]
}




// 定义用户store
export const usePermissionStore = defineStore({
    // 定义store的id
    id: 'permission',
    state: (): PermissionState => ({
        routes: [],
        dynamicRoutes: []
    }),
    // 定义store的action，设置用户信息
    actions: {

    }
})

