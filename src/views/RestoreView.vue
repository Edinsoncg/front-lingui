<template>
  <div class="container">
    <h1>Find your account</h1>
    <div class="container-two">
      <form action="#" method="post">

        <label for="Email">EMAIL OR MOBILE NUMBER</label>
        <input type="text" id="emailOrNumber" name="emailOrNumber" required placeholder="Email or mobile number" />

        <button type="submit">SEARCH</button>

        <p><RouterLink to="/login">Do you remember your password?</RouterLink></p>

      </form>
    </div>
  </div>
</template>
