<template>
<div>
  <h1 class="title">Scraping</h1>

  <section class="todoapp">
    <div v-if="loading">
      <h1 class="loading">Loading...</h1>
    </div>
    <div v-else>
      <header class="header" v-show="!this.viewHistory">
        <input
          class="new-address"
          autofocus
          autocomplete="off"
          :placeholder="this.inputPlaceholder"
          v-model="newTodo"
          @keyup.enter="addTodo"
        />
      </header>

      <div v-if="this.viewHistory">
        <section class="main" v-cloak>
          <ul class="todo-list">
            <li v-for="items in filteredTodos" class="todo" :key="items.address">
              <div class="view">
                <label>{{ items.address }}</label>
              </div>
            </li>
          </ul>
        </section>
      </div>
      <div v-else>
        <section class="todoapp">
          <body class="body-dataserver">
            <div class="container">
              <form v-if="!this.viewHistory" novalidate>
                <div class="dataserver row">
                  <h1 class="label-title">{{dataServe.title}}</h1>
                  <p />

                  <div>
                    <img class="logo-dataserve" v-bind:src="this.dataServe.logo" />
                  </div>
                  <p />
                </div>

                <div class="row">
                  <div class="col-25">
                    <label for="servers_changed">Servers Changed</label>
                  </div>
                  <div class="col-75">
                    <input
                      type="checkbox"
                      :id="'servers_changed'"
                      class="toggle"
                      :disabled="true"
                      name="servers_changed"
                      v-model="dataServe.servers_changed"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-25">
                    <label for="ssl_grade">SSL Grade</label>
                  </div>
                  <div class="col-75">
                    <input
                      type="text"
                      :id="'ssl_grade'"
                      :readonly="true"
                      v-model="dataServe.ssl_grade"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-25">
                    <label for="previous_ssl_grade">Previous SSL Grade</label>
                  </div>
                  <div class="col-75">
                    <input
                      type="text"
                      :id="'previous_ssl_grade'"
                      :readonly="true"
                      v-model="dataServe.previous_ssl_grade"
                    />
                  </div>
                </div>

                <div class="row">
                  <div class="col-25">
                    <label for="is_down">Server is Down</label>
                  </div>
                  <div class="col-75">
                    <input
                      type="checkbox"
                      :id="'is_down'"
                      :disabled="true"
                      name="is_down"
                      v-model="dataServe.is_down"
                    />
                  </div>
                </div>

                <p/>
                <p/>

                <button
                  :id="'expanded'"
                  type="button"
                  class="collapsible caret"
                  v-on:click="expanded($event)"
                >Servers</button>
                
                <div class="content">
                  <ul>
                    <li v-for="server in filteredServers" class="todo" :key="server.address">
                      <div class="view">
                        <div class="row">
                          <div class="col-25">
                            <label for="address">Address</label>
                          </div>
                          <div class="col-55">
                            <input
                              type="text"
                              :id="'address'"
                              :readonly="true"
                              v-model="server.address"
                            />
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-25">
                            <label for="ssl_grade">SSL Grade</label>
                          </div>
                          <div class="col-55">
                            <input
                              type="text"
                              :id="'ssl_grade'"
                              :readonly="true"
                              v-model="server.ssl_grade"
                            />
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-25">
                            <label for="country">Country</label>
                          </div>
                          <div class="col-55">
                            <input
                              type="text"
                              :id="'country'"
                              :readonly="true"
                              v-model="server.country"
                            />
                          </div>
                        </div>

                        <div class="row">
                          <div class="col-25">
                            <label for="owner">Owner</label>
                          </div>
                          <div class="col-55">
                            <input
                              type="text"
                              :id="'owner'"
                              :readonly="true"
                              v-model="server.owner"
                            />
                          </div>
                        </div>

                        <hr v-show="filteredServers.length > 1" />
                      </div>
                    </li>
                  </ul>
                </div>
              </form>
            </div>
          </body>
        </section>
      </div>

      <footer class="footer" v-cloak>
        <span class="todo-count" v-show="this.viewHistory">
          <strong>{{ remaining }}</strong>
          {{ remaining | pluralize }} left
        </span>
        <ul class="filters">
          <li>
            <a
              href="#/search"
              @click="search()"
              :class="{ selected: visibility == 'search' }"
            >Search</a>
          </li>
          <li>
            <a
              href="#/history"
              @click="history()"
              :class="{ selected: visibility == 'history' }"
            >History</a>
          </li>
        </ul>
      </footer>
    </div>
  </section>

  <div v-if="error" class="error" @click="handleErrorClick">ERROR: {{this.error}}</div>
</div>
</template>

