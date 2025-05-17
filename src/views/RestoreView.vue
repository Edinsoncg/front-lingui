<template>
  <div class="container">
    <h1>Find your account</h1>
    <div class="container-two">
      <form action="#" method="post">

        <label for="Email">EMAIL OR MOBILE NUMBER</label>
        <input type="text" id="emailOrNumber" name="emailOrNumber" required placeholder="Email or mobile number" />

        <button type="submit">SEND</button>

        <p><Router-link to="/login">Do you remember your password?</Router-link></p>

      </form>
    </div>
  </div>
</template>
