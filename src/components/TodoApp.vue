<template>
  <main class="main">
    <div class="wrap">
      <ul class="alerts">
        <li class="todo" v-for="error in errors" v-bind:key=error.index>
          {{error}}
        </li>
      </ul>
      <section class="todoform appSection">
        <div class="inputTodo">
          <div class="inputTodo__col">
            <dl class="inputTodo__row">
              <dt class="inputTodo__index">
                タスク
              </dt>
              <dd class="inputTodo__content">
                <input v-model="text" type="text" class="todo_form_field" placeholder="例：朝イチのメールチェック 呑み会の店の手配 etc…">
              </dd>
            </dl>
            <dl class="inputTodo__row">
              <dt class="inputTodo__index">
                カテゴリ
              </dt>
              <dd class="inputTodo__content">
                <select v-model="category_id">
                  <option value=undefined selected>カテゴリー選択</option>
                  <option v-for="(category) in categories" :key="category.id" :value="category.id">
                    {{category.name}}
                  </option>
                </select>
              </dd>
            </dl>
          </div>
          <div class="inputTodo__col inputTodo__col--button">
            <button class="button button--primary" v-on:click="add()">追加する</button>
          </div>
        </div>
      </section>
      <section class="todo-active todolistSection todolistSection--active appSection">
  			<h2 class="appSection__index">タスク一覧</h2>
  			<ul class="todos">
  				<li v-for="(todo) in this.getDoingTodos" :key="todo.id">
            <doing-todo :prop_todo="todo" @error-catch="onErrorCatch"></doing-todo>
  				</li>
  			</ul>
  	</section>
    <section class="todo-done todolist todolist--done appSection">
  			<h2 class="appSection__index">完了タスク一覧</h2>
  			<ul class="todos">
  				<li v-for="(todo) in this.getDoneTodos" :key="todo.id">
            <done-todo :todo="todo"></done-todo>
  				</li>
  			</ul>
  	</section>
    </div>
  </main>
</template>

<script>
  import DoingTodo from './DoingTodo.vue'
  import DoneTodo from './DoneTodo.vue'
  import { mapGetters } from 'vuex'
  
  export default {
    name: 'todo-app',
    components: {
      DoingTodo,
      DoneTodo
    },
    data: function () {
      return {
        errors: [],
        text: '',
        category_id: null,
        categories: []
      }
    },
    computed: {
      ...mapGetters({
        getDoingTodos: 'todo/doingTodos',
        getDoneTodos: 'todo/doneTodos',
        getCategories: 'category/categories',
        appConfig: 'appConfig',
        getStatus: 'todo/status'
      })
    },
    created: function() {
      this.fetchCategories()
      this.fetchTodos()
    },
    methods: {
      add: function () {
        let params = {
              title: this.text,
              status: this.getStatus["READY"],
              category_id: this.category_id
            }
        this.$store.dispatch('todo/create', params)
        .then(function () {
            this.text = ''
            this.category_id = ''
            this.errors = []
        }.bind(this))
        .catch(function(e){
          let res = e.response,
          error_message = res.data.error_message

          this.onErrorCatch(error_message)
        }.bind(this))        
      },
      onErrorCatch (message) {
        this.errors = []
        this.errors.push(message)
      },
      fetchTodos () {
        this.$store.dispatch('todo/getAll')
        .catch(function(res){
          this.$router.push({path: '/login'});
        }.bind(this))
      },
      fetchCategories() {
        this.$store.dispatch('category/getAll')
        .then(function(){
          this.categories = this.getCategories
          this.category_id = 'カテゴリー選択'
        }.bind(this))
        .catch(function(res){
          this.$router.push({path: '/login'});
        }.bind(this))
      }
    }
  }
</script>

<style lang="scss" scoped>
/******************
variables
******************/

  //////////////////////
  // color
  /////////////////////
  $color_border: #BBBBBB;
  $color_disabled: #bababa;
  $color_primary: #22556E;
  $paleblue: #F6FAFB;
  $color_accent: #00D1E5;

/******************
style
******************/

.alerts{
  padding: 0;
  margin: 0 0 40px 0px;

  .alert{
    font-size: 1.5rem;
    text-align: center;
    padding: 1em;
    font-weight: bold;
    list-style: none;
    color: $color_disabled;
    border: 1px solid $color_border;
  }
}

  .inputTodo{
    width: 100%;
    display: flex;

   @media screen and ( max-width: 480px ){
        flex-direction: column;
    }      

    &__col{
      width: 100%;

      &--button{
       width: 150px;
        margin-left: 10px;

        @media screen and ( max-width: 480px ){
          // width: 70px;
          margin-top: 20px;
          margin-left: 0;
        }
      }
    }

    &__row{
      margin-top: 0;
      margin-bottom: 0;
      display: flex;
      align-items: center;

      @media screen and ( max-width: 480px ){
        align-items: flex-start;
      }      

      &:not( :first-child ){
        margin-top: 10px;

        @media screen and ( max-width: 480px ){
          // margin-top: 0;
          // margin-left: 5px;
        }      
      }

      @media screen and ( max-width: 480px ){
          flex-direction: column;
      }      
    }

    &__index{
      width: 90px;
      letter-spacing: 0.025em;
      padding-right: 10px;
      font-weight: bold;

      @media screen and ( max-width: 480px ){
          margin-bottom: 10px;
      }       
    }

    &__content{
      width: 100%;
      margin-left: 0;

      input,select{
        width: 100%;
      }

      select{
        height: 70px;
        font-weight: bold;

        @media screen and ( max-width: 480px ){
          height: 50px;
        }

      }
    }


    &__col--button{

      @media screen and ( max-width: 480px ){
        width: 100%;
      }      


      .button{
        width: 100%;
        height: 100%;
        display: flex;
      }
    }
  }



  /////////// tood
  .todos{
    margin: 0;
    padding: 0;

    > li{
        list-style: none;
        &:not( :first-child ){
          margin-top: 20px;
        }
    }
  }

  .todo{
      padding: 20px;
      list-style: none;
      border-radius: 2px;

      &__index{
        font-size: 2.2rem;
        font-weight: bold;

        @media screen and ( max-width: 640px ){
          font-size: 2rem;
        } 
      }

      &:not( :last-child ){
        margin-top: 20px;
      }


      //////カテゴリラベル
      &__categories{
      }
  }
</style>