import axios from "axios";
import { ref, isRef, unref, watchEffect } from 'vue'

export function useFetch(fetch_method, fetch_url) {
  const data = ref(null)
  const errors = ref(null)

  async function doFetch() {
    // reset state before fetching..
    data.value = null
    errors.value = null
    
    // resolve the url value synchronously so it's tracked as a
    // dependency by watchEffect()
    const method = unref(fetch_method);
    const url = unref(fetch_url);

    if(method && url){
      axios[method](url)
      .then(function(res) {
        console.log('res :>> ', res);

        data.value = Object.assign({}, res.data.data);
      });
    }
  }

  if (isRef(fetch_url)) {
    console.log('fetch_url is refs');
    // setup reactive re-fetch if input URL is a ref
    watchEffect(doFetch)
  } else {
    console.log('fetch_url is not refs');

    // otherwise, just fetch once
    doFetch()
  }

  return { data, errors }
}