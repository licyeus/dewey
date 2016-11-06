const app = new Vue({
  el: '#app',
  created: function () {
    this.bookmarkSearch = new JsSearch.Search('description')
    this.bookmarkSearch.indexStrategy = new JsSearch.PrefixIndexStrategy()
    this.bookmarkSearch.searchIndex = new JsSearch.UnorderedSearchIndex()
    this.bookmarkSearch.addIndex('description')
    this.bookmarkSearch.addIndex('tags')

    axios.get('./bookmarks.json').then(res => {
      this.bookmarks = res.data.map(bookmark => {
        return {
          href: bookmark.href,
          description: bookmark.description,
          tags: bookmark.tags.split(/\s/),
          time: bookmark.time
        }
      })
      this.bookmarkSearch.addDocuments(this.bookmarks)
      document.getElementById('query').focus()
    })
  },
  data: {
    query: '',
    bookmarks: []
  },
  computed: {
    visibleBookmarks: function () {
      const bookmarks = this.query === '' ? this.bookmarks : this.bookmarkSearch.search(this.query)
      return bookmarks.slice(0, 100)
    }
  },
  filters: {
    formatTime: function (time) {
      return moment(time).format('MMMM D, YYYY')
    }
  }
})
