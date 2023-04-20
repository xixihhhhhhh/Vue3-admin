/*
 * @Description: tags state
 * @Author: ZY
 * @Date: 2020-12-23 10:25:37
 * @LastEditors: ZY
 * @LastEditTime: 2020-12-23 10:30:35
 */

import { defineStore } from 'pinia'
import { RouteLocationNormalized } from 'vue-router'

export interface TagView extends Partial<RouteLocationNormalized> {
    title?: string
    meta: {
        affix?: { title?: string | undefined } | undefined
        title?: string
        noCache?: string
    }
}
export interface TagsViewState {
    visitedViews: TagView[]
    cachedViews: (string | undefined)[]
}


// 定义標簽store
export const useTagsStore = defineStore({
    // 定义store的id
    id: 'tagsView',
    state: (): TagsViewState => ({
        visitedViews: [],
        cachedViews: []
    }),
    // 定义store的action，设置用户信息
    actions: {
        addVisitedView(viewData: TagView) {
            // 如果 viewData 已经存在于 visitedViews 数组中，则直接返回，不做处理
            if (this.visitedViews.some(v => v.path === viewData.path)) return
            // 如果 viewData 不存在于 visitedViews 数组中，则将它添加到数组中
            this.visitedViews.push({
                ...viewData,
                title: viewData.meta?.title || 'no-name',
            })
        },
        addCacheView(view: TagView) {
            if (view.name === null) return
            if (this.cachedViews.includes(view.name?.toString())) return
            if (!view.meta?.noCache) {
                this.cachedViews.push(view.name?.toString())
            }
        },
        delVisitedView(view: TagView) {
            for (const [i, v] of this.visitedViews.entries()) {
                if (v.path === view.path) {
                    this.visitedViews.splice(i, 1)
                    break
                }
            }
        },
        delCachedView(view: TagView) {
            if (view.name === null) return
            const index = this.cachedViews.indexOf(view.name?.toString())
            index > -1 && this.cachedViews.splice(index, 1)
        },
        delOthersVisitedViews(view: TagView) {
            this.visitedViews = this.visitedViews.filter(v => {
                return v.meta?.affix || v.path === view.path
            })
        },
        delOthersCachedViews(view: TagView) {
            if (!view.name) return
            const index = this.cachedViews.indexOf(view.name.toString())
            if (index !== -1) {
                this.cachedViews = this.cachedViews.slice(index, index + 1)
            } else {
                this.cachedViews = []
            }
        },
        delAllVisitedViews() {
            const affixTags = this.visitedViews.filter(tag => tag.meta?.affix)
            this.visitedViews = affixTags
        },
        delAllCachedViews() {
            this.cachedViews = []
        },
        updateVistitedView(view: TagView) {
            for (let v of this.visitedViews) {
                if (v.path === view.path) {
                    v = Object.assign(v, view)
                    break
                }
            }
        }
    }
})

