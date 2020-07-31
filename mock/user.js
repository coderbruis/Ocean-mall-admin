const Mock = require('mockjs')

const userList = []
const count = 100

const tokens = {
  admin: {
    token: 'admin-token'
  },
  editor: {
    token: 'editor-token'
  }
}

for (let i = 0; i < count; i++) {
  userList.push(Mock.mock({
    id: i + 1,
    name: '@first',
    introduction: '@title(5, 10)',
    phone: '18483222717',
    email: 'bruis@qq.com',
    lastlogintime: +Mock.Random.date('T'),
    status: 'normal'
  }))
}

// eslint-disable-next-line no-unused-vars
const userList2 = [
  {
    'name': '管理者',
    'email': 'admin@qq.com',
    'phone': '18483222717',
    'introduction': 'I am a administrator!',
    'lastlogintime': '2020.7.30',
    'status': 'normal'
  },
  {
    'name': 'bruis',
    'email': 'bruis@qq.com',
    'phone': '18483222717',
    'introduction': 'I am a bruis!',
    'lastlogintime': '2020.7.30',
    'status': 'normal'
  },
  {
    'name': 'hester',
    'email': 'hester@qq.com',
    'phone': '18483222717',
    'introduction': 'I am a hester!',
    'lastlogintime': '2020.7.30',
    'status': 'normal'
  },
  {
    'name': 'luohaiyang',
    'email': 'luohaiyang@qq.com',
    'phone': '18483222717',
    'introduction': 'I am a luohaiyang!',
    'lastlogintime': '2020.7.30',
    'status': 'normal'
  },
  {
    'name': 'tangzongying',
    'email': 'tangzongying@qq.com',
    'phone': '18483222717',
    'introduction': 'I am a tangzongying!',
    'lastlogintime': '2020.7.30',
    'status': 'blocked'
  }
]

const users = {
  'admin-token': {
    roles: ['admin'],
    introduction: 'I am a super administrator',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Super Admin'
  },
  'editor-token': {
    roles: ['editor'],
    introduction: 'I am an editor',
    avatar: 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif',
    name: 'Normal Editor'
  }
}

module.exports = [
  // user login
  {
    url: '/vue-element-admin/user/login',
    type: 'post',
    response: config => {
      const { username } = config.body
      const token = tokens[username]

      // mock error
      if (!token) {
        return {
          code: 60204,
          message: 'Account and password are incorrect.'
        }
      }

      return {
        code: 20000,
        data: token
      }
    }
  },

  // get user info
  {
    url: '/vue-element-admin/user/info\.*',
    type: 'get',
    response: config => {
      const { token } = config.query
      const info = users[token]

      // mock error
      if (!info) {
        return {
          code: 50008,
          message: 'Login failed, unable to get user details.'
        }
      }

      return {
        code: 20000,
        data: info
      }
    }
  },

  // get Users Info
  {
    url: '/vue-element-admin/user-mgr/info',
    type: 'get',
    response: config => {
      const { page = 1, limit = 20, name, sort } = config.query

      let mockList = userList.filter(item => {
        if (name && item.name !== name) {
          return false
        }
        return true
      })

      if (sort === '-id') {
        mockList = mockList.reverse()
      }

      const userPageList = mockList.filter((item, index) => index < limit * page && index >= limit * (page - 1))

      return {
        code: 20000,
        data: {
          total: mockList.length,
          items: userPageList
        }
      }
    }
  },
  {
    url: '/vue-element-admin/user/create',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  },
  // user logout
  {
    url: '/vue-element-admin/user/logout',
    type: 'post',
    response: _ => {
      return {
        code: 20000,
        data: 'success'
      }
    }
  }
]