<script>
// visibility filters
let filters = {
  all: function() {
    this.viewHistory = false;
  },
  search: function() {
    this.viewHistory = false;
  },
  history: function() {
    this.viewHistory = true;
  }
};

// app Vue instance
const Todos = {
  name: "Todos",
  props: {
    activeUser: Object
  },

  // app initial state
  data: function() {
    return {
      todos: [],
      viewHistory: false,
      server: {
        address: String,
        ssl_grade: String,
        country: String,
        owner: String
      },
      dataServe: {
        servers: [this.server],
        servers_changed: Boolean,
        ssl_grade: String,
        previous_ssl_grade: String,
        logo: String,
        title: String,
        is_down: Boolean
      },
      itemServe: {
        address: String
      },
      item: {
        items: [this.itemServe]
      },
      newTodo: "",
      editedTodo: null,
      visibility: "all",
      loading: true,
      error: null
    };
  },

  mounted() {
    // inject some startup data
    this.todos = [
      { title: "Drink coffee", completed: false },
      { title: "Write REST API", completed: false }
    ];

    this.itemServe = [{ address: "google.com" }, { address: "trura.com" }];
    this.item.items = this.itemServe;

    this.server = [
      {
        address: "216.58.195.78",
        ssl_grade: "A",
        country: "US",
        owner: "Google LLC"
      },
      {
        address: "2607:f8b0:4005:807:0:0:0:200e",
        ssl_grade: "A",
        country: "US",
        owner: "Google LLC"
      }
    ];

    this.dataServe = {
      servers: this.server,
      servers_changed: true,
      ssl_grade: "A",
      previous_ssl_grade: "A",
      logo:
        "https://www.google.com//images/branding/googleg/1x/googleg_standard_color_128dp.png",
      title: "Google",
      is_down: false
    };

    // hide the loading message
    this.loading = false;
  },

  // computed properties
  // http://vuejs.org/guide/computed.html
  computed: {
    filteredTodos: function() {
      //console.log(this.items.items[0].address)
      return this.item.items;
      //return filters[this.visibility](this.todo)
    },

    filteredServers: function() {
      //console.log(this.dataServe.servers[0])
      return this.dataServe.servers;
      //return filters[this.visibility](this.todo)
    },

    remaining: function() {
      return this.item.items.length;
    },

    allDone: {
      get: function() {
        return this.remaining === 0;
      },
      set: function(value) {
        this.todos.forEach(function(todo) {
          todo.completed = value;
        });
      }
    },

    inputPlaceholder: function() {
      return "Enter the address (google.com)";
    }
  },

  filters: {
    pluralize: function(n) {
      return n === 1 ? "item" : "items";
    }
  },

  // methods that implement data logic.
  // note there's no DOM manipulation here at all.
  methods: {
    addTodo: function() {
      var value = this.newTodo && this.newTodo.trim();
      if (!value) {
        return;
      }

      this.todos.push({
        title: value,
        completed: false
      });

      this.newTodo = "";
    },

    setVisibility: function(vis) {
      this.visibility = vis;
    },

    search: function() {
      this.viewHistory = false;
    },

    history: function() {
      this.viewHistory = true;
    },

    expanded: function(event) {
      let element = document.getElementById(event.currentTarget.id);
      element.classList.toggle("active");

      let content = element.nextElementSibling;

      if (content.style.display === "block") {
        content.style.display = "none";
        element.classList.toggle("caret-down");
      } else {
        content.style.display = "block";
        element.classList.toggle("caret-down");
        
      }
    },

    /*completeTodo (todo) {
      },*/

    removeTodo: function(todo) {
      // notice NOT using "=>" syntax
      this.todos.splice(this.todos.indexOf(todo), 1);
    },

    editTodo: function(todo) {
      this.beforeEditCache = todo.title;
      this.editedTodo = todo;
    },

    doneEdit: function(todo) {
      if (!this.editedTodo) {
        return;
      }

      this.editedTodo = null;
      todo.title = todo.title.trim();

      if (!todo.title) {
        this.removeTodo(todo);
      }
    },

    cancelEdit: function(todo) {
      this.editedTodo = null;
      todo.title = this.beforeEditCache;
    },

    removeCompleted: function() {
      this.todos = filters.active(this.todos);
    },

    handleErrorClick: function() {
      this.error = null;
    }
  },

  // a custom directive to wait for the DOM to be updated
  // before focusing on the input field.
  // http://vuejs.org/guide/custom-directive.html
  directives: {
    "todo-focus": function(el, binding) {
      if (binding.value) {
        el.focus();
      }
    }
  }
};

export default Todos;
</script>

<style>
[v-cloak] {
  display: none;
}
</style>