import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '統計訊息', icon: 'dashboard' }
    }]
  },

  {
    path: '/sales',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Sales',
        component: () => import('@/views/sales/index'),
        meta: { title: '銷售管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/purchase',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Purchase',
        component: () => import('@/views/purchase/index'),
        meta: { title: '採購管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/inventory',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Inventory',
        component: () => import('@/views/inventory/index'),
        meta: { title: '庫存管理', icon: 'form' }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Account',
        component: () => import('@/views/account/index'),
        meta: { title: '結算賬目', icon: 'form' }
      }
    ]
  },
  {
    path: '/report',
    component: Layout,
    redirect: '/report',
    name: 'Report',
    meta: { title: '報表分析', icon: 'example' },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/table/index'),
        meta: { title: 'Table', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: 'Tree', icon: 'tree' }
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    redirect: '/setting/customer',
    name: 'Setting',
    meta: {
      title: '基本設定',
      icon: 'nested'
    },
    children: [
      {
        path: 'customermenu',
        component: () => import('@/views/nested/menu1/index'), // Parent router-view
        name: 'customermenu',
        meta: { title: '客戶管理' },
        children: [
          {
            path: 'custometype',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'customertype',
            meta: { title: '客戶類別' }
          },
          {
            path: 'paymentterms',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'paymentterms',
            meta: { title: '付款設定' }
          },
          {
            path: 'paymentmethod',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
            name: 'paymentmethod',
            meta: { title: '付款方式' }
          },
          {
            path: 'region',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-2'),
            name: 'region',
            meta: { title: '區域設定' }
          }]
      },
      {
        path: 'vendormenu',
        component: () => import('@/views/nested/menu1/menu1-3'),
        name: 'VendorMenu',
        meta: { title: '供應商管理' },
        children: [
          {
            path: 'vendortype',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'vendortype',
            meta: { title: '供應商類別' }
          },
          {
            path: 'vendor',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'vendor',
            meta: { title: '供應商設定' }
          },
          {
            path: 'paymentterms',
            component: () => import('@/views/nested/menu1/menu1-2'),
            name: 'paymentterms',
            meta: { title: '付款設定' }
          },
          {
            path: 'paymentmethod',
            component: () => import('@/views/nested/menu1/menu1-2/menu1-2-1'),
            name: 'paymentmethod',
            meta: { title: '付款方式' }
          }]
      },
      {
        path: '/usermenu',
        component: Layout,
        name: 'UserMenu',
        meta: { title: '用戶管理' },
        children: [
          {
            path: 'user',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'user',
            meta: { title: '用戶設定' }
          },
          {
            path: 'usergroup',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'usergroup',
            meta: { title: '用戶群組' }
          },
          {
            path: 'department',
            component: () => import('@/views/setting/user/departmentlist'),
            name: 'department',
            meta: { title: '部門設定' }
          }]
      },
      {
        path: 'productmenu',
        component: () => import('@/views/nested/menu2/index'),
        name: 'ProductMenu',
        meta: { title: '貨物管理' },
        children: [
          {
            path: 'customtype1',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'customtype1',
            meta: { title: '自訂分類一' }
          },
          {
            path: 'customtype2',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'customtype2',
            meta: { title: '自訂分類二' }
          },
          {
            path: 'customtype3',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'customtype3',
            meta: { title: '自訂分類三' }
          },
          {
            path: 'product',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'product',
            meta: { title: '貨物設定' }
          },
          {
            path: 'warehous',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'warehouse',
            meta: { title: '倉庫設定' }
          }]
      },
      {
        path: 'contentmenu',
        component: () => import('@/views/nested/menu2/index'),
        name: 'ContentMenu',
        meta: { title: '內容相關設定' },
        children: [
          {
            path: 'currency',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'currency',
            meta: { title: '貨幣設定' }
          },
          {
            path: 'customtype2',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'customtype2',
            meta: { title: '沖賬方式' }
          },
          {
            path: 'customtype3',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'customtype3',
            meta: { title: '銀行設定' }
          },
          {
            path: 'product',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'product',
            meta: { title: '賬戶設定' }
          },
          {
            path: 'warehous水',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'warehouse',
            meta: { title: '常用項目設定' }
          }]
      },
      {
        path: 'parametermenu',
        component: () => import('@/views/nested/menu2/index'),
        name: 'ContentMenu',
        meta: { title: '系統參數設定' },
        children: [
          {
            path: 'currency',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'currency',
            meta: { title: '糸統編號設定' }
          },
          {
            path: 'currency',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'currency',
            meta: { title: '屬性偏好設定' }
          },
          {
            path: 'currency',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'currency',
            meta: { title: '印表機設定' }
          },
          {
            path: 'currency',
            component: () => import('@/views/nested/menu1/menu1-1'),
            name: 'currency',
            meta: { title: '檔案路徑設定' }
          }]
      }
    ]
  },
  {
    path: '/setting',
    component: Layout,
    children: [
      {
        path: 'index',
        name: 'Setting',
        component: () => import('@/views/setting/index'),
        meta: { title: '進階功能', icon: 'form' }
      }]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
