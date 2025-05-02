<template>
  <aside class="sidebar">
    <nav>
      <ul>
        <li>
          <div class="icon-container">
            <router-link  to="/calendary">
              <img src="./icons/calendar3.svg" alt="Calendary">
            </router-link>
          </div>
        </li>
        <li>
          <div class="icon-container">
            <router-link to="/advance">Advance</router-link>
          </div>
        </li>
        <li>
          <div class="icon-container">
            <router-link to="/reports">Resports</router-link>
          </div>
        </li>
        <li>
          <div class="icon-container">
            <router-link to="/settings">Settings</router-link>
          </div>
        </li>
        <li>
          <div class="icon-container">
            <router-link to="/support">Support</router-link>
          </div>
        </li>
        <li>
          <div class="icon-container">
            <router-link to="/information">
              <img src="./icons/info-circle.svg" alt="Information">
            </router-link>
          </div>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<style scoped>
.sidebar {
  width: 100px;
  height: 100vh;
  color: black;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1.5rem;
}

nav ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

nav ul li {
  width: 50px;
  height: 50px;
  background-color: #BB99FF;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 15px;
  transition: background 0.3s ease;
}

nav ul li:hover {
  background: #a179f3;
}

.icon-container {
  width: 40px; /* Tamaño uniforme de la imagen */
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

img {
  height: 30px;
}

nav ul li a {
  display: flex;
  justify-content: center;
  align-items: center;
}

nav a:hover {
  background: none;
}
</style>
