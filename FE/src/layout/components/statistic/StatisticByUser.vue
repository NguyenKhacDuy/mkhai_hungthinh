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
      <span style="margin-right:10px">Tên nhân viên:</span>
      <el-select @change="selectUser()" v-model="valueUser" filterable placeholder="Chọn người">
        <el-option
          v-for="item in users"
          :key="item.id"
          :label="item.name"
          :value="item.id">
        </el-option>
      </el-select>
    </div>
    <div class="con-time">
      <div class="choose-type-statistic">
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
    </div>
    <el-table class="cus-table" :data="result" style="width: 100%">
      <el-table-column label="#" type="index" width="50"></el-table-column>
      <el-table-column label="Tên nhân viên">
        <template slot-scope="scope">
          <span>{{scope.row.user.fullname}}</span>
        </template>
      </el-table-column>
      <el-table-column label="Chi nhánh">
        <template slot-scope="scope">
          <span>{{scope.row.user.Department.departmentName}}</span>
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
      <el-table-column prop="totalMoney" label="Tổng tiền chi (VNĐ)"></el-table-column>
    </el-table>
  </div>
</template>

<script>
import { getAllUser } from '@/api/user'
import { statisticByUser } from '@/api/statistic'
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
      users: [],
      monthValue:'',
      valueUser: '',
      selectOption: 0,
      dayTime: {},
      dateForm: {
        startDate: '',
        endDate: ''
      },
      result: [],
      resultStatistic: {},
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
    this.getAllUser();
    this.valueUser = this.userInfos.id
  },
  methods: {
    formatMoney(money) {
      if (money === 0) return '0'
      money = money.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      return money;
    },
    selectUser() {
      let data = {
        id: this.valueUser,
        startTime: this.dayTime.start,
        endTime: this.dayTime.end
      }
      this.getStatisticByUser(data)

    },
    selectDate(time){
      this.dayTime = {}
      this.dayTime = {
        start: this.formatDate(time[0]) + ' 00:00:00',
        end: this.formatDate(time[1]) + ' 23:59:59'
      }
      if (this.dayTime) {
        let data = {
          id: this.valueUser,
          startTime: this.dayTime.start,
          endTime: this.dayTime.end
        }
        this.getStatisticByUser(data)
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
          id: this.valueUser,
          startTime: this.dayTime.start,
          endTime: this.dayTime.end
        }
        this.getStatisticByUser(data)
      }
    },
    changeTypeStatistic(){
    },
    formatDate(date){
      return moment(date).format("YYYY-MM-DD")
    },
    getStatisticByUser(data) {
      this.resultStatistic = {}
      this.result = []
      return statisticByUser(data).then(res => {
        if (res.status === 1) {
          this.resultStatistic = Object.assign({},res.result)
          this.result.push(this.resultStatistic)
        }
        this.result[0].totalMoney = this.result[0].totalMoney.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
        
      })
    },
    getAllUser() {
      return getAllUser().then(res => {
        let user = {}
        if (res.status === 1) {
          res.result.forEach(u => {
            user = {
              id: u.id,
              name: u.fullname
            }
            this.users.push(user)
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