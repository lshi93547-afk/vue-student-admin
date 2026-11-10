<template>
  <el-card shadow="never">
    <!-- 顶部工具栏 -->
    <div class="toolbar">
      <el-input v-model="query.keyword" placeholder="搜索姓名 / 学号" clearable style="width: 240px" />
      <el-button type="primary" @click="openCreate">新增学生</el-button>
    </div>

    <!-- 列表 -->
    <el-table v-loading="loading" :data="pagedRows" border stripe style="width: 100%">
      <el-table-column prop="no" label="学号" width="120" />
      <el-table-column prop="name" label="姓名" width="100" />
      <el-table-column prop="className" label="班级" />
      <el-table-column prop="phone" label="手机号" width="140" />
      <el-table-column prop="status" label="状态" width="100">
        <template #default="{ row }">
          <el-tag :type="row.status === '在读' ? 'success' : row.status === '休学' ? 'warning' : 'info'">
            {{ row.status }}
          </el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="150" fixed="right">
        <template #default="{ row }">
          <el-button link type="primary" @click="openEdit(row)">编辑</el-button>
          <el-button link type="danger" @click="remove(row)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 分页 -->
    <el-pagination
      v-model:current-page="query.page"
      v-model:page-size="query.pageSize"
      :page-sizes="[5, 10, 20]"
      :total="filteredRows.length"
      layout="total, sizes, prev, pager, next"
      style="margin-top: 16px; justify-content: flex-end"
    />

    <!-- 新增 / 编辑弹窗 -->
    <el-dialog v-model="dialogVisible" :title="isEdit ? '编辑学生' : '新增学生'" width="480px">
      <el-form ref="formRef" :model="form" :rules="rules" label-width="80px">
        <el-form-item label="学号" prop="no">
          <el-input v-model="form.no" placeholder="如 20240111" />
        </el-form-item>
        <el-form-item label="姓名" prop="name">
          <el-input v-model="form.name" />
        </el-form-item>
        <el-form-item label="班级" prop="className">
          <el-input v-model="form.className" />
        </el-form-item>
        <el-form-item label="手机号" prop="phone">
          <el-input v-model="form.phone" />
        </el-form-item>
        <el-form-item label="状态" prop="status">
          <el-select v-model="form.status" style="width: 100%">
            <el-option label="在读" value="在读" />
            <el-option label="休学" value="休学" />
            <el-option label="毕业" value="毕业" />
          </el-select>
        </el-form-item>
      </el-form>
      <template #footer>
        <el-button @click="dialogVisible = false">取消</el-button>
        <el-button type="primary" :loading="saving" @click="save">保存</el-button>
      </template>
    </el-dialog>
  </el-card>
</template>

<script setup>
import { computed, onMounted, reactive, ref } from 'vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import { getStudents, createStudent, updateStudent, deleteStudent } from '../../api/students'

const loading = ref(false)
const saving = ref(false)
const rows = ref([])

const query = reactive({ keyword: '', page: 1, pageSize: 5 })

// 前端筛选 + 分页（数据量小先这么做；想挑战自己可以改成接口分页，json-server 支持 _page/_limit）
const filteredRows = computed(() => {
  const kw = query.keyword.trim()
  if (!kw) return rows.value
  return rows.value.filter((r) => r.name.includes(kw) || String(r.no).includes(kw))
})
const pagedRows = computed(() => {
  const start = (query.page - 1) * query.pageSize
  return filteredRows.value.slice(start, start + query.pageSize)
})

async function loadData() {
  loading.value = true
  try {
    // 已接好接口：GET /students
    rows.value = await getStudents()
  } finally {
    loading.value = false
  }
}

onMounted(loadData)

/* ---------------- 新增 / 编辑 ---------------- */
const dialogVisible = ref(false)
const isEdit = ref(false)
const formRef = ref(null)
const emptyForm = { id: null, no: '', name: '', className: '', phone: '', status: '在读' }
const form = reactive({ ...emptyForm })

// TODO 第 4 天：补全校验规则（学号必填 + 数字、手机号格式、姓名必填）
const rules = {
  no: [
    { required: true, message: '请输入学号', trigger: 'blur' },
    { pattern: /^\d{8}$/, message: '学号必须是 8 位数字', trigger: 'blur' }
  ],
  name: [
    { required: true, message: '请输入姓名', trigger: 'blur' },
    { min: 2, max: 20, message: '姓名长度 2–20 个字符', trigger: 'blur' }
  ],
  className: [{ required: true, message: '请输入班级', trigger: 'blur' }],
  status: [{ required: true, message: '请选择状态', trigger: 'change' }],
  phone: [
    { required: true, message: '请输入手机号', trigger: 'blur' },
    { pattern: /^1[3-9]\d{9}$/, message: '手机号格式不正确', trigger: 'blur' }
  ]
}

function openCreate() {
  isEdit.value = false
  Object.assign(form, emptyForm)
  dialogVisible.value = true
}

function openEdit(row) {
  isEdit.value = true
  Object.assign(form, row)
  dialogVisible.value = true
}

async function save() {
  // 1. 表单校验，如果校验不通过直接返回（弹窗不关）
  const ok = await formRef.value.validate().catch(() => false)
  if (!ok) return
  
  saving.value = true
  try {
    // 2. 按 isEdit 分流，调用不同的接口
    if (isEdit.value) {
      // 编辑：调用更新接口。注意传入 form.id 和表单数据
      await updateStudent(form.id, { ...form })
    } else {
      // 新增：调用创建接口。把 id 设为 undefined，让 json-server 自动生成
      await createStudent({ ...form, id: undefined })
    }
    
    // 3. 成功逻辑：
    // - 关闭弹窗
    dialogVisible.value = false
    // - 重新加载列表（你已经写了 loadData 了）
    await loadData()
    // - 提示成功
    ElMessage.success('保存成功')
    
  } catch (error) {
    // 4. 失败逻辑：
    // 这里不需要写代码。因为 try 块里如果报错，就会跳到这里。
    // 此时 dialogVisible 不会被设置为 false，弹窗会保持开启；
    // form 里的数据也不会被清空，用户填的内容都还在。
    console.error('保存失败', error)
    // 你也可以加一句提示：ElMessage.error('保存失败，请重试')
  } finally {
    // 5. 无论成功失败，都要取消 loading 状态
    saving.value = false
  }
}

/* ---------------- 删除 ---------------- */
async function remove(row) {
  // 二次确认 + 调接口 + 刷新
  try {
    await ElMessageBox.confirm(`确定删除「${row.name}」吗？`, '提示', { type: 'warning' })
  } catch {
    return // 用户点了取消
  }
await deleteStudent(row.id)     // 先删
await loadData()                // 再拉列表（顺序不能反）
ElMessage.success('已删除')
}
</script>

<style scoped>
.toolbar {
  display: flex;
  gap: 12px;
  margin-bottom: 16px;
}
</style>
