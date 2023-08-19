import request from "@/utils/request";

export function findBlog(page = 1, limit = 10, keyword = "") {
  return request({
    url: "/api/blog",
    method: "get",
    params: {
      page,
      limit,
      keyword,
    },
  });
}

export function delOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: "delete",
  });
}

export function addBlog(data) {
  return request({
    url: "/api/blog",
    method: "post",
    data,
  });
}

export function editBlog(blogInfo) {
  return request({
    url: `/api/blog/${blogInfo.id}`,
    method: "put",
    data: blogInfo.data,
  });
}

export function findOneBlog(id) {
  return request({
    url: `/api/blog/${id}`,
    method: "get",
  });
}
