import { request } from '@/utils/request.js'
import store from '@/store/index.js'

export const getUserInfo = (username) => {
  return request.get(`/pInfo/${username}`)
}

export const getUserInfoByUid = (uid) => {
  return request.get(`/pInfo?uid=${uid}`)
}

export const getUserInfoByUsername = (username) => {
  return request.get(`/pInfo/${username}`)
}

export const register = (data) => {
  return request.post('/register', data)
}

export const login = (data) => {
  return request.post('/login', data)
}

export const logout = () => {
  return request.post('/logout', {
    username: store.state.userInfo.username
  })
}

export const updateState = () => {
  return request.post('/state', { username: store.state.userInfo.username })
}

export const uploadAvatar = (data) => {
  return request.post('/avatarTemp', data)
}

export const updateUserInfo = (data) => {
  return request.put('/pInfo', data)
}

export const getUserVideoList = (username) => {
  return request.get(`/videoList/${username}`)
}

export const getUserVideoDetail = (params) => {
  return request.get('/video', {
    params
  })
}

export const getUserArticleList = (username) => {
  return request.get(`/articleList/${username}`)
}

export const uploadVideo = (username, data) => {
  return request.post(`/upVideo/${username}`, data)
}

export const uploadArticle = (username, data) => {
  return request.post(`/upArticle/${username}`, data)
}

export const videoPlayNumInc = (params) => {
  return request.get('/videoPlayNum/inc', { params })
}

export const videoThumbUpInc = (params) => {
  return request.get('/videoThumbNum/inc', { params })
}

export const delUserVideo = (params) => {
  return request.delete('/video', { params })
}

export const editUserVideoInfo = (data) => {
  return request.put('/video', data)
}

export const addUserVideoRemark = (data) => {
  return request.post('/remark', data)
}

export const getUserVideoRemark = ({ username, videoID, id }) => {
  return request.post(`/remark/${username}/${videoID}`, { id })
}

export const getUserSubscription = (username) => {
  return request.get(`/subscription/${username}`)
}

export const getUserSubscriber = (username) => {
  return request.get(`/subscriber/${username}`)
}

export const addUserSubscription = (data) => {
  return request.post('/subscription', data)
}

export const addUserSubscriber = (data) => {
  return request.post('/subscriber', data)
}

export const delUserSubscription = (username, usernameAuthor) => {
  return request.delete(`/subscription/${username}/${usernameAuthor}`)
}

export const delUserSubscriber = (username, usernameSubscriber) => {
  return request.delete(`/subscriber/${username}/${usernameSubscriber}`)
}

export const getUserFriends = (username) => {
  return request.get(`/friendList/${username}`)
}

export const addFriend = (data) => {
  return request.post('/friend', data)
}

export const addMessage = (data) => {
  return request.post('/message', data)
}

export const getUserMessageList = (username) => {
  return request.get(`/messageList/${username}`)
}

export const getUserMessageDetail = (username, mID) => {
  return request.get('/message', {
    params: {
      username,
      mID
    }
  })
}

export const updateUserMessage = (data) => {
  return request.put('/message', data)
}

export const getUserState = (username) => {
  return request.get(`/state/${username}`)
}

export const addChattingLog = (data) => {
  return request.post('/chattingLog', data)
}

export const getUsersChattingLog = (usernameA, usernameB) => {
  return request.get(`/chattingLog/${usernameA}/${usernameB}`)
}

export const addNsp = (data) => {
  return request.post('/nsp', data)
}

export const delNsp = (params) => {
  return request.delete('/nsp', {
    params
  })
}

export const getNsp = (params) => {
  return request.get('/nsp', {
    params
  })
}
