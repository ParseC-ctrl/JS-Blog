<template>
  <div>
    <!-- <div class="block">{{ uploadTitle }}</div> -->
    <el-switch
      style="display: block;margin: 40px 0px 20px 0px;"
      v-model="isUseOss"
      active-color="#13ce66"
      inactive-color="#ff4949"
      active-text="上传至AliYunOSS"
      inactive-text="上传至本地服务器"
    >
    </el-switch>
    <el-upload
      class="avatar-uploader"
      :action="uploadUrl"
      :show-file-list="false"
      :headers="headers"
      :on-success="handleAvatarSuccess"
      :before-upload="beforeAvatarUpload"
    >
      <img v-if="value" :src="imageUrl" class="avatar" />
      <i v-else class="el-icon-plus avatar-uploader-icon"></i>
    </el-upload>
  </div>
</template>

<script>
import { server_URL } from "@/urlConfig";

export default {
  data() {
    return {
      isUseOss:false
    }
  },
  props: ["uploadTitle", "value"],
  computed: {
    imageUrl() {
      if (this.value) {
        return server_URL + this.value;
      }
    },
    headers() {
      return {
        Authorization: "Bearer " + localStorage.getItem("adminToken"),
      };
    },
    uploadUrl(){
      return this.isUseOss ? '/api/uploadByAliOss' : '/api/upload';
    }
  },
  methods: {
    handleAvatarSuccess(res) {
      if (!res.code && res.data) {
        this.$emit("input", res.data);
      }
    },
    beforeAvatarUpload() {},
  },
};
</script>

<style lang="scss" scoped>
.block {
  margin: 15px 0;
}

.avatar-uploader .el-upload {
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409eff;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 178px;
  height: 178px;
  line-height: 178px;
  text-align: center;
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
}
.avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>