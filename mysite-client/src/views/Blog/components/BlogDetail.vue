<template>
  <div class="blog-detail-container">
    <h1>{{ blog.title }}</h1>
    <div class="aside">
      <span>日期: {{ formatDate(blog.createDate) }}</span>
      <span>浏览: {{ blog.scanNumber }}</span>
      <a href="#data-form-container">评论: {{ blog.commentNumber }}</a>
      <RouterLink
        :to="{
          name: 'CategoryBlog',
          params: {
            categoryId: blog.category.id,
          },
        }"
      >
        {{ blog.category.name }}
      </RouterLink>
      <div class="showTag">
        <div
          class="tags"
          v-for="tag in blog.tags"
          :style="{ backgroundColor: tag.tagColor }"
        >
          {{ tag.tagName }}
        </div>
      </div>
    </div>
    <div v-html="blog.htmlContent" class="markdown-body"></div>
  </div>
</template>

<script>
import { formatDate } from "@/utils";
import "highlight.js/styles/github.css";
import "@/styles/markdown.css";
export default {
  props: {
    blog: {
      type: Object,
      required: true,
    },
  },
  methods: {
    formatDate,
  },
};
</script>

<style scoped lang="less">
@import "~@/styles/var.less";
.aside {
  font-size: 12px;
  color: @gray;
  span,
  a {
    margin-right: 15px;
  }
}

.showTag {
  display: flex;
  flex-direction: row;
  // width: 200px;
  flex-wrap: wrap;
  margin-top: 20px;
  .tags {
    padding: 2px 5px;
    border-radius: 10px;
    margin: 5px 5px;
    color: white;
    font-weight: bold;
    transition: 0.2s;
    opacity: 0.7;
    cursor: pointer;
    &:hover {
      transform: scale(1.2);
    }
  }
}
.markdown-body {
  margin: 1em 0;
}
</style>
