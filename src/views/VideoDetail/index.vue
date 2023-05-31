<template>
  <div>
    <main>
      <div class="wrapper">
        <div class="play-panel">
          <div class="videoTitle">
            {{ videoDetail.videoTitle }}
          </div>

          <div class="videoBox">
            <video :src="videoDetail.videoResSrc" controls></video>
          </div>

          <div class="videoInfo">
            <div class="top">
              <div class="l">
                <span class="releaseTime">
                  <span class="tag">发布时间</span>
                  <span class="value">
                    {{ videoDetail.videoReleaseTime }}
                  </span>
                </span>
                <span class="playNum">
                  <span class="tag">播放量</span>
                  <span class="value">
                    {{ videoDetail.videoPlayNum }}
                  </span>
                </span>
                <span class="thumbNum">
                  <span class="tag">点赞量</span>
                  <span class="value">
                    {{ videoDetail.videoThumbNum }}
                  </span>
                </span>
                <span class="videoType">
                  <span class="tag">视频分类 : </span>
                  <span class="value">
                    {{ videoTypeMapObj[videoDetail.videoType] }}
                  </span>
                </span>
              </div>
              <div class="r">
                <div class="op">
                  <i
                    class="bi bi-hand-thumbs-up"
                    v-if="
                      authorInfo.username !== $store.state.userInfo.username
                    "
                    @click="thumbUp"
                  ></i>
                  <i
                    class="bi bi-pencil-square"
                    v-if="
                      authorInfo.username === $store.state.userInfo.username
                    "
                    @click="openMask('edit-videoInfo')"
                  ></i>
                  <i
                    class="bi bi-trash3"
                    v-if="
                      authorInfo.username === $store.state.userInfo.username
                    "
                    @click="delUserVideo_"
                  ></i>
                </div>
              </div>
            </div>
            <div class="des">
              {{ videoDetail.videoIntro }}
            </div>
          </div>

          <div class="videoRemark">
            <div class="inputArea">
              <div class="avatar">
                <img :src="$store.state.userInfo.avatar" alt="" />
              </div>

              <div class="textarea">
                <textarea
                  name="userRemark"
                  id="textarea_remark"
                  placeholder="发表评论..."
                  v-model.trim="userRemark"
                  @keyup.enter="postVideoRemark('0')"
                ></textarea>
              </div>
            </div>
            <div class="remarkArea">
              <div class="remark-item" v-for="item in videoT1RemarkList" :key="item.id">
                <div class="userInfo">
                  <div class="avatar">
                    <img :src="item.avatar" alt="" />
                  </div>
                  <div class="username">{{item.speaker}}</div>
                </div>

                <div class="remark">
                  {{item.remarkContent}}
                </div>

                <div class="post-time">{{item.postTime}}</div>

                <div class="ops">
                  <span class="check-detail" @click="openMask('remark-detail',item.id)"
                    >查看详情</span
                  >
                </div>

                <div class="tip" v-show="item.hasReply">该评论有回复</div>
              </div>
            </div>
          </div>
        </div>

        <div class="side-panel">
          <div class="author-box">
            <div class="l">
              <div class="avatar">
                <img :src="authorInfo.avatar" alt="" />
              </div>
            </div>
            <div class="r">
              <div class="authorName">
                {{ authorInfo.username }}
              </div>
              <button
                type="button"
                class="op"
                :disabled="
                  $store.state.userInfo.username === authorInfo.username
                "
                @click="subscribe"
              >
                订阅
              </button>
            </div>
          </div>
          <div class="recom-box">
            <div class="head">
              <div class="title">更多精彩</div>
              <div class="op" @click="changeCurBatch">
                <i class="bi bi-arrow-repeat"></i>
                <span>换一批</span>
              </div>
            </div>
            <div class="body" v-if="remainsVideoList.length">
              <a
                :href="`/userDetail/video?username=${authorInfo.username}&videoID=${item.videoID}`"
                class="v-item"
                v-for="item in sideVideoList"
                :key="item.videoID"
              >
                <div class="t">
                  <img :src="item.videoCoverSrc" alt="" />
                  <div class="mask">
                    <span class="visit">
                      <i class="bi bi-play-btn"></i>
                      {{ item.videoPlayNum }}
                    </span>
                    <span class="duration">
                      {{ durationFormat_(item.videoDuration) }}
                    </span>
                  </div>
                </div>

                <div class="b">
                  <div class="title">{{ item.videoTitle }}</div>
                </div>
              </a>
            </div>
            <div class="msg" v-else>没有更多了哟~</div>
          </div>
        </div>

        <div class="mask" v-show="showMask">
          <div class="container-mask">
            <div
              class="edit-videoInfo"
              v-if="maskContentType === 'edit-videoInfo'"
            >
              <div class="head">编辑视频信息</div>
              <div class="body">
                <form id="form_edit" @submit="editVideoInfo_">
                  <div class="title">
                    <label for="title">视频标题 :</label>
                    <input
                      type="text"
                      id="title"
                      name="videoTitle"
                      v-model="editForm.videoTitle"
                    />
                  </div>
                  <div class="intro">
                    <label for="intro">视频介绍 :</label>
                    <textarea
                      name="videoIntro"
                      id="intro"
                      v-model="editForm.videoIntro"
                    ></textarea>
                  </div>
                  <div class="cover">
                    <label for="cover">视频封面 :</label>
                    <div class="box">
                      <div
                        class="uploadBtn"
                        @click="$refs.refCoverPicker.click()"
                      >
                        <i class="bi bi-upload"></i>
                      </div>
                      <div class="filename_cover">
                        {{ selectedCoverFileName }}
                      </div>
                    </div>
                    <input
                      ref="refCoverPicker"
                      type="file"
                      id="cover"
                      name="videoCover"
                      @change="selectedCoverChange"
                    />
                  </div>
                  <div class="ops">
                    <button
                      type="button"
                      id="cancelBtn"
                      @click="closeMask('edit-videoInfo')"
                    >
                      取消
                    </button>
                    <button type="submit">提交</button>
                  </div>
                </form>
              </div>
            </div>

            <div
              class="remark-detail"
              v-else-if="maskContentType === 'remark-detail'"
            >
              <div class="head">
                <div class="title">评论详情</div>
                <div class="op" @click="closeMask('remark-detail')">
                  <i class="bi bi-x-square-fill"></i>
                </div>
              </div>
              <div class="body">
                <div class="container-remark">
                  <div class="remark-item" v-for="item in T1RemarkReplyList" :key="item.id">

                  <div class="userInfo">
                    <div class="avatar">
                      <img :src="item.avatar" alt="">
                    </div>
                    <div class="username">{{item.speaker}}</div>
                  </div>

                  <div class="remark">
                    <div class="sign-at" v-show="item.signAt">@{{item.signAt}}:</div>

                    <div class="content-remark">
                      {{item.remarkContent}}
                    </div>
                  </div>

                  <div class="post-time">
                    {{item.postTime}}
                  </div>

                  <div class="ops">
                    <span class="reply" @click="openReplyBox(item.id,item.speaker)">回复 ta</span>
                  </div>
                </div>
                </div>
              </div>
              <div :class="`bottomBar ${curRemarkIDToBeReplied?'active':''}`">
                <textarea
                  name="textarea_reply"
                  id="textarea_reply"
                  v-model.trim="replyContent"
                  @keyup.enter="postVideoRemark(curRemarkIDToBeReplied)"
                ></textarea>
                <div class="sign-at">@{{curUsernameToBeReplied}}:</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
import { durationFormat } from '@/utils/tools'

import {
  getUserVideoDetail,
  getUserInfoByUsername,
  getUserVideoList,
  addUserSubscription,
  addUserSubscriber,
  videoPlayNumInc,
  videoThumbUpInc,
  delUserVideo,
  editUserVideoInfo,
  getUserVideoRemark,
  addUserVideoRemark
} from '@/api/user'

export default {
  name: 'videoDetail-page',

  data () {
    return {
      videoDetail: {},
      videoTypeMapObj: {
        '00': '未知',
        '01': '日常',
        '02': '游戏',
        '03': '天文'
      },
      authorInfo: {},
      authorVideoList: [],
      sideVideoList: [],
      //
      showMask: false,
      maskContentType: '',
      editForm: {},
      selectedCoverFileName: '',
      //
      videoT1RemarkList: [],
      userRemark: '',
      //
      T1RemarkReplyList: [],
      curRemarkIDToBeReplied: '',
      curUsernameToBeReplied: '',
      replyContent: ''
    }
  },

  computed: {
    remainsVideoList () {
      return this.authorVideoList.filter(
        (item) => item.videoID !== this.videoDetail.videoID
      )
    }

  },

  components: {},

  methods: {
    async getUserVideoRemark_ (id) {
      const { data } = await getUserVideoRemark({
        username: this.authorInfo.username,
        videoID: this.videoDetail.videoID,
        id
      })
      return data
    },

    async  getVideoT1RemarkList () {
      const tempList = []

      const videoRemarkList = await this.getUserVideoRemark_()

      for (let i = 0; i < videoRemarkList.length; i++) {
        const item = videoRemarkList[i]
        if (item.pid === '0') {
          const { data: speakerInfo } = await getUserInfoByUsername(item.speaker)
          tempList.push({
            ...item,
            avatar: speakerInfo.avatar
          })
        }
      }
      this.videoT1RemarkList = tempList
    },

    async getT1RemarkReplyList (curRemarkID) {
      const T1RemarkReplyList = await this.getUserVideoRemark_(curRemarkID)
      const tempList = []
      for (let i = 0; i < T1RemarkReplyList.length; i++) {
        const item = T1RemarkReplyList[i]
        const remarkSignAt = T1RemarkReplyList.find(item_ => item_.id === item.pid)
        const { data: speakerInfo } = await getUserInfoByUsername(item.speaker)
        tempList.push({
          ...item,
          avatar: speakerInfo.avatar,
          signAt: remarkSignAt ? remarkSignAt.speaker : null
        })
      }
      this.T1RemarkReplyList = tempList
    },

    changeCurBatch () {
      if (this.remainsVideoList.length <= 3) {
        // 如果作者剩余的视频数量≤3，全部显示
        this.sideVideoList = this.remainsVideoList
      } else {
        this.sideVideoList = []
        // 如果＞3，随机3个下标
        const tempList = [...this.remainsVideoList]
        let randomIndex
        for (let i = 0; i < 3; i++) {
          randomIndex = parseInt(Math.random() * tempList.length)
          this.sideVideoList.push(tempList[randomIndex])
          tempList.splice(randomIndex, 1)
        }
      }
    },

    durationFormat_ (d) {
      return durationFormat(d)
    },

    async subscribe () {
      await addUserSubscription({
        username_user: this.$store.state.userInfo.username,
        username_author: this.authorInfo.username,
        uid_author: this.authorInfo.uid
      })

      await addUserSubscriber({
        username_user: this.authorInfo.username,
        username_mySubscriber: this.$store.state.userInfo.username,
        uid_mySubscriber: this.$store.state.userInfo.uid
      })
    },

    async thumbUp () {
      await videoThumbUpInc({
        username: this.authorInfo.username,
        videoID: this.videoDetail.videoID
      })
    },

    async delUserVideo_ () {
      await delUserVideo({
        username: this.authorInfo.username,
        videoID: this.videoDetail.videoID
      })

      this.$router.push('/user/pFactory')
    },

    async  openMask (contentType, curRemarkID) {
      this.maskContentType = contentType
      this.showMask = true

      if (curRemarkID) {
        this.getT1RemarkReplyList(curRemarkID)
      }
    },

    selectedCoverChange (e) {
      if (e.target.files.length === 1) {
        this.editForm.videoCover = e.target.files[0]
        this.selectedCoverFileName = e.target.files[0].name
      } else {
        this.selectedCoverFileName = ''
      }
    },

    async editVideoInfo_ (e) {
      e.preventDefault()

      const fd = new FormData()
      fd.append('username', this.authorInfo.username)
      fd.append('videoID', this.videoDetail.videoID)
      fd.append('videoTitle', this.editForm.videoTitle)
      fd.append('videoIntro', this.editForm.videoIntro)
      fd.append('videoCover', this.editForm.videoCover)

      await editUserVideoInfo(fd)

      this.$router.push('/user/pFactory')
    },

    openReplyBox (curRemarkIDToBeReplied, curUsernameToBeReplied) {
      this.curRemarkIDToBeReplied = curRemarkIDToBeReplied
      this.curUsernameToBeReplied = curUsernameToBeReplied
    },

    closeMask (contentType) {
      if (contentType === 'edit-videoInfo') {
        this.editForm = {}
      } else if (contentType === 'remark-detail') {
        this.replyContent = ''
        this.T1RemarkReplyList = []
        this.curRemarkIDToBeReplied = ''
      }

      this.maskContentType = ''
      this.showMask = false
    },

    async postVideoRemark (pidOfThisRemark) {
      if (pidOfThisRemark === '0') {
        if (!this.userRemark) return

        await addUserVideoRemark({
          username: this.authorInfo.username,
          videoID: this.videoDetail.videoID,
          pid: pidOfThisRemark,
          speaker: this.$store.state.userInfo.username,
          remarkContent: this.userRemark
        })

        this.userRemark = ''
      } else {
        if (!this.replyContent) return

        await addUserVideoRemark({
          username: this.authorInfo.username,
          videoID: this.videoDetail.videoID,
          pid: pidOfThisRemark,
          speaker: this.$store.state.userInfo.username,
          remarkContent: this.replyContent
        })

        this.replyContent = ''

        this.getT1RemarkReplyList(this.T1RemarkReplyList[0].id)
      }

      // 获取视频评论列表
      this.getVideoT1RemarkList()
    }
  },

  async created () {
    this.$emit('changeBgI', 'video')

    const { data: videoDetail } = await getUserVideoDetail({
      username: this.$route.query.username,
      videoID: this.$route.query.videoID
    })

    const { data: authorInfo } = await getUserInfoByUsername(
      this.$route.query.username
    )

    const { data: authorVideoList } = await getUserVideoList(
      this.$route.query.username
    )

    this.videoDetail = videoDetail
    this.authorInfo = authorInfo
    this.authorVideoList = authorVideoList

    // 初始时，显示右侧推荐视频列表
    this.changeCurBatch()
    // 获取视频T1评论列表
    this.getVideoT1RemarkList()

    // 如果用户是访客，则视频的播放量 +1
    if (this.$store.state.userInfo.username !== this.authorInfo.username) {
      await videoPlayNumInc({
        username: this.$route.query.username,
        videoID: this.$route.query.videoID
      })
    }
  }
}
</script>
<style lang="less" scoped src="@/styles/play.less"></style>
