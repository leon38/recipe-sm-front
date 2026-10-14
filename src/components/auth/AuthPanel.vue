<script setup lang="ts">
import { ref } from 'vue'
import { authApi } from '../../api/auth.api'

const mode = ref<'login' | 'register'>('login')
const email = ref('')
const password = ref('')
const passwordConfirm = ref('')
const isPending = ref(false)
const message = ref('')

function switchMode() {
  mode.value = mode.value === 'login' ? 'register' : 'login'
  message.value = ''
  // clear inputs when switching
  email.value = ''
  password.value = ''
  passwordConfirm.value = ''
}

async function submit() {
  isPending.value = true
  message.value = ''

  try {
    if (mode.value === 'login') {
      const res = await authApi.login({ email: email.value, password: password.value })
      console.log("res", res);
      const token = res.data.token
      console.log(token);
      localStorage.setItem('token', token)
      // emit authenticated token
      // @ts-ignore
      const ev = new CustomEvent('authenticated', { detail: { token } })
      window.dispatchEvent(ev)
      message.value = 'Connecté'
    } else {
      if (passwordConfirm.value !== password.value) {
        message.value = 'Les mots de passe ne correspondent pas.'
        isPending.value = false
        return
      }

      const res = await authApi.register({ username: email.value, email: email.value, password: password.value })
      const token = res.data.token
      localStorage.setItem('token', token)
      // @ts-ignore
      const ev = new CustomEvent('authenticated', { detail: { token } })
      window.dispatchEvent(ev)
      message.value = 'Inscrit et connecté'
    }
  } catch (err: any) {
    message.value = err?.response?.data?.message ?? String(err)
  } finally {
    isPending.value = false
  }
}

</script>

<template>
    <section class="page login-4-page">
        <div class="login-4-card">
            <div class="card-bg" :class="mode === 'login' ? 'login' : ''" />
            <div class="hero register active" v-if="mode === 'register'">
                <h2>Créer un compte</h2>
                <p>Connectez-vous pour ajouter des recettes ou les enregistrer</p>
                <button type="button" @click="switchMode">
                    Se connecter
                </button>
            </div>
            <div v-if="mode === 'register'" class="form register active">
              <h2>Inscription</h2>
              <form @submit.prevent="submit">
                <input v-model="email" type="email" placeholder="Email" />
                <input v-model="password" type="password" placeholder="Mot de passe" />
                <input v-model="passwordConfirm" type="password" placeholder="Confirmer le mot de passe" />
                <button type="submit">S'inscrire</button>
              </form>
            </div>
            <div class="hero login active" v-if="mode === 'login'">
                <h2>Bonjour</h2>
                <p>Inscrivez-vous pour mettre des recettes en favoris ou en importer</p>
                <button type="button" @click="switchMode">
                    S'inscrire
                </button>
            </div>
            <div v-if="mode === 'login'" class="form login active">
              <h2>Login</h2>
              <form @submit.prevent="submit">
                <input v-model="email" type="email" placeholder="Email" />
                <input v-model="password" type="password" placeholder="Password" />
                <a class="pt-6 mb-8">Mot de passe oublié ?</a>
                <button type="submit">Se connecter</button>
              </form>
            </div>
        </div>
    </section>
</template>
