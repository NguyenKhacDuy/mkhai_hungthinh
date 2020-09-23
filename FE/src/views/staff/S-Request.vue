<template>
  <div class="container-create-request">
    <el-form :model="license" :rules="rules" ref="ruleForm">
      <el-form-item label="Nội dung" prop="content">
        <el-input type="textarea" v-model="license.content"></el-input>
      </el-form-item>
      <el-form-item label="Ghi chú" prop="note">
        <el-input type="textarea" v-model="license.note"></el-input>
      </el-form-item>
      <el-form-item label="Số tiền" prop="money" style="display:inline-block">
        <div>
          <el-input-number v-model="license.money" controls-position="right" :min="1000" ></el-input-number>
          <span>(VNĐ)</span>
        </div>
      </el-form-item>
        <div class="container-image-license">
          <input type="file" multiple accept="image/*" @change="handleSelects" name="images" ref="fileInput" style="display:none" />
          <input type="button" @click="$refs.fileInput.click()" value="Chọn hình ảnh" style="margin-bottom:10px">
          <span>(Bấm vào ảnh để xóa)</span>
          <div class="container-image" style="display:flex; flex-wrap: wrap;">
            <div class="block" v-for="(image, i ) in images" :key="i">
              <el-image @click="removeImage(image)" style="width: 150px; height: 150px; margin-right:10px" :src="image" fit="cover"></el-image>
            </div>
          </div>
        </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit('ruleForm')">Tạo yêu cầu</el-button>
        <el-button>Hủy bỏ</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { createLicense } from '@/api/license'
import axios from 'axios'
export default {
  data() {
    return {
      rules: {
        content: [
            { required: true,message: 'Nội dung không được để trống', trigger: 'blur'},
            // { required: true, pattern: /^[a-zA-Z0-9_ÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶ"+"ÊẸẺẼỀẾỂưăạảấầẩẫậắằẳẵặẹẻẽềếểỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợ"+"ụủứừỬỮỰYỲỴÝỶỸửữựyỳỵỷỹý\s]+$/ ,message: 'Giá trị không hợp lệ', trigger: 'blur'},
          ],
      },
      images: [],
      tempDelete: [],
      license: {
        content: "",
        money: "",
        note: ""
      },
      temp: []
    };
  },
  methods: {
    removeImage(image) {
      this.images.splice(this.images.indexOf(image),1);
      let found = this.tempDelete.find(ele => ele.img === image)
      this.temp.splice(this.temp.indexOf(found.file),1)
      this.$refs.fileInput.value = null;
    },
    handleSelects(e) {
      // let fileList = Array.prototype.slice.call(e.target.files);
      let fileList = []
      Array.prototype.push.apply(fileList, e.target.files)
      this.temp.push(...fileList)
      fileList.forEach(f => {
        if (!f.type.match("image.*")) {
          return;
        }
        if (f.size > 5 * 1024 * 1024) {
          alert("Ảnh dưới 5MB");
          return;
        }
        if (f.type === "image/jpeg" || f.type === "image/png") {
          let reader = new FileReader();
          let that = this;
          reader.onload = function(e) {
            if (!that.images.includes(e.target.result)){
              that.images.push(e.target.result);
              that.tempDelete.push({img: e.target.result , file: f})
            } else {
              alert("Trùng hình ảnh!")
            }
          };
          reader.readAsDataURL(f);
        }
      });
    },
    createLicense() {
      let formData = new FormData();
      for(let i = 0; i < this.temp.length; i++) {
        formData.append('images', this.temp[i]);
      }
      formData.append('content', this.license.content);
      formData.append('money', this.license.money);
      formData.append('note', this.license.note);
      return createLicense(formData).then(res => {
        if (res.status === 1){
            this.$notify({
              title: 'Thành công',
              message: 'Tạo yêu cầu thành công',
              type: 'success'
            })

          }
      }).catch(err => {
          this.$notify.error({
              title: 'Thất bại',
              message: 'Tạo yêu cầu thất bại!',
            })
        })
    },
    onSubmit(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.createLicense()
          this.$refs[ruleForm].resetFields();
          this.license.note = ""
          this.images = []
          this.temp = []
          this.tempDelete = []
        } else {
          return false;
        }
      });
    }
  }
};
</script>

<style lang="scss">
.container-create-request {
  padding: 10px;
  .el-upload-list {
    display: flex;
  }
  .el-upload-list--picture .el-upload-list__item {
    width: 300px;
    margin-right: 5px;
  }
  .container-image-license {
    margin-bottom: 20px;
  }
  .el-input-number{
    width: auto;
  }
}
</style>