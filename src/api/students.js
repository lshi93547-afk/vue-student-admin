import http from './http'

// json-server 按 REST 规则自动提供这些接口，直接调即可
export const getStudents = (params) => http.get('/students', { params })
export const createStudent = (data) => http.post('/students', data)
export const updateStudent = (id, data) => http.put(`/students/${id}`, data)
export const deleteStudent = (id) => http.delete(`/students/${id}`)
