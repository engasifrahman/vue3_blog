import axios from "axios";
import { ref, isRef, unref, watchEffect } from 'vue';

export function useAxios(req_url = null, req_config = {}) {
  const is_axios_finished = ref(false);
  const axios_result = ref(null);
  const axios_errors = ref(null);
  let return_data = { axios_result, axios_errors, is_axios_finished };

  async function makeRequest() {
    // reset state before fetching..
    axios_result.value = null;
    axios_errors.value = null;
    is_axios_finished.value = false;
    
    // resolve the url value synchronously so it's tracked as a
    // dependency by watchEffect()
    const url = unref(req_url);
    const config = unref(req_config);
    const method = config?.method || 'GET';
    const data = config?.data || {};

    if(method && url){
      await axios({
        method: method,
        url: url,
        data: data
      }).then((res) => {
        console.log('res :>> ', res);

        axios_result.value = Object.assign({}, res.data);
        is_axios_finished.value = true;
      }).catch(($e) => {
        axios_errors.value = $e?.response?.data || $e;
        is_axios_finished.value = true;
      });
    }
  }

  async function excecuteAxios(req_url, req_config = {}) {
    var result = null;
    var errors = null;
    var is_finished = false;

    const url = unref(req_url);
    const config = unref(req_config);
    const method = config?.method || 'GET';
    const data = config?.data || {};

    if(method && url){
      await axios({
        method: method,
        url: url,
        data: data
      }).then((res) => {
        console.log('res :>> ', res);

        result = Object.assign({}, res.data);
        is_finished = true;
      }).catch(($e) => {
        errors = $e?.response?.data || $e;
        is_finished = true;
      });
    }

    return { result, errors, is_finished };
  }

  if (req_url && isRef(req_url)) {

    console.log('req_url is a ref');
    // setup reactive re-fetch if input method & URL are ref
    watchEffect(makeRequest);
  } else if(req_url){
    console.log('req_url is not a ref');

    // otherwise, just fetch once
    makeRequest();
  } else{
    return_data = { excecuteAxios }
  }

  return return_data;
}