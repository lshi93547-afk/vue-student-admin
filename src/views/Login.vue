<template>
  <div class="login-page">
    <el-card class="login-card">
      <h2>学生信息管理后台</h2>
      <p class="tip">演示账号：admin / 123456</p>

      <el-form ref="formRef" :model="form" :rules="rules" label-width="0" @keyup.enter="onSubmit">
        <el-form-item prop="username">
          <el-input v-model="form.username" placeholder="用户名" size="large" />
        </el-form-item>
        <el-form-item prop="password">
          <el-input v-model="form.password" type="password" placeholder="密码" size="large" show-password />
        </el-form-item>
        <el-button type="primary" size="large" :loading="loading" style="width: 100%" @click="onSubmit">
          登录
        </el-button>
      </el-form>
    </el-card>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { ElMessage } from 'element-plus'
import http from '../api/http'

const router = useRouter()
const formRef = ref(null)
const loading = ref(false)

const form = reactive({ username: 'admin', password: '123456' })

// 表单校验规则：面试常问"表单校验怎么做的"，就是这一块
const rules = {
  username: [{ required: true, message: '请输入用户名', trigger: 'blur' }],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, message: '密码至少 6 位', trigger: 'blur' }
  ]
}

async function onSubmit() {
  // 1. 先做前端校验
  const ok = await formRef.value.validate().catch(() => false)
  if (!ok) return

  loading.value = true
  try {
    // 2. 查接口：json-server 返回的是数组
    const users = await http.get('/users', { params: { username: form.username, password: form.password } })

    // 3. 查不到 → 账号或密码错误，直接返回（finally 会把 loading 复原）
    if (users.length === 0) {
      ElMessage.error('账号或密码错误')
      return
    }

    // 4. 查到 → 存 token（真实项目由后端返回，这里先写死）和用户名
    localStorage.setItem('token', 'demo-token')
    localStorage.setItem('userName', users[0].name)
    ElMessage.success('登录成功')
    router.push('/app/students')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #00264d 0%, #0d3b66 60%, #1c5d99 100%);
}
.login-card {
  width: 380px;
  padding: 8px;
}
h2 {
  text-align: center;
  color: #00264d;
  margin: 8px 0 4px;
}
.tip {
  text-align: center;
  color: #909399;
  font-size: 13px;
  margin-bottom: 18px;
}
</style>
