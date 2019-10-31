<template>
  <div id="search">
    <main class="container_login">
      <form action="" id="form_search">
        <fieldset class="form-group">
          <label for="search">Search</label>
          <input type="text" class="form-control" id="search" placeholder="Search for IMDB shows" />
        </fieldset>
        <button id="button_films" class="btn btn-primary">SEARCH FILMS</button>
        <button id="button_series" class="btn btn-primary">SEARCH SERIES</button>
      </form>
      <hr/>
      <!-- <form action="" id="form_search_id">
        <fieldset class="form-group">
          <label for="search">Search by ID</label>
          <input type="text" class="form-control" id="search_id" placeholder="Search for IMDB show by ID" />
        </fieldset>
        <button type="submit" class="btn btn-primary">SEARCH</button>
      </form>
      <hr/> -->
      <ul class="list-group" id="results-list"></ul>
      <form action="" id="form_btn_add"><hr/><button type="submit" class="btn btn-primary" id="btn_add">Add</button></form>
    </main>
  </div>
</template>

<script>
export default {
  name: 'search'
}
</script>