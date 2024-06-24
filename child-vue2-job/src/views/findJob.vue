<template>
  <section class="find-job-page">
    <!-- 搜索 -->
    <div class="header-search-outer">
      <div class="home-search">
        <el-input
          placeholder="请输入职位名称或公司，例如：销售"
          v-model="searchName"
          clearable
          @clear="searchJobList"
        >
          <el-button slot="append" @click="searchJobList">搜索</el-button>
        </el-input>
      </div>
    </div>

    <div class="search-header w-1200-auto">
      <!-- 筛选 -->
      <div class="filters">
        <!-- 职位 -->
        <div class="item filter-job">
          <span class="more-btn" @click="moreWords(1)">
            {{isExpand1 ? '收起' : '更多'}}
            <i class="el-icon-arrow-down"></i>
          </span>
          <label>职位：</label>
          <p :class="['labels info-menu', {expand: isExpand1}]">
            <span :class="!jobActive && 'el-tag'" @click="handleAll('jobType')">全部</span>
            <span
              :class="[jobActive == item.value && 'el-tag'] "
              v-for="(item,index) in jobTypeArr"
              :key="index"
              @click="changeJob(item,'职位类型')"
            >{{item.text}}</span>
          </p>
        </div>
        <!-- 地点 -->
        <div class="item filter-address">
          <span class="more-btn" @click="moreWords(2)">
            {{isExpand2 ? '收起' : '更多'}}
            <i class="el-icon-arrow-down"></i>
          </span>
          <label>地点：</label>
          <p :class="['labels info-menu', {expand: isExpand2}]">
            <span :class="!addressActive && 'el-tag'" @click="handleAll('address')">全部</span>
            <span
              v-for="(item,index) in addressDict"
              :key="index"
              @click="getCities(item)"
            >{{item.n}}</span>
          </p>
          <p class="cities" v-if="cityArr.length > 0">
            <span
              :class="[addressActive == item.value && 'el-tag'] "
              v-for="(item,index) in cityArr"
              :key="index"
              @click="changeJob(item,'地点')"
            >{{item.n}}</span>
          </p>
        </div>
        <!-- 薪资 -->
        <div class="item filter-salary pr-0">
          <label>薪资：</label>
          <p class="labels">
            <span :class="!salaryActive && 'el-tag'" @click="handleAll('salary')">全部</span>
            <span
              :class="[salaryActive == item.value && 'el-tag'] "
              v-for="(item,index) in salaryDict"
              :key="index"
              @click="changeJob(item,'薪资')"
            >{{item.label}}</span>
          </p>
        </div>
      </div>
    </div>

    <!-- 表格 -->
    <div class="job-part">
      <!-- 左侧 -->
      <ul class="job-list" v-if="jobList && jobList.length > 0">
        <li v-for="(item,index) in jobList" :key="index">
          <div class="part-1">
            <div class="left">
              <el-button class="title" type="text" @click="toJobDetail(item)">{{item.jobTitle}}</el-button>
              <p>
                <span class="salary">{{item.salaryRange === '不限'? '薪资不限' : item.salaryRange}}</span>
                <span class="label" v-if="item.workCity">{{item.workCity}}</span>
                <span class="label" v-if="item.workExperience">{{item.workExperience}}年经验</span>
              </p>
            </div>
            <div class="right">
              <img :src="item.enterpriseLogo" :alt="item.enterpriseName" />
              <div class="comp-mess">
                <p class="title" @click="toEnterpriseDetail(item)">{{item.enterpriseName}}</p>
                <span class="label" v-if="item.industry">{{item.industry}}</span>
                <span class="label" v-if="item.scale">{{item.scale}}人以上</span>
              </div>
            </div>
          </div>
          <div class="part-2" v-if="item.welfareTags && item.welfareTags.length > 0">
            <p class="labels">
              <span v-for="(itemInner,indexInner) in item.welfareTags" :key="indexInner">
                {{itemInner}}
                <el-divider direction="vertical" v-if="indexInner < item.welfareTags.length - 1"></el-divider>
              </span>
            </p>
            <p class="time">{{item.refreshTimeStr}}更新</p>
          </div>
        </li>
      </ul>
      <el-empty
        style="justify-content: flex-start;"
        v-else
        class="margin-center"
        description="暂无职位"
      ></el-empty>
      <!-- 右侧 -->
      <div class="recommend-comp">
        <h3 class="hui-title">推荐企业</h3>
        <el-divider></el-divider>
        <ul v-if="enterpriseList && enterpriseList.length > 0">
          <li v-for="(item,index) in enterpriseList" :key="index" @click="toEnterpriseDetail(item)">
            <img :src="item.enterpriseLogo" :alt="item.enterpriseName" />
            <p>{{item.enterpriseName}}</p>
          </li>
        </ul>
        <el-empty v-else description="虚位以待"></el-empty>
      </div>
    </div>

    <el-pagination
      class="w-1200-auto mt-20 text-center"
      :current-page.sync="pageNumber"
      background
      layout="total,sizes,prev, pager, next"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="10"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    ></el-pagination>
  </section>
</template>

<script>
import findJobApi from "@/api/findJobApi";
import { jobType as jobTypeArr} from '@/assets/js/dictData'

export default {
  data() {
    return {
      addressDict:[],
      isExpand1: false,
      isExpand2: false,
      searchName: "",
      dynamicTags: [
        {
          职位类型: [{}]
        },
        {
          地点: [{}]
        },
        {
          薪资: [{}]
        }
      ],
      jobActive: 0,
      addressActive: 0,
      salaryActive: 0,
      welfareTags: [],
      education: "",
      workExperience: "",
      scale: "",
      refreshTimeCycle: "",
      labelCode: [],
      isEmergency: false,
      checkList1: [
        {
          label: "紧急职位",
          value: "true"
        }
      ],
      checkList2: [
        {
          label: "热门职位",
          value: "hot"
        }
      ],
      refreshTimeOptions: [
        { label: "近三天", value: "last_three_day" },
        { label: "近一周", value: "this_week" },
        { label: "近一个月", value: "day30" },
        { label: "全部", value: "" }
      ],
      salaryDict: [
        {
          value: 1,
          label: "1000-3000"
        },
        {
          value: 2,
          label: "3000-5000"
        },
        {
          value: 3,
          label: "5000-8000"
        },
        {
          value: 4,
          label: "8000-12000"
        },
        {
          value: 5,
          label: "12000-30000"
        },
        {
          value: 6,
          label: "30000-50000"
        },
        {
          value: 7,
          label: "50000-80000"
        },
        {
          value: 8,
          label: "80000-100000"
        }
      ],
      pageNumber: 1,
      pageSize: 10,
      enterpriseList: [],
      educationArr: [],
      workExperienceArr: [],
      financingArr: [],
      welfareOptions: [],
      enterpriseScaleArr: [],
      cityArr: [],
      jobList: [],
      total: 0,
      jobType1: "", // 职位类型
      workCity: "", // 地点
      jobTypeArr:[]
    };
  },
  mounted() {
    if(window.__MICRO_APP_ENVIRONMENT__){
      // 获取基座应用的数据
      this.jobTypeArr = window.rawWindow.jobTypeArr
    }else{
      this.jobTypeArr= jobTypeArr
    }
    this.getAddressDict()
    this.searchJobList();
  },
  methods: {
    toEnterpriseDetail() {},
    toJobDetail(item) {
      console.log(item)
      this.$router.push(`/jobDetail?jobId=${item.jobId}`)
    },
    getCities(e) {
      this.cityArr = e.l;
    },
    getAddressDict(){
      findJobApi.getAddressDict({}).then(res => {
        this.addressDict = res
      });
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.searchJobList();
        } else {
          console.log("error submit!!");
          return false;
        }
      });
    },
    handleAll(flag) {
      if (flag === "jobType") {
        this.jobActive = false;
        this.jobType1 = null;
        this.jobType2 = null;
        this.jobType3 = null;
        this.dynamicTags[0]["职位类型"] = [{}];
      } else if (flag === "address") {
        this.addressActive = false;
        this.workCity = null;
        this.dynamicTags[1]["地点"] = [{}];
      } else if (flag === "salary") {
        this.salaryActive = false;
        this.salaryMin = null;
        this.salaryMax = null;
        this.dynamicTags[2]["薪资"] = [{}];
      }
      this.searchJobList();
    },
    handleLabelCode1(e) {
      this.isEmergency = e;
      this.searchJobList();
    },
    handleLabelCode2(e) {
      this.labelCode = e;
      this.searchJobList();
    },
    handleTime(e) {
      this.refreshTimeCycle = e;
      this.searchJobList();
    },
    handleWelfare(e) {
      this.welfareTags = e;
      this.searchJobList();
    },
    handleEducation(e) {
      this.education = e;
      this.searchJobList();
    },
    handleWorkExperience(e) {
      this.workExperience = e;
      this.searchJobList();
    },
    handleScale(e) {
      this.scale = e;
      this.searchJobList();
    },
    moreWords(number) {
      this["isExpand" + number] = !this["isExpand" + number];
    },
    searchJobList() {
      let params = {};
      let {
        pageSize,
        pageNumber,
        jobType1,
        jobType2,
        jobType3,
        workCity,
        salaryMin,
        salaryMax,
        welfareTags,
        education,
        workExperience,
        scale,
        refreshTimeCycle,
        labelCode,
        isEmergency,
        searchName
      } = this;
      params.listType = "search";
      params.searchName = searchName;
      params.pageSize = pageSize;
      params.pageNumber = pageNumber;
      params.jobType1 = jobType1;
      params.jobType2 = jobType2;
      params.jobType3 = jobType3;
      params.workCity = workCity;
      params.salaryMin = salaryMin
      params.salaryMax =salaryMax
      params.welfareTags = welfareTags;
      params.education = education;
      params.workExperience = workExperience;
      params.scale = scale;
      params.refreshTimeCycle = refreshTimeCycle;
      params.isEmergency = isEmergency;
      params.labelCode = labelCode && labelCode.join(",");
      findJobApi.searchJobList(params).then(res => {
        let { data, success, message } = res;
        if (success) {
          let { records, total } = data;
          this.total = total;
          this.jobList = records;
          let arr = [...records]
          this.enterpriseList = arr.splice(0,7)
        } else {
          this.$message.error({
            duration: 1500,
            message
          });
        }
      });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchJobList();
    },
    handleCurrentChange(val) {
      this.pageNumber = val;
      this.searchJobList();
    },
    changeJob(e, flag) {
      let obj = {};
      obj[flag] = [];
      if (flag === "职位类型") {
        e.label = e.text;
        this.jobActive = e.value;
        let { level } = this.$route.query;
        if (level == 2) {
          this.jobType2 = e.value;
        } else if (level == 3) {
          this.jobType3 = e.value;
        } else {
          this.jobType1 = e.value;
        }
        obj[flag].push(e);
        this.dynamicTags[0] = obj;
      } else if (flag === "地点") {
        e.value = e.c;
        e.label = e.n;
        this.addressActive = e.c;
        this.workCity = e.n;
        obj[flag].push(e);
        this.dynamicTags[1] = obj;
      } else if (flag === "薪资") {
        this.salaryActive = e.value;
        let arr = e.label.split("-");
        this.salaryMin = arr[0];
        this.salaryMax = arr[1];
        obj[flag].push(e);
        this.dynamicTags[2] = obj;
      }
      this.searchJobList();
    },
    changeSelect(e) {
      this.homeSelectValue = e;
    }
  }
};
</script>

<style  lang="scss">
.find-job-page {
  padding-bottom: 15px;
  background-color: #eaf0f9;
  min-height: calc(100vh - 400px);
  position: relative;
  .header-search-outer {
    background-image: url(~@/assets/images/banner_job.jpg);
    margin-bottom:15px;
  }
  .search-header {
    border-radius: 4px;
    background-color: #fff;
    padding: 30px 30px 15px 30px;
    box-sizing: border-box;
    .selected-div {
      position: relative;
      label {
        color: #333;
        font-size: 4px;
        font-weight: bold;
        position: absolute;
        top: 4px;
      }
      .more-btn {
        position: absolute;
        right: 15px;
        font-size: 4px;
        top: 4px;
        cursor: pointer;
        transition: all 0.2s;
        color: #666;
        &:hover {
          color: #3385ff;
        }
      }
      .labels {
        padding-left: 20px;
      }
      .el-tag {
        background-color: #409eff;
      }
    }

    .filters {
      .info-menu {
        max-height: 26px;
        overflow: hidden;
        margin-bottom: 4px;
        white-space: pre-wrap;
        &.expand {
          max-height: 200px;
          overflow: auto;
          -webkit-line-clamp: 300 !important;
        }
      }
      .item {
        position: relative;
        margin-bottom: 10px;
        padding-right: 80px;
        min-height: 26px;
        &.filter-address {
          .cities {
            border-radius: 6px;
            background-color: #f5f5f5;
            padding: 10px 15px;
            text-align:left;
            span {
              margin-right: 15px;
              font-size: 4px;
              color: #666;
              cursor: pointer;
            }
          }
        }
        .salary-inputs {
          display: inline-block;
          .el-form-item {
            display: inline-block;
            margin-bottom: 0;
            margin-top: -10px;
          }
          .el-input__inner {
            padding: 0 0 0 8px;
          }
          .el-button.is-round {
            margin-left: 5px;
          }
        }
        label {
          color: #333;
          font-size: 12px;
          font-weight: bold;
          position: absolute;
          top: 4px;
          left:0;
        }
        .labels {
          display: flex;
          flex-wrap: wrap;
          padding-left:50px;
          & > span {
            font-size: 13px;
            color: #666666;
            cursor: pointer;
            transition: all 0.2s;
            height: 26px;
            margin-bottom: 5px;
            line-height: 26px;
            padding: 0 10px;
            &.el-tag {
              background-color: #3385ff;
              color: #fff;
              border: none;
              &:hover {
                color: #fff;
              }
            }
            &:hover {
              color: #3385ff;
            }
          }
        }
        .more-btn {
          position: absolute;
          right: 15px;
          font-size: 4px;
          color: #3385ff;
          top: 4px;
          cursor: pointer;
          color: #666;
          &:hover {
            color: #3385ff;
          }
        }
      }
    }
  }
}
</style>
