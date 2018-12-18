import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import { appConfig } from '../config/app.env'

Vue.use(Vuex);
 
const todoModule = {
  namespaced: true,
  state: {
    progressTodo: {
      todo: null,
      interval_id: null
    },
    todos: [],
    config: {
      status: {
        'READY': 0,
        'DOING': 1,
        'DONE': 2
      }          
    }
  },
  getters: {
    status (state) {
      return state.config.status
    },
    progressTodo (state) {
      return state.progressTodo
    },
    doingTodos (state, getters) {
      return state.todos.filter(function (todo) {
        return todo.status === state.config.status["DOING"] || todo.status === state.config.status["READY"]
      })
    },
    doneTodos (state, getters) {
      return state.todos.filter(function(todo){
        return todo.status === state.config.status["DONE"]
      })
    }
  },
  mutations: {
    updateProgressTodo (state, payload) {
      state.progressTodo = payload 
    },
    initProgressTodo (state) {
      state.progressTodo = {
        todo: {},
        interval_id: null
      }
    },
    setProgressTodo (state, payload) {
      state.progressTodo = payload
    },
    setTodos (state, payload) {
      var todos = payload
      state.todos = todos
    },
    setTodo (state, payload) {
      var todo = payload,
          todos = state.todos,
          index = null,
          i = 0,
          num = todos.length

      for(i; i < num; i++) {
        if (todos[i]._id === todo._id) {
          index = i
        }
      }

      todos.splice(index, 1, todo)
      return todo
    },
    addTodo (state, payload) {
      console.log('pushed new todo')
      state.todos.push(payload)
    }
  },
  actions: {
    getAll ({commit}) {
      return axios.get(this.state.config.app.APIURL)
      .then(function (res) {
        console.log(res.data)
        commit('setTodos', res.data)
      })
    },
    create ({commit}, paramsObj) {
      var params = new URLSearchParams(paramsObj),
      _this = this,
      url = this.state.config.app.APIURL + 'todos'

      return axios.post(url, params, {
          headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      })
      .then(function(res) {
        var todo = res.data.todo
        console.log('created' + todo.name)
        commit('addTodo', todo)
      })
    },
    update ({commit}, paramsObj) {
      var params = new URLSearchParams(paramsObj),
          _this = this,
          url = this.state.config.app.APIURL + 'todos/' + paramsObj._id

      return axios.post(url, params)
      .then(function (res) {
        var todo = res.data.todo
        commit('setTodo', todo)
        return todo
      })
      .then(function (todo) {
        var progressTodo = _this.getters['todo/progressTodo']
        if (progressTodo.todo && progressTodo.todo._id === todo._id) {
          clearInterval(progressTodo.interval_id)
          commit('initProgressTodo')
        }
        return todo
      })
    }
  }
}


export default new Vuex.Store({
  modules: {
    todo: todoModule
  },
  state: {
    categories: [],
    config: {
      app: appConfig
    }
  },
  getters: {
    appConfig (state) {
      return state.config.app
    },
    progressTodo (state) {
      return state.progressTodo
    },
    categories (state) {
      return state.categories
    },
    categoryById: (state) => (id) => {
      var categories = state.categories,
        category,
        i = 0

      for (i; i < categories.length; i++) {
        category = categories[i]
        if (category._id === id) return category;
      }
    }
  },
  mutations: {
    setCategories (state, payload) {
      var categories = payload
      state.categories = categories
    }
  },
  actions: {
    getCategories ({commit}) {
      return axios.get(this.state.config.app.APIURL+'categories/')
      .then(function (res) {
        var categories = res.data
        commit('setCategories', categories)
      })
    }
  }

});