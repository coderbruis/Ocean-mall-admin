<template>
  <div v-if="!item.hidden">
    <!-- item中对应的属性就是route中的meta属性值 -->
    <template v-if="hasOneShowingChild(item.children,item) && (!onlyOneChild.children||onlyOneChild.noShowingChildren)&&!item.alwaysShow">
      <!-- app-link 是在onlyOneChild.meta为true时展示，app-link为自定义的vue组件 -->
      <app-link v-if="onlyOneChild.meta" :to="resolvePath(onlyOneChild.path)">
        <!-- 这里的el-menu-item会替代app-link组件中的slot -->
        <el-menu-item :index="resolvePath(onlyOneChild.path)" :class="{'submenu-title-noDropdown':!isNest}">
          <!-- sidebar中实际展示的是item项 -->
          <!-- 如果子路由有icon，则使用child的icon；否则用父路由的icon。onlyOneChild就是路由，路由中会定义meta属性。 -->
          <item :icon="onlyOneChild.meta.icon||(item.meta&&item.meta.icon)" :title="onlyOneChild.meta.title" />
        </el-menu-item>
      </app-link>
    </template>

    <el-submenu v-else ref="subMenu" :index="resolvePath(item.path)" popper-append-to-body>
      <!-- slot定义的插槽就是在item中实现的，由于在item中定义的是<span slot='title'/> 则这里template就是由span来替代 -->
      <template slot="title">
        <item v-if="item.meta" :icon="item.meta && item.meta.icon" :title="item.meta.title" />
      </template>
      <!-- is-nest定义了上面 el-menu-item中定义的submenu-title-noDropdown属性 -->
      <sidebar-item
        v-for="child in item.children"
        :key="child.path"
        :is-nest="true"
        :item="child"
        :base-path="resolvePath(child.path)"
        class="nest-menu"
      />
    </el-submenu>
  </div>
</template>

<script>
import path from 'path'
import { isExternal } from '@/utils/validate'
import Item from './Item'
import AppLink from './Link'
import FixiOSBug from './FixiOSBug'

export default {
  name: 'SidebarItem',
  components: { Item, AppLink },
  mixins: [FixiOSBug],
  props: {
    // route object
    item: {
      type: Object,
      required: true
    },
    isNest: {
      type: Boolean,
      default: false
    },
    basePath: {
      type: String,
      default: ''
    }
  },
  data() {
    // To fix https://github.com/PanJiaChen/vue-admin-template/issues/237
    // TODO: refactor with render function
    this.onlyOneChild = null
    return {}
  },
  methods: {
    // hasOneShowingChild, 表示当前展示的路由是不是有child，是否有两个child；如果有child，并且只有一个child，则只会展示child，而父menu-item则不展示了。
    hasOneShowingChild(children = [], parent) {
      // 过滤子路由数组，如果有hidden项则过滤掉
      const showingChildren = children.filter(item => {
        if (item.hidden) {
          return false
        } else {
          // Temp set(will be used if only has one showing child)
          this.onlyOneChild = item
          return true
        }
      })

      // 如果只有一个子路由，则只展示子组件。
      if (showingChildren.length === 1) {
        return true
      }

      // 如果没有子路由，则只展示父组件，父组件就只是一个sidebar项。
      if (showingChildren.length === 0) {
        // 如果没有子路由, 则将副路由全部赋给onlyOneChild，并展开，将path设置为空; 然后将noshowingChildren设置为true，意思就是不展示子路由，只展示父路由。
        this.onlyOneChild = { ... parent, path: '', noShowingChildren: true }
        return true
      }

      // 当子路由超过两个的时候，就返回false
      return false
    },
    resolvePath(routePath) {
      if (isExternal(routePath)) {
        return routePath
      }
      if (isExternal(this.basePath)) {
        return this.basePath
      }
      return path.resolve(this.basePath, routePath)
    }
  }
}
</script>
