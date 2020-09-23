<template>
  <div class="container-d-statistic">
    <div class="slect-user">
      <span style="margin-right:10px">Thống kê theo&nbsp;</span>
      <el-select
        v-model="selectOption"
        placeholder="Tùy chọn"
         @change="changeTypeStatistic()"
      >
        <el-option label="Theo Ngày" :value="0"></el-option>
        <el-option label="Theo Tháng" :value="1"></el-option>
      </el-select>
    </div>
    <div class="slect-user">
      <span style="margin-right:10px">Chọn đơn vị&nbsp;&nbsp;&nbsp;&nbsp;</span>
      <el-select @change="selectDept()" v-model="valueDept" filterable placeholder="Chọn đơn vị">
        <el-option
          v-for="item in departments"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="con-time">
      <label style="margin-right:5px; font-weight:400">Chọn thời gian:</label>
      <el-date-picker
        v-show="selectOption === 0"
        v-model="time"
        type="daterange"
        range-separator="-"
        start-placeholder="Bắt đầu"
        end-placeholder="Kết thúc"
        @change="selectDate(time)"
      ></el-date-picker>
      <el-date-picker
        v-show="selectOption === 1"
        v-model="monthValue"
        type="month"
        @change="selectMonth(monthValue)"
        placeholder="Chọn tháng"
      ></el-date-picker>
    </div>
    <el-divider></el-divider>
    <div class="info-statistic">
      <el-row>
        <el-col :span="5">
          <label>Tổng số chứng từ: </label>
          <label>{{totalLicenseDept}}</label>
        </el-col>
         <el-col :span="5">
          <label>Tổng số tiền: </label>
          <label>{{formatMoney(totalMoneyDept)}} VNĐ</label>
        </el-col>
      </el-row>
    </div>
    <el-table class="cus-table" :data="result" style="width: 100%">
      <el-table-column label="#" type="index" width="50"></el-table-column>
      <el-table-column label="Tên nhân viên">
        <template slot-scope="scope">
          <span>{{scope.row.user.fullname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Chức danh">
        <template slot-scope="scope">
          <span v-if="scope.row.user.role === 'Creator'">Người tạo</span>
          <span v-if="scope.row.user.role === 'Approver'">Người phê duyệt</span>
          <span v-if="scope.row.user.role === 'Accountant'">Kế toán</span>
        </template>
      </el-table-column>
      <el-table-column prop="totalLicense" label="Tổng số chứng từ"></el-table-column>
      <el-table-column prop="totalMoney" label="Tổng tiền đã được chi (VNĐ)"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllDepartment } from '@/api/department'
import { statisticByDept } from '@/api/statistic'
import { mapGetters } from 'vuex'
import moment, { months } from "moment"
export default {
  data() {
    return {
      pickerOptions: {
        disabledDate(time) {
          return time.getTime() > Date.now();
        }
      },
      time: "",
      selectOption: 0,
      departments: [],
      monthValue:'',
      valueDept: '',
      dayTime: {},
      dateForm: {
        startDate: '',
        endDate: ''
      },
      totalLicenseDept: '',
      totalMoneyDept: '',
      result: [],
      rules: {
        startDate: [
          { required: true, message: 'Nhập thời gian bắt đầu', trigger: 'blur' },
        ],
        endDate: [
          { required: true, message: 'Nhập thời gian kết thúc', trigger: 'blur' }
        ]
    }
    };
  },
  computed: {
    ...mapGetters(['userInfos'])
  },
  created() {
    this.getDept();
    this.valueDept = this.userInfos.Department.id
  },
  methods: {
    selectDept() {
      let data = {
        departmentId: this.valueDept,
        startTime: this.dayTime.start,
        endTime: this.dayTime.end
      }
      this.getStatisticByDept(data)

    },
    changeTypeStatistic(){
    },
    selectDate(time){
      this.dayTime = {}
      this.dayTime = {
        start: this.formatDate(time[0]) + ' 00:00:00',
        end: this.formatDate(time[1]) + ' 23:59:59'
      }
      if (this.dayTime) {
        let data = {
          departmentId: this.valueDept,
          startTime: this.dayTime.start,
          endTime: this.dayTime.end
        }
        this.getStatisticByDept(data)
      }
    },
    selectMonth(month){
        if (!month) return
      this.dayTime = {}
      this.dayTime = {
        start: this.formatDate(new Date(month.getFullYear(), month.getMonth(), 1)) + ' 00:00:00',
        end: this.formatDate(new Date(month.getFullYear(), month.getMonth() + 1, 0)) + ' 23:59:59'
      }
      if (this.dayTime) {
        let data = {
          departmentId: this.valueDept,
          startTime: this.dayTime.start,
          endTime: this.dayTime.end
        }
        this.getStatisticByDept(data)
      }
    },
    formatDate(date){
      return moment(date).format("YYYY-MM-DD")
    },
    getStatisticByDept(data) {
      this.result = []
      return statisticByDept(data).then(res => {
        if (res.status === 1) {
          this.result.push(...res.result.staffStatistics)
          this.totalLicenseDept = res.result.totalLicenseDepartment
          this.totalMoneyDept = res.result.totalMoneyDepartment
        }
        this.result.forEach(item=> {
          item.totalMoney = item.totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        })
      })
    },
    formatMoney(money) {
      if (money === 0) return '0'
      money = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return money;
    },
    getDept() {
      return getAllDepartment().then(res => {
        let dept = {}
        if (res.status === 1) {
          res.result.forEach(d => {
            dept = {
              id: d.id,
              name: d.departmentName,
              address: d.address
            }
            this.departments.push(dept)
          })
        } else {
          return false
        }
      }).catch(err => {
        Promise.reject(err)
      })
    }
  }
};
</script>

<style lang="scss" scoped>
.container-d-statistic {
  padding: 10px 10px;
  .choose-time {
    margin-left: 20px;
    margin-right: 20px;
  }
  .slect-user {
    margin-bottom: 10px;
  }
  .cus-table {
    margin-top: 20px;
  }
}
</style>