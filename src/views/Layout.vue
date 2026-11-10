<template>
  <el-container class="layout">
    <el-header class="header">
      <div class="brand">学生信息管理后台</div>
      <div class="right">
        <span class="user">{{ userName }}</span>
        <el-button link type="primary" @click="logout">退出登录</el-button>
      </div>
    </el-header>

    <el-container>
      <el-aside width="200px" class="aside">
        <el-menu :default-active="$route.path" router>
          <el-menu-item index="/app/students">学生管理</el-menu-item>
        </el-menu>
      </el-aside>

      <el-main class="main">
        <router-view />
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup>
import { computed } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const userName = computed(() => localStorage.getItem('userName') || '管理员')

function logout() {
  localStorage.removeItem('token')
  localStorage.removeItem('userName')
  router.push('/login')
}
</script>

<style scoped>
.layout {
  height: 100vh;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  background: #00264d;
  color: #fff;
}
.brand {
  font-size: 18px;
  letter-spacing: 1px;
}
.right {
  display: flex;
  align-items: center;
  gap: 12px;
}
.user {
  font-size: 14px;
  opacity: 0.9;
}
.aside {
  border-right: 1px solid #ebeef5;
}
.main {
  background: #f5f7fa;
}
</style>
