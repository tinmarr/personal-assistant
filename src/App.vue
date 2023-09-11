<script setup lang="ts">
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_KEY);

const signIn = async () => {
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
  });
  console.log(data, error)
}
</script>

<template>
<v-btn @click="signIn">sign in</v-btn>

</template>
