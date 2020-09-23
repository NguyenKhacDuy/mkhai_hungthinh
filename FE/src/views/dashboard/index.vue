<template>
  <div class="dashboard-container">
    <div class="dashboard-text">Lịch họp</div>
    <div v-if="schedule">
      <span>Thời gian tạo: </span><span>{{formatDate(schedule.createdAt)}}</span>
    </div>
    <div v-if="schedule" style="margin-top:20px">
      <span>Tiêu đề: </span><span>{{schedule.title}}</span>
    </div>
    <div v-if="schedule" style="margin-top:20px">
      <span>Nội dung: </span><span>{{schedule.content}}</span>
    </div>
    <div style="margin-top:20px">
      <el-carousel :interval="5000" arrow="hover" height="800px">
        <el-carousel-item v-for="(item,index) in images" :key="index">
          <el-image @click="onClickDownImage(item)" style="height:100%; width:100%" fit="contain" :src="item" class="image"></el-image>
        </el-carousel-item>
      </el-carousel>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import moment from 'moment'
import { getLatestMettingSchedule,download } from '@/api/notification'
import FileSaver from 'file-saver';
export default {
  name: 'Dashboard',
  computed: {
    ...mapGetters([
      'name',
      'role',
      'userInfos'
    ])
  },
  data() {
    return {
      schedule: null,
      images: []
    }
  },
  created() {
    this.getLatestSchedule()
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
    getLatestSchedule() {
      return getLatestMettingSchedule().then(res => {
        if (res.status === 1) {
          this.schedule = Object.assign({}, res.result)
          console.log(this.schedule)
          let imageString = []
          this.images = []
          if(this.schedule.files == null || this.schedule.files == undefined || this.schedule.files == '') {
            this.$message('Không có hình ảnh nào');
          } else {
            imageString = this.schedule.files.split(',')
            imageString.forEach(element => {
              if (element) {
                this.images.push(process.env.VUE_APP_BASE_API + '/static/' + element)
              }
            });
          }
        }
      })
    },
    formatDate(date) {
      if (date) {
        return moment(date).format("DD/MM/YYYY");
      }
    }
  },
}
</script>

<style lang="scss" scoped>
.dashboard {
  &-container {
    margin: 30px;
  }
  &-text {
    font-size: 30px;
    line-height: 46px;
    text-align: center;
  }
}
</style>