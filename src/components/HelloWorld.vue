<template>
  <div class="hello">
    <h1>client-side DB</h1>
    <div class="form-container">
      <input v-model="name" type="text" placeholder="nombre" />
      <input v-model="email" type="text" placeholder="correo" />
      <button @click="addUser">Enviar</button>
    </div>
    <pre class="preview">{{ JSON.stringify(pending, null, 2) }}</pre>
  </div>
</template>

<script >
import { ref, onMounted } from "vue";
import PouchDB from "pouchdb";

export default {
  setup() {
    const db = new PouchDB("pending_requests");
    const name = ref("");
    const email = ref("");
    const pending = ref([]);

    async function addUser() {
      const newRequest = {
        method: "post",
        payload: { name: name.value, email: email.value },
      };
      console.log(newRequest);

      try {
        let res = await db.post(newRequest);
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }

    onMounted(async () => {

      let res = await db.allDocs({include_docs: true, descending: true});
      console.log(res.rows.map(x => x.doc));

    });

    return {
      name,
      email,
      pending,
      addUser,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.preview {
  text-align: start;
}
.form-container {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 80px;
  max-width: 400px;
  margin: auto;
}
.form-container > input {
  text-align: center;
}
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
