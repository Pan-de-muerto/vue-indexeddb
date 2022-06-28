<template>
  <div class="hello">
    <h1>client-side DB</h1>
    <div class="form-container">
      <input v-model="name" type="text" placeholder="nombre" />
      <input v-model="email" type="text" placeholder="correo" />
      <button @click="addUser">Enviar</button>
    </div>

    <div class="lists">
      <div>
        <h4>Users List</h4>
        <div class="user-tile" v-for="user in users" :key="user.id">
          <div>
            {{ user.name }} <br />
            {{ user.email }}
          </div>

          <div>
            <span class="emoji-btn">📝</span>
            <span @click="deleteUser(user.id)" class="emoji-btn">❌</span>
          </div>
        </div>
      </div>
      <div>
        <h4>Pending Requests</h4>
        <pre class="preview">{{ JSON.stringify(pending, null, 2) }}</pre>
        <button @click="handleSync">Sync</button>
      </div>
    </div>
  </div>
</template>

<script >
import { ref, onMounted } from "vue";
import PouchDB from "pouchdb";
import axios from "axios";
export default {
  setup() {
    const db = new PouchDB("pending_requests");
    const name = ref("");
    const email = ref("");
    const pending = ref([]);
    const users = ref([]);

    async function addUser() {
      const newRequest = {
        method: "post",
        payload: { name: name.value, email: email.value },
      };

      try {
        let res = await db.post(newRequest);
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }

    async function deleteUser(userId) {
      console.log(userId);
      const newRequest = {
        method: "delete",
        userId: userId,
      };

      try {
        let res = await db.post(newRequest);
        console.log(res);
      } catch (err) {
        console.error(err);
      }
    }

    async function handleSync(){
      let promises = [];
      pending.value.forEach(element => {
        switch (element.method){
          case 'post':
            promises.push(axios.post("https://62b9d16eff109cd1dc9bd9a9.mockapi.io/users" , element.payload)); break;
          case 'delete':
            promises.push(axios.delete(`https://62b9d16eff109cd1dc9bd9a9.mockapi.io/users/${element.userId}`)); break;
        }
      });
      Promise.all(promises).then(responses => console.log(responses));
    }


    onMounted(async () => {
      let res = await db.allDocs({ include_docs: true, descending: true });
      pending.value = res.rows.map((x) => ({
        method: x.doc.method,
        payload: x.doc.payload,
        userId: x.doc.userId,
      }));

      let usrs = await axios.get(
        "https://62b9d16eff109cd1dc9bd9a9.mockapi.io/users"
      );

      users.value = usrs.data;
    });

    return {
      name,
      email,
      pending,
      users,
      addUser,
      deleteUser,
      handleSync,
    };
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.emoji-btn {
  font-size: 20px;
  margin: 0 10px;
}
.user-tile {
  height: 100px;
  background: #faf5ff;
  border-radius: 5px;
  margin: 5px 0;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
}
.lists {
  margin-top: 50px;
  display: flex;
  width: 100vw;
}
.lists > div {
  flex: 1;
}
.lists > h4 {
  text-align: center;
}
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
