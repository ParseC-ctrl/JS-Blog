import request from '@/utils/request'

// 查看文章标签接口
export function getBlogTag() {
    return request.get('/api/blogtag');
}

// 添加文章标签接口
export function addBlogTag(data) {
    return request({
        url: '/api/blogtag',
        method: 'post',
        data
    })
}

// 查找某一个文章分类
export function findOneBlogTag(id) {
    return request({
        url: `/api/blogtag/${id}`,
        method: 'get',
    })
}

// 删除文章分类接口
export function delBlogTag(id) {
    return request.delete(`/api/blogtag/${id}`);
}

// 更新某一个文章分类
export function updateOneBlogTag(editInfo) {
    return request({
        url: `/api/blogtag/${editInfo.id}`,
        method: 'put',
        data: editInfo.data
    })
}
