<template>
  <div class="container-wait-approval">
    <el-table :data="arrLicense" style="width: 100%">
      <el-table-column label="Mã chứng từ">
        <template slot-scope="scope">
          <span>{{formatId(scope.row.id)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Ngày tạo">
        <template slot-scope="scope">
          <span>{{formatDate(scope.row.createdAt)}}</span>
        </template>
      </el-table-column>
      <el-table-column prop="content" label="Nội dung"></el-table-column>
      <el-table-column label="Đơn vị">
        <template slot-scope="scope">
          <span>{{scope.row.Department.departmentName}}</span>
        </template>
      </el-table-column>
       <el-table-column label="Số tiền (VNĐ)">
        <template slot-scope="scope">
          <span>{{formatMoney(scope.row.money)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Trạng thái">
        <template slot-scope="scope">
          <el-tag v-if="scope.row.status === 1" type="info">Chờ chi</el-tag>
          <el-tag v-if="scope.row.status === 0" type="warning">Chờ duyệt</el-tag>
        </template>
      </el-table-column>
      <el-table-column align="right">
        <template slot-scope="scope">
          <el-button class="btn" size="mini" @click="openDialogDetails(scope.row)">Chi tiết</el-button>
          <el-button class="btn" v-if="scope.row.status === 0" @click="onEditLicense(scope.row)" style="margin: 5px 0px" size="mini" type="primary">Chỉnh sửa</el-button>
          <el-button class="btn" v-if="scope.row.status === 0" @click="onDeleteLicense(scope.row)" size="mini" type="danger">Xóa</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog custom-class="dialog-custom" title="Chi tiết chứng từ" :append-to-body="true" :close-on-click-modal="false" :visible.sync="isOpenDetailLicense">
      <dialog-detail :data="license" />
    </el-dialog>
    <el-dialog title="Chỉnh sửa chứng từ" width="80%" @closed="beforClose" :close-on-click-modal="false" :show-close="false" :visible.sync="isEditLicense">
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
                <el-image @click="removeImage(image, images)" style="width: 150px; height: 150px; margin-right:10px" :src="image" fit="cover"></el-image>
              </div>
              <div class="block" v-for="(newimage, ind ) in imagesNew" :key="ind+images.length">
                <el-image @click="removeImage(newimage, imagesNew)" style="width: 150px; height: 150px; margin-right:10px" :src="newimage" fit="cover"></el-image>
              </div>
            </div>
          </div>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button size="mini" @click="isEditLicense = false">Hủy bỏ</el-button>
        <el-button size="mini" type="primary" @click="editLicense('ruleForm')">Xác nhận</el-button>
      </span>
  </el-dialog>
  </div>
</template>

<script>
import { getLicenseExecuting, deleteLicense } from "@/api/creator";
import { updateLicense } from '@/api/license'
import DetailsLicense from '@/layout/components/dialog/DetailsLicense'
import moment from "moment";
export default {
  components: {
    'dialog-detail': DetailsLicense
  },
  data() {
    return {
      rules: {
        content: [
            { required: true,message: 'Nội dung không được để trống', trigger: 'blur'},
          ],
      },
      isOpenDetailLicense: false,
      isEditLicense: false,
      resion: '',
      license: null,
      arrLicense: [],
      images: [],
      imagesNew: [],
      license: {
        id: undefined,
        content: "",
        money: "",
        note: "",
        oldImage: []
      },
      temp: {},

      tempArrImage: []
    };
  },
  created() {
    this.getWaitingLicense();    
  },
  updated() {
    this.tempArrImage = []
    this.images.forEach(img => {
      this.tempArrImage.push(img.replace(process.env.VUE_APP_BASE_API + '/static/', ""))
    })
  },
  
  methods: {
    removeImage(image, arrImage) {
      arrImage.splice(arrImage.indexOf(image),1);
      this.$refs.fileInput.value = null;
    },
    handleSelects(e) {
      let fileList = []
      Array.prototype.push.apply(fileList, e.target.files)
      this.temp = fileList
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
            if (!that.imagesNew.includes(e.target.result)){
              that.imagesNew.push(e.target.result);
            } else {
              alert("Trùng hình ảnh!")
            }
          };
          reader.readAsDataURL(f);
        }
      });
    },
    formatMoney(money) {
      money = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return money;
    },
    formatId(id) {
      return id.toString().padStart(7, "0");
    },
    editLicense(ruleForm) {
      this.$refs[ruleForm].validate(valid => {
        if (valid) {
          this.update()
          this.$refs[ruleForm].resetFields();
        } else {
          return false;
        }
      });
    },
    update() {
      let formData = new FormData();
      for(let i = 0; i < this.temp.length; i++) {
        formData.append('images', this.temp[i]);
      }
      formData.append('content', this.license.content);
      formData.append('money', this.license.money);
      formData.append('note', this.license.note);
      formData.append('id', this.license.id);
      formData.append('oldFiles', this.tempArrImage);
      return updateLicense(formData).then(res => {
        if (res.status === 1) {
          this.$message({
            type: 'success',
            message: 'Cập nhật thành công'
          });
          this.getWaitingLicense();
          this.isEditLicense = false
        }
      })
    },
    onEditLicense(l) {
      this.isEditLicense = true
      this.license.content = l.content
      this.license.money = l.money
      this.license.note = l.note
      this.license.id = l.id
      this.imagesNew = []
      let imageString = []
      if(l.images == null || l.images == undefined || l.images == '') {
      } else {
          imageString = l.images.split(',')
          imageString.forEach(element => {
            if (element) {
              this.images.push(process.env.VUE_APP_BASE_API + '/static/' + element)
            }
          });
      }
    },
     beforClose() {
      this.license.content = ''
      this.license.money = ''
      this.license.note = ''
      this.imagesNew = []
      this.images = []
    },
    openDialogDetails(license) {
      this.isOpenDetailLicense = true
      this.license = Object.assign({},license)
    },
    onDeleteLicense(license) {
      this.$confirm('Bạn có muốn xóa chứng từ này không ?', 'Warning', {
        confirmButtonText: 'Xóa',
        cancelButtonText: 'Hủy bỏ',
        type: 'warning'
      }).then(() => {
        this.removeLicense(license.id);
      }).catch(() => {})
    },
    removeLicense(idLicense) {
      return deleteLicense(idLicense).then(res => {
        if (res.status === 1) {
          this.$message({
            type: 'success',
            message: 'Xóa thành công'
          });
          this.getWaitingLicense();
        }
      }).catch(err => {
        Promise.reject(err)
      })
    },
    getWaitingLicense() {
      this.arrLicense = [];
      return getLicenseExecuting()
        .then(res => {
          if (res.status === 1) {
            this.arrLicense.push(...res.result);
            this.arrLicense.reverse();
          }
        })
        .catch(err => {
          Promise.reject(err);
        });
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    }
  }
};
</script>

<style lang="scss">
.container-wait-approval {
  padding: 10px 10px;
  .btn {
    width: 100px;
  }
}
.dialog-custom {
    margin-top: 20px !important;
}
</style>

<style scoped>

</style>