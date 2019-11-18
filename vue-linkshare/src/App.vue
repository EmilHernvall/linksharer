<template>
    <div id="app">
        <h1>Linksharer</h1>

        <table>
            <tr>
                <th>Link</th>
                <th>User</th>
            </tr>
            <tr v-for="link in links" v-bind:key="link.href">
                <td><a v-bind:href="link.href">{{ link.title }}</a></td>
                <td>{{ link.user }}</td>
            </tr>
        </table>

        <form v-on:submit.prevent="onSubmit()">
            <h2>New Link</h2>
            <div>
                <label>Title</label>
                <input type="text" v-model="title" />
            </div>
            <div>
                <label>Link</label>
                <input type="text" v-model="href" />
            </div>
            <div>
                <label>User</label>
                <input type="text" v-model="user" />
            </div>
            <div>
                <button type="submit">Post</button>
            </div>
        </form>
    </div>
</template>

<script>
export default {
  name: 'app',
  data() {
    return {
      links: [],
      title: "",
      href: "",
      user: "",
    };
  },
  async created() {
    const links = await fetch("http://localhost:3000/link")
        .then((response) => response.json());
    this.links = links;
  },
  methods: {
    async onSubmit() {
      const { href, title, user } = this;
      const link = { href, title, user };
      this.links = await fetch("http://localhost:3000/link", {
        method: "POST",
        body: JSON.stringify(link),
        headers: {
          "Content-Type": "application/json",
        },
      }).then((response) => response.json());
      this.href = "";
      this.title = "";
      this.user = "";
    },
  },
  components: {
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
