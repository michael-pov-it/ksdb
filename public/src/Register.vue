<template>
  <main class="container">
      <form action="" id="form_register">
        <fieldset class="form-group">
          <label>Login (e-mail)</label>
          <input type="email" class="form-control" id="input_login_r" autocomplete="username" />
          <label>Password</label>
          <input type="password" class="form-control" id="input_password_r" autocomplete="new-password" />
          <label>Confirm Password</label>
          <input type="password" class="form-control" id="input_password_r_confirm" autocomplete="new-password" />
        </fieldset>
        <hr/>
        <button type="submit" class="btn btn-primary" id="register_button">REGISTER</button>
      </form>
    </main>
</template>

<script>
export default {
  name: 'search'
}
</script>