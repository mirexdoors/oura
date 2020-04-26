<template>
  <v-card class="mx-auto my-auto" max-width="344" outlined>
    <v-form v-model="valid">
      <v-app-bar color="deep-purple" dark>
        <v-toolbar-title>Authotization</v-toolbar-title>
      </v-app-bar>
      <v-container>
        <v-row>
          <v-col cols="12" md="4">
            <v-text-field
              v-model="firstname"
              :rules="nameRules"
              :counter="10"
              label="First name"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field
              v-model="lastname"
              :rules="nameRules"
              :counter="10"
              label="Last name"
              required
            ></v-text-field>
          </v-col>

          <v-col cols="12" md="4">
            <v-text-field v-model="email" :rules="emailRules" label="E-mail" required></v-text-field>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script>
import axios from "axios";

export default {
  data: () => ({
    valid: false,
    firstname: "",
    lastname: "",
    nameRules: [
      v => !!v || "Name is required",
      v => v.length <= 10 || "Name must be less than 10 characters"
    ],
    email: "",
    emailRules: [
      v => !!v || "E-mail is required",
      v => /.+@.+/.test(v) || "E-mail must be valid"
    ]
  }),
  mounted() {
    axios
      .get("https://cloud.ouraring.com/oauth/authorize?response_type=token&client_id=TOXBCPRVNRDS5VE6&redirect_uri=http://localhost:8080&scope=email+personal&state=MZJMwJIqPLdQ3I69z5zIFNuD99YJcm")
      .then(function(response) {
        // handle success
        console.log(response);
      })
      .catch(function(error) {
        // handle error
        console.log(error);
      });
  }
};
</script>