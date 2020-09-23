<template>
  <div class="dialog-details">
    <el-form :data="data">
      <el-form-item>
        <el-col :sm="{span: 11, offset: 0}">
          <el-form-item label="Mã chứng từ:">
            <span>{{data.id}}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="{span: 11, offset: 0}" style="float:right">
          <el-form-item label="Người tạo:">
            <span>{{data.Creator.fullname}}</span>
          </el-form-item>
        </el-col>
      </el-form-item>
      <el-form-item>
        <el-col :sm="{span: 11, offset: 0}">
          <el-form-item label="Ngày tạo:">
            <span>{{formatDate(data.createdAt)}}</span>
          </el-form-item>
        </el-col>
        <el-col :sm="{span: 11, offset: 0}" style="float:right">
          <el-form-item label="Đơn vị:">
            <span>{{data.Department.departmentName}}</span>
          </el-form-item>
        </el-col>
      </el-form-item>
       <el-form-item label="Số tiền:">
         <span>{{formatMoney(data.money)}} VNĐ</span>
      </el-form-item>
       <el-form-item label="Nội dung:">
        <span>{{data.content}}</span>
      </el-form-item>
      <el-form-item label="Ghi chú:">
        <span>{{data.note}}</span>
      </el-form-item>
      <el-form-item v-if="data.status === 2 || data.status === 4" label="Lý do:">
        <span>{{data.cancelReason}}</span>
      </el-form-item>
      <el-form-item label="Hình ảnh đính kèm:">
        <el-button size="mini" icon="el-icon-picture-outline" @click="viewImage()">Xem</el-button>
      </el-form-item>
    </el-form>

    <el-dialog custom-class="dialog-custom-image" width="70%" title="Chứng từ" :close-on-click-modal="false" :visible.sync="dialogVisible" :modal-append-to-body="false" :append-to-body="true">
      <el-carousel :interval="5000" arrow="always" height="500px">
        <el-carousel-item v-for="(item,index) in images" :key="index">
          <el-image @click="onClickDownImage(item)" style="height:100%" fit="contain" :src="item" class="image"></el-image>
        </el-carousel-item>
      </el-carousel>
      <span slot="footer" class="dialog-footer">
        <el-button type="primary" size="mini" @click="dialogVisible = false">Trở về</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import moment from 'moment'
import { download } from '@/api/notification'
import FileSaver from 'file-saver';
export default {
  props: {
    data: Object
  },
  data() {
    return {
      dialogVisible: false,
      images: []
    }
  },
  created() {
  },
  methods: {
    onClickDownImage(item) {
      let filename = item.split('/').reverse()[0]
      download({ filename }).then(res => {
        let extension = filename.split('.').reverse()[0]

        if (res.status === 2) {
          return
        }
        console.log('here')
        if(extension === 'jpg') {
          FileSaver.saveAs(new Blob([res], { type: 'image/jpeg' }), filename)
        } else if(extension === 'png') {
          FileSaver.saveAs(new Blob([res], { type: 'image/png' }), filename)
        } else {
          alert('Loại file không hỗ trợ download')
        }
      }).catch(err => console.log(err))
    },
    formatMoney(money) {
      if (money === 0) return '0'
      money = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return money;
    },
    formatDate(date) {
      return moment(date).format("DD-MM-YYYY");
    },
    viewImage(){
      let imageString = []
      this.images = []
      if(this.data.images == null || this.data.images == undefined || this.data.images == '') {
        this.$message('Không có hình ảnh nào');
      } else {
          imageString = this.data.images.split(',')
          imageString.forEach(element => {
            if (element) {
              this.images.push(process.env.VUE_APP_BASE_API + '/static/' + element)
            }
          });
        this.dialogVisible = true
      }
    }
  },
};
</script>

<style lang="scss">
.dialog-custom-image {
  margin-top: 20px !important;
}
.el-dialog {
  margin-top: 10px !important;
}
</style>