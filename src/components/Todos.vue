<template>
<div>
  <notifications group="foo" position="top center" :max="3" :width="400" style="padding-top: 20px;"/>

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
          v-model="address"
          @keyup.enter="filterAddress"
        />
      </header>

      <div v-if="this.viewNotAvailable">
        <section class="todoapp">
          <div class="container">
            <div class="row">
              <h1 class="label-data">{{dataNotAvailable}}</h1>
            </div>
          </div>
        </section>
      </div>

      <div v-else-if="this.viewHistory">
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

      <div v-else-if="this.viewSearch && dataServe !== null ">
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

                <p />
                <p />

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
              href="#/clear"
              @click="clear()"
              :class="{ selected: visibility == 'search' }"
            >Clear</a>
          </li>
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
import dataServeService from "../service/DataServeService";

// app Vue instance
const Todos = {
  name: "Todos",

  // app initial state
  data: function() {
    return {
      dataNotAvailable: "",
      viewNotAvailable: false,
      viewHistory: false,
      viewSearch: false,
      address: "",
      visibility: "all",
      loading: true,
      error: null,

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
      }
    };
  },

  mounted() {
    this.$loading(true);
    dataServeService
      .getAll()
      .then(response => {
        this.item = response.data;
        this.$loading(false);
      })
      .catch(error => {
        this.$log.debug(error);
        this.error = "Failed to load Data Serve";
        this.$loading(false);
      })
      .finally(() => (
        this.loading = false
        ));

      this.dataServe = null;

    // hide the loading message
    this.loading = false;
  },

  // computed properties
  computed: {
    filteredTodos: function() {
      return this.item.items;
    },

    filteredServers: function() {
      return this.dataServe.servers;
    },

    remaining: function() {
      return this.item.items.length;
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

  methods: {
    filterAddress: function() {
      var value = this.address && this.address.trim();
      
      this.$loading(true);
      dataServeService
        .getByAddress(value)
        .then(response => {
          if (response.status == 206) {
            this.$loading(false);
            this.$log.debug("Entro");

            this.$notify({
              group: 'foo',
              type: 'warn',
              text: response.data,
              duration: 10000,
              speed: 1000,
              width: 500,
            });

          } else {
            this.$log.debug("Data loaded: ", response.data);
            this.dataServe = response.data;
            this.$loading(false);
          }
        })
        .catch(error => {
          this.$log.debug(error);
          this.error = "Failed to load Data Serve";
          this.$loading(false);
        })
        .finally(() => (this.loading = false));

      if (!value) {
        return;
      }

      this.address = "";
    },

    setVisibility: function(vis) {
      this.visibility = vis;
    },

    clear: function() {
      //this.item = [this.itemServe];
      this.dataServe = null;
      this.viewNotAvailable = false;
      this.viewSearch = true;
      this.viewHistory = false;
    },

    search: function() {
      if(this.dataServe == null){
        this.viewNotAvailable = false;
        this.viewSearch = true;
        this.viewHistory = false;
      } else {
        this.viewNotAvailable = false;
        this.viewSearch = true;
        this.viewHistory = false;
      }
    },

    history: function() {
      this.viewSearch = false;
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

    handleErrorClick: function() {
      this.error = null;
    }
  },

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