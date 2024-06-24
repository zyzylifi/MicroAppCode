<template>
  <client-only>
  <section class="home-page">
    <div class="bg-gray-1 bg-box pt-25 pb-15">
      <!-- 搜索 -->
      <div class="search-outer">
        <div class="home-search">
          <el-input :placeholder="placeholder" v-model="homeSearchValue">
            <el-select
              class="w-100"
              v-model="homeSelectValue"
              @change="changeSelect"
              slot="prepend"
              placeholder="请选择"
            >
              <el-option label="职位" value="1"></el-option>
              <el-option label="企业" value="2"></el-option>
            </el-select>
            <el-button slot="append" @click="searchIt">搜索</el-button>
          </el-input>
          <div class="search-labels">
            <p>
              <label class="C666">热搜职位：</label>
              <el-tag
                v-for="(item,index) in homeData.hotKeyList"
                @click="toJobList(null,null,item)"
                :key="index"
                size="small"
              >{{item}}</el-tag>
            </p>
          </div>
        </div>
      </div>

      <div class="w-1200-auto">
        <!-- 职位分类 -->
        <div class="classify-part">
          <div class="class-l">
            <el-popover
              placement="right-start"
              title
              width="635"
              trigger="hover"
              v-for="(item,index) in jobTypeArr"
              :key="index"
            >
              <ul class="classify-2">
                <li v-for="(itemLevel2,index2) in item.childList" :key="index2">
                  <h4 @click="toJobList(itemLevel2,2)">{{itemLevel2.text}}</h4>
                  <p>
                    <span
                      v-for="(itemLevel3,index3) in itemLevel2.childList"
                      :key="index3"
                      @click="toJobList(itemLevel3,3)"
                      :title="itemLevel3.text"
                    >{{itemLevel3.text}}</span>
                  </p>
                </li>
              </ul>
              <h3 slot="reference" class="level-1" @click="toJobList(item,1)">
                {{item.text}}
                <i class="el-icon-arrow-right"></i>
              </h3>
            </el-popover>
          </div>
          <div class="class-m">
            <el-carousel indicator-position="outside" :interval="4500">
              <el-carousel-item v-for="(item,index) in homeData.indexBannelList" :key="index">
                <img
                  :src="item.bannelUrlWeb"
                  style="object-fit: cover;height: 485px;width: 100%;border-radius: 4px;"
                />
              </el-carousel-item>
            </el-carousel>
          </div>
        </div>
      </div>
    </div>

    <div class="bg-box">
      <div class="w-1200-auto">
        <!-- 最新职位 -->
        <div class="recommend-job latest-job">
          <h2 class="h2-title">最新职位</h2>
          <ul class="job-list">
            <li v-for="(item,index) in homeData.newJobList" :key="index">
              <el-card>
                <div class="job-mess">
                  <p>
                    <span @click="toJobDetail(item)">{{item.jobTitle}}</span>
                    <span>{{item.salaryRange === '不限'? '薪资不限' : item.salaryRange}}</span>
                  </p>
                  <p>
                    <span>{{item.workCity || '-'}}</span>
                    <el-divider direction="vertical"></el-divider>
                    <span>{{ item.workExperience === -1 ? '不限经验' : `${item.workExperience}年经验`}}</span>
                  </p>
                </div>
                <div class="comp-mess">
                  <img
                    v-if="item.enterpriseLogo"
                    :src="item.enterpriseLogo"
                    :alt="item.enterpriseName"
                  />
                 
                  <div>
                    <p>{{item.enterpriseName}}</p>
                    <p class="mt-5">
                      <span>{{item.scale}}人以上</span>
                      <el-divider direction="vertical"></el-divider>
                      <span>{{item.industry || '其他行业'}}</span>
                    </p>
                  </div>
                </div>
              </el-card>
            </li>
          </ul>
          <el-button class="w-350-auto mb-30" type="primary" plain @click="toJobList">查看更多</el-button>
        </div>
      </div>
    </div>

    <div class="bg-box bg-gray-1">
      <div class="w-1200-auto">
        <!-- 名企招聘 -->
        <div class="famous-company">
          <h2 class="h2-title">名企招聘</h2>
          <ul class="company-list">
            <li v-for="(item,index) in homeData.famousEnterpriseList" :key="index">
              <el-card>
                <div :class="['img-out','bg'+index]">
                  <img :src="item.logo" :alt="item.name" width="80px" height="80px" />
                </div>

                <p class="title">{{item.name}}</p>
                <p class="labels">
                  <span>{{item.scale}}人以上</span>
                  <el-divider direction="vertical"></el-divider>
                  <span>{{item.industry || '其他行业'}}</span>
                </p>

                <div size="small" class="w-130 btn-job">
                  <span class="blue">{{item.recruitJobCount}}</span>
                  个热招职位
                  <!-- 弹层 -->
                  <div class="job-modal">
                    <p class="title">{{item.name}}</p>
                    <ul>
                      <li
                        @click="toJobDetail(jobItem)"
                        v-for="(jobItem,jobIndex) in item.jobs"
                        :key="jobIndex"
                      >
                        <template v-if="jobIndex < 5">
                          <i class="el-icon-suitcase"></i>
                          {{jobItem.jobTitle}}
                        </template>
                      </li>
                    </ul>
                    <el-button size="small" type="text" @click="toEnterpriseDetail(item)">更多职位 >></el-button>
                  </div>
                </div>
              </el-card>
            </li>
          </ul>
          <el-button @click="toEnterpriseList" class="w-350-auto mb-30" type="primary" plain>查看更多</el-button>
        </div>
      </div>
    </div>
  </section>
