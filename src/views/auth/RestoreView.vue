<template>
  <div class="container">
    <h1>Find your account</h1>
    <div class="container-two">
      <form action="#" method="post">

        <label for="Email">EMAIL OR MOBILE NUMBER</label>
        <input type="text" id="emailOrNumber" name="emailOrNumber" required placeholder="Email or mobile number" />

        <button type="submit">SEARCH</button>

        <p><Router-link to="/login">Do you remember your password?</Router-link></p>

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
  background: linear-gradient(to right , #9ebbfe, #cc9bf1);
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
