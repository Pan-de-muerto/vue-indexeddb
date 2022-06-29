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
        <button class="temp-btn" @click="handleFlushQueue">Clear</button>
        <button class="temp-btn" @click="handleSync">Sync</button>
      </div>
    </div>
  </div>
</template>

<script >
import { ref, onMounted } from "vue";
import { useObservable } from "@vueuse/rxjs";
import { db } from "../utilities/db";
import axios from "axios";
import { liveQuery } from "dexie";
export default {
  setup() {
    const name = ref("");
    const email = ref("");
    //const pending = ref([]);
    // const users = ref([]);

    async function addUser() {
      const newRequest = {
        method: "post",
        payload: { name: name.value, email: email.value },
      };
      try {
        const id = await db.requests.add(newRequest);
        console.log(id);
      } catch (error) {
        console.error(error);
      }

      // add request to queue
    }

    async function deleteUser(userId) {
      const newRequest = {
        method: "delete",
        userId: userId,
      };

      try {
        await db.requests.add(newRequest);
      } catch (error) {
        console.error(error);
      }
    }

    async function handleSync() {
      let promises = [];
      console.log(this.pending);
      this.pending.forEach((element) => {
        switch (element.method) {
          case "post":
            promises.push(
              axios.post(
                "https://62b9d16eff109cd1dc9bd9a9.mockapi.io/users",
                element.payload
              )
            );
            break;
          case "delete":
            promises.push(
              axios.delete(
                `https://62b9d16eff109cd1dc9bd9a9.mockapi.io/users/${element.userId}`
              )
            );
            break;
        }
      });
      Promise.all(promises).then((responses) => console.log(responses));
    }

    function handleFlushQueue() {
      db.requests.clear();
      document.location.reload();
    }

    onMounted(async () => {
      try {
        let usrs = await axios.get(
          "https://62b9d16eff109cd1dc9bd9a9.mockapi.io/users"
        );
        db.users.clear();
        db.users.bulkAdd(usrs.data);
      } catch (error) {
        console.log(error);
      }

      // users.value = usrs.data;
    });

    return {
      name,
      email,
      users: useObservable(liveQuery(() => db.users.toArray())),
      pending: useObservable(liveQuery(() => db.requests.toArray())),
      addUser,
      deleteUser,
      handleSync,
      handleFlushQueue,
    };
  },
};
</script>

<style scoped>
.temp-btn {
  margin: 0 5px;
}
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