</client-only>
</template>

<script>
import Vue from "vue";
import homeApi from "@/api/homeApi";
import { jobType as jobTypeArr} from '@/assets/js/dictData'

export default {
  data() {
    return {
      jobTypeArr,
      placeholder: "请输入要搜索的关键字，如：会计、仓管、设计师等",
      homeSelectValue: "1",
      homeSearchValue: "",
      homeData: [],
    };
  },
  mounted() {
  },
  methods: {
    changeSelect(){},
    searchIt(){
      if(window.__MICRO_APP_ENVIRONMENT__){
        const baseRouter = window.microApp.router.getBaseAppRouter()
        console.log(baseRouter)
        baseRouter.push("/main/childJob")
      }
    },
    toJobList(){
      if(window.__MICRO_APP_ENVIRONMENT__){
        window.microApp.dispatch({
          activeIndex:'job'
        })
      }
    },
    toJobDetail(){},
    toEnterpriseDetail(){},
    toEnterpriseList(){}
  },
  asyncData({ store, params }) {
    return homeApi.getIndexData(params).then(res => {
      let { data } = res;
      let { hotJobList, famousEnterpriseList, newJobList } = data;

      return { homeData: data };
    });
  },
 
};
</script>

<style  lang="scss" >
.classify-2 {
  max-height: 540px;
  overflow: auto;
  li {
    margin-bottom: 15px;
    h4 {
      font-size: 15px;
      margin-bottom: 10px;
      padding-left: 5px;
      color: #333;
      cursor: pointer;
      transition: all 0.2s;
      &:hover {
        color: #409eff;
        text-decoration: underline;
      }
    }
    p {
      span {
        font-size: 14px;
        color: #666;
        line-height: 24px;
        margin: 0 5px;
        cursor: pointer;
        width: 110px;
        display: inline-block;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        transition: all 0.2s;
        &:hover {
          color: #409eff;
          text-decoration: underline;
        }
      }
    }
  }
}
.home-page {
  background-color: #eaf0f9;
  min-height: calc(100vh - 400px);

  .h2-title {
    text-align: center;
    font-size: 32px;
    color: #333;
    margin: 30px auto;
    font-weight: bold;
    &::before {
      content: "";
      width: 30px;
      height: 30px;
      background: url(https://storage.360buyimg.com/channel2022/jd_home/0.0.16/assets/sprite/floor_hd/sprite.png)
        no-repeat;
      background-size: 50px;
      background-position: 5px 5px;
      display: inline-block;
      margin-right: 12px;
      vertical-align: -5px;
    }
    &::after {
      content: "";
      width: 30px;
      height: 30px;
      background: url(https://storage.360buyimg.com/channel2022/jd_home/0.0.16/assets/sprite/floor_hd/sprite.png)
        no-repeat;
      background-size: 50px;
      background-position: -25px 5px;
      display: inline-block;
      margin-left: 12px;
      vertical-align: -5px;
    }
  }
  .search-outer {
    display: flex;
    justify-content: space-between;
    width: 1115px;
    margin: 0 auto;
    .code-imgs {
      display: flex;
      .left {
        p.active {
          color: #409eff;
        }
      }
      .right {
        padding-left: 15px;
      }
      p {
        font-size: 12px;
        color: #666;
        margin: 5px 0;
        cursor: pointer;
      }
      img {
        width: 85px;
        height: 85px;
        border-radius: 4px;
      }
    }
  }
  .home-search {
    width: 900px;
    margin: 0 auto;
    .el-input__inner {
      line-height: 50px;
      height: 50px;
      font-size: 15px;
      border-color: #3385ff;
      border-left: none;
      border-width: 1px;
      border-top-left-radius: 0px;
      border-bottom-left-radius: 0px;
    }
    .el-input-group__prepend {
      background-color: #fff;
      border-color: #3385ff;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
      border-width: 1px;
      .el-input__inner {
        color: #333 !important;
      }
    }
    .el-input-group__append {
      background-color: #3385ff;
      color: #fff;
      font-size: 16px;
      width: 90px;
      text-align: center;
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
      border-color: #3385ff;
    }
    .el-select__caret:before {
      content: "\e78f";
    }
    .labels {
      span {
        margin-right: 15px;
      }
    }
  }
  .search-labels {
    margin-top: 15px;
    font-size: 12px;
    display: flex;
    z-index: 10;
    position: relative;
    justify-content: space-between;
    .el-tag {
      margin-right: 15px;
      background-color: #fff;
      border-radius: 4px;
      transition: all 0.2s;
      cursor: pointer;
      &:hover {
        background-color: #409eff;
        color: #fff !important;
      }
    }
  }
  .classify-part {
    margin: 15px auto;
    display: flex;
    justify-content: space-between;
    .el-carousel {
      overflow: hidden;
    }
    .class-l {
      width: 240px;
      border-radius: 4px;
      background-color: #fff;
      height: 485px;
      overflow: hidden;
      box-shadow: 0px 4px 10px 6px rgba(200, 200, 200, 0.15);
      .level-1 {
        transition: all 0.3s;
        border-radius: 4px;
        color: #333;
        &:hover {
          box-shadow: 0 4px 16px 0 rgba(153, 153, 153, 0.2);
          .el-icon-arrow-right {
            color: #3385ff;
          }
        }
      }
      h3 {
        font-size: 15px;
        padding: 13px 15px;
        position: relative;
        cursor: pointer;
        font-weight: normal;

        .el-icon-arrow-right {
          position: absolute;
          right: 9px;
          top: 17px;
          color: #ccc;
          font-size: 14px;
        }
      }
    }
    .class-m {
      width: 950px;
      height: 485px;
      background-color: #f5f5f5;
      .el-carousel__container {
        height: 485px;
        overflow: hidden;
      }
      .el-carousel__item {
        border-top-left-radius: 0;
        border-bottom-left-radius: 0;
        height: 485px;
      }
      .el-carousel__indicators--outside {
        margin-top: -20px;
      }
    }
  }
  .recommend-job {
    .job-list {
      display: flex;
      // justify-content: space-between;
      flex-wrap: wrap;
      li {
        margin: 0 10px 20px 10px;
        .el-divider--horizontal {
          margin: 10px 0;
        }
        .el-card {
          border-radius: 4px;
          width: 270px;
          transition: all 0.2s;
          .el-card__body {
            padding: 0;
          }
          &:hover {
            transform: translateZ(0) translateY(-4px);
          }
          .job-mess {
            padding: 15px 15px 10px 15px;
            p {
              &:first-child {
                display: flex;
                justify-content: space-between;
                margin-bottom: 10px;
                span {
                  &:first-child {
                    color: #333;
                    font-size: 14px;
                    cursor: pointer;
                    max-width: 120px;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    display: inline-block;
                    white-space: nowrap;
                  }
                  &:last-child {
                    color: #ff6f47;
                    font-size: 14px;
                    font-weight: bold;
                    max-width: 50%;
                    display: inline-block;
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                  }
                }
              }
              &:last-child {
                span {
                  color: #999;
                  font-size: 12px;
                }
              }
            }
          }
          .comp-mess {
            display: flex;
            padding: 15px;
            background: linear-gradient(90deg, #f2fafa 0, #fcfbfa 100%);
            img {
              width: 45px;
              height: 45px;
              border-radius: 4px;
              margin-right: 10px;
              border: 1px solid #eaebec;
              background-color: #f5f5f5;
            }
            div {
              p {
                font-size: 14px;
                &:first-child {
                  color: #333;
                  max-width: 200px;
                  white-space: nowrap;
                  text-overflow: ellipsis;
                  overflow: hidden;
                }
                &:last-child {
                  span {
                    color: #999;
                    font-size: 12px;
                  }
                }
              }
            }
          }
        }
      }
    }
  }
  .recommend-talent {
    .talent-list {
      display: flex;
      justify-content: space-between;
      flex-wrap: wrap;
      li {
        margin: 0 10px 20px 10px;
        .el-card {
          border-radius: 4px;
          width: 270px;
          transition: all 0.2s;
          &:hover {
            transform: translateZ(0) translateY(-4px);
          }
        }
      }
      .part-1 {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .title {
          font-size: 16px;
          color: #333;
        }
        img {
          width: 32px;
          height: 32px;
          border-radius: 4px;
        }
      }
      .part-2 {
        span {
          color: #999;
          font-size: 12px;
        }
      }
      .part-3 {
        margin-top: 5px;
        color: #999;
      }
    }
  }
}
</style>
