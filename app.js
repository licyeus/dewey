const SearchView = {
  template: '#search-view',
  props: ['bookmarks', 'search'],
  mounted: function () {
    document.getElementById('query').focus()
  },
  data: function () {
    return {
      query: ''
    }
  },
  computed: {
    visibleBookmarks: function () {
      const bookmarks = this.query === '' ? this.bookmarks : this.search.search(this.query)
      return bookmarks.slice(0, 100)
    }
  }
}

const AddView = {
  template: '#add-view'
}

const bookmark = Vue.component('bookmark', {
  template: '#bookmark-template',
  props: ['data'],
  filters: {
    formatTime: function (time) {
      return moment(time).format('MMMM D, YYYY')
    }
  }
})

const routes = [
  { path: '/search', component: SearchView },
  { path: '/add', component: AddView }
]
const router = new VueRouter({ routes })
const app = new Vue({
  created: function () {
    this.search = new JsSearch.Search('description')
    this.search.indexStrategy = new JsSearch.PrefixIndexStrategy()
    this.search.searchIndex = new JsSearch.UnorderedSearchIndex()
    this.search.addIndex('description')
    this.search.addIndex('tags')

    axios.get('./bookmarks.json').then(res => {
      this.bookmarks = res.data.map(bookmark => {
        return {
          href: bookmark.href,
          description: bookmark.description,
          tags: bookmark.tags.split(/\s/),
          time: bookmark.time
        }
      })
      this.search.addDocuments(this.bookmarks)
    })
  },
  data: {
    bookmarks: [],
    search: null
  },
  router
}).$mount('#app')

