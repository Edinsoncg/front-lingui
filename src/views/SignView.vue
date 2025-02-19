<template>
  <div class="container">
    <h1>Register now</h1>
    <div class="register-view">
      <form class="grid" action="#" method="post">
        <div class="container-three">
          <label for="Firstname">FIRST NAME</label>
          <input type="text" id="firsname" name="firstname" required placeholder="First name"/>
        </div>

        <div class="container-three">
          <label for="Lasttname">LAST NAME</label>
          <input type="text" id="lastname" name="lastname" required placeholder="Last name"/>
        </div>

        <div class="birthday">
          <label for="Birthday">BIRTHDAY</label>
          <div class="birthday-container">
            <select name="birthday_day" id="day" title="Day" required>
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
              <option value="5">5</option>
              <option value="6">6</option>
              <option value="7">7</option>
              <option value="8">8</option>
              <option value="9">9</option>
              <option value="10">10</option>
              <option value="11">11</option>
              <option value="12">12</option>
              <option value="13">13</option>
              <option value="14">14</option>
              <option value="15">15</option>
              <option value="16">16</option>
              <option value="17">17</option>
              <option value="18">18</option>
              <option value="19">19</option>
              <option value="20">20</option>
              <option value="21">21</option>
              <option value="22">22</option>
              <option value="23">23</option>
              <option value="24">24</option>
              <option value="25">25</option>
              <option value="26">26</option>
              <option value="27">27</option>
              <option value="28">28</option>
              <option value="29">29</option>
              <option value="30">30</option>
              <option value="31">31</option>
            </select>

            <select name="birthday_month" id="month" title="Month" required>
              <option value="1">Jan</option>
              <option value="2">Feb</option>
              <option value="3">Mar</option>
              <option value="4">Apr</option>
              <option value="5">May</option>
              <option value="6">Jun</option>
              <option value="7">Jul</option>
              <option value="8">Aug</option>
              <option value="9">Sep</option>
              <option value="10">Oct</option>
              <option value="11">Nov</option>
              <option value="12">Dec</option>
            </select>

            <select name="birthday_year" id="year" title="Year" required>
              <option value="1">2020</option>
              <option value="2">2019</option>
              <option value="3">2018</option>
              <option value="4">2017</option>
              <option value="5">2016</option>
              <option value="6">2015</option>
              <option value="7">2014</option>
              <option value="8">2013</option>
              <option value="9">2012</option>
              <option value="10">2011</option>
              <option value="11">2010</option>
              <option value="12">2009</option>
              <option value="13">2008</option>
              <option value="14">2007</option>
              <option value="15">2006</option>
              <option value="16">2005</option>
              <option value="17">2004</option>
              <option value="18">2003</option>
              <option value="19">2002</option>
              <option value="20">2001</option>
              <option value="21">2000</option>
              <option value="22">1999</option>
              <option value="23">1998</option>
              <option value="24">1997</option>
              <option value="25">1996</option>
              <option value="26">1995</option>
              <option value="27">1994</option>
              <option value="28">1993</option>
              <option value="29">1992</option>
              <option value="30">1991</option>
              <option value="31">1990</option>
              <option value="32">1989</option>
              <option value="33">1988</option>
              <option value="34">1987</option>
              <option value="35">1986</option>
              <option value="36">1985</option>
              <option value="37">1984</option>
              <option value="38">1983</option>
              <option value="39">1982</option>
              <option value="40">1981</option>
              <option value="41">1980</option>
              <option value="42">1979</option>
              <option value="43">1978</option>
              <option value="44">1977</option>
              <option value="45">1976</option>
              <option value="46">1975</option>
              <option value="47">1974</option>
              <option value="48">1973</option>
              <option value="49">1972</option>
              <option value="50">1971</option>
              <option value="51">1970</option>
            </select>
          </div>
        </div>

        <div class="container-three">
          <label for="Email">EMAIL</label>
          <input type="email" id="email" name="email" required placeholder="Email"/>
        </div>

        <div class="container-three">
          <label for="Mobilenumber">MOBILE NUMBER</label>
          <input type="number" id="mobileNumber" name="mobileNumber" required placeholder="Mobile number"/>
        </div>

        <div class="container-three">
          <label for="Password">PASSWORD</label>
          <input type="password" id="password" name="password" required placeholder="Password"/>
        </div>

        <div class="container-three">
          <label for="Confirm-password">CONFIRM PASSWORD</label>
          <input type="password" id="confirm-password" name="password" required placeholder="Confirm Password"/>
        </div>

        <div class="form-footer">
          <button type="submit">SIGN UP</button>

          <p>
            <Router-link to="/login">Already have an account?</Router-link>
          </p>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-view {
  background: linear-gradient(to right, #9ebbfe, #daaffb);
  padding: 2rem;
  border-radius: 2rem;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  width: 30%;
}

.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.container-three {
  text-align: left;
}

input {
  width: 100%;
  margin: 0;
}

.birthday {
  grid-column: span 2;
  text-align: left;
}

.birthday-container {
  display: flex;
  gap: 1rem;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
}

select {
  background-color: rgba(255, 255, 255, 0.3);
  border: none;
  border-radius: 4px;
  font-size: 14px;
  padding: 10px;
}

.form-footer {
  display: grid;
  grid-column: span 2;
}
</style>

