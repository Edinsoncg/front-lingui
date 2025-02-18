<template>
  <div class="container">
    <h1>Sign in to Güi</h1>
    <div class="container-two">
      <form action="#" method="POST">
        <label for="username">USERNAME</label>
        <input type="text" id="username" name="username" required placeholder="Insert your username or email"/>

        <label for="password">PASSWORD</label>
        <input type="password" id="password" name="password" required placeholder="Insert your password"/>

        <button type="submit">LOGIN</button>

        <p>
          <Router-link to="/restore">Forgot Password?</Router-link>
        </p>

        <p>
          <Router-link to="/sign">Sign up now</Router-link>
        </p>
      </form>
    </div>
  </div>
</template>

<style>
.container {
  display: flex;
  flex-direction: column;
  align-items: center;
}
h1 {
  font-size: 35px;
  font-weight: bold;
  color: #000000;
}

.container-two {
  background: linear-gradient(to right, #9ebbfe, #daaffb);
  padding: 2rem;
  border-radius: 30px;
  width: 300px;
  text-align: center;
  margin-top: 15px;
}

form {
  display: flex;
  flex-direction: column;
}

label {
  margin-bottom: 5px;
  text-align: left;
  font-weight: bold;
  color: #052e73;
}

input {
  background-color: rgba(255, 255, 255, 0.3);;
  margin-bottom: 1rem;
  padding: 10px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
}

::placeholder {
  font-size: 14px;
}

button {
  padding: 10px;
  background-color: #632093;
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  width: 150px;
  display: block;
  margin: 15px auto;
}

button:hover {
  background-color: #7e21c0;
}

p {
  font-size: 14px;
  margin-top: 15px;
  text-decoration: underline purple;
}
</style>
