<template>
  <div class="container-wait-approval">
    <el-table :data="arrLicense" style="width: 100%">
      <el-table-column label="Mã chứng từ">
        <template slot-scope="scope">
          <span>{{formatId(scope.row.id)}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Người tạo">
        <template slot-scope="scope">
          <span>{{scope.row.Creator.fullname}}</span>
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
      <el-table-column align="right" width="130">
        <template slot-scope="scope">
          <el-button class="btn" size="mini" @click="openDialogDetails(scope.row)">Chi tiết</el-button>
          <el-button class="btn" style="margin: 5px 0px" @click="onApproveLicense(scope.row)" size="mini" type="primary">Chi</el-button>
          <el-button class="btn" size="mini" type="danger" @click="handleCancel(scope.row)">Không chi</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-drawer title="Lý do không chi" :visible.sync="drawer">
      <div class="container-reason">
        <el-form :model="objCancelReason" :rules="rules" ref="ruleReason">
          <el-form-item prop="cancelReason">
            <el-input type="textarea" :rows="20" placeholder="Nhập vào lý do" v-model="objCancelReason.cancelReason"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button size="mini" type="primary" @click="onCancelLicense('ruleReason')">Xác nhận</el-button>
            <el-button size="mini" type="danger" @click="onCloseDrawer('ruleReason')">Đóng</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>
    <el-dialog custom-class="dialog-custom" title="Chi tiết chứng từ" :append-to-body="true" :close-on-click-modal="false" :visible.sync="isOpenDetailLicense">
      <dialog-detail :data="license" />
    </el-dialog>
  </div>
</template>

<script>
import { getWaitingPayLicense, approvePayLicense, cancelLicense } from "@/api/accountant";
import DetailsLicense from '@/layout/components/dialog/DetailsLicense'
import moment from "moment";
export default {
  components: {
    'dialog-detail': DetailsLicense
  },
  data() {
    return {
      rules: {
        cancelReason: [
            { required: true,message: 'Nội dung không được để trống', trigger: 'blur'}
          ],
      },
      isOpenDetailLicense: false,
      drawer: false,
      license: null,
      arrLicense: [],
      objCancelReason: {
        id: undefined,
        cancelReason: ''
      }
    };
  },
  created() {
    this.getWaitingLicense();    
  },
  
  methods: {
    formatMoney(money) {
      money = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return money;
    },
    formatId(id) {
      return id.toString().padStart(7, "0");
    },
    handleCancel(license) {
      this.drawer = true;
      this.objCancelReason.id = license.id
    },
    onCancelLicense(ruleReason) {
      this.$refs[ruleReason].validate((valid) => {
        if (valid) {
          this.onCancel(this.objCancelReason);
        } else {
          alert('Bạn chưa nhập lý do');
          return false;
        }
      })
    },
    onCloseDrawer(ruleReason) {
      this.$refs[ruleReason].resetFields();
      this.drawer = false
    },
    openDialogDetails(license) {
      this.isOpenDetailLicense = true
      this.license = Object.assign({},license)
    },
    onApproveLicense(license) {
      this.$confirm('Bạn có muốn duyệt chi chứng từ này không ?', 'Warning', {
          confirmButtonText: 'Phê duyệt',
          cancelButtonText: 'Hủy bỏ',
          type: 'warning'
        }).then(() => {
          this.approve(license.id);
        }).catch(() => {})
    },
    getWaitingLicense() {
      this.arrLicense = [];
      return getWaitingPayLicense()
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
    approve(idLicense) {
      return approvePayLicense(idLicense).then(res => {
        if (res.status === 1) {
          this.$message({
            type: 'success',
            message: 'Phê duyệt thành công'
          });
          this.getWaitingLicense();
        }
      }).catch(err => {
        Promise.reject(err)
      })
    },
    onCancel(data) {
      return cancelLicense(data).then(res => {
        if (res.status === 1) {
          this.$message({
            type: 'success',
            message: 'Hủy thành công'
          });
          this.getWaitingLicense();
          this.$refs['ruleReason'].resetFields();
          this.drawer = false
        }
      })
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
  .container-reason {
    margin-left: 10px;
  }
  .container-buttons {
    margin-top: 20px;
  }
}
.dialog-custom {
    margin-top: 20px !important;
}
</style>

<style scoped>

</style>