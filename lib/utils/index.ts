import * as SecureStore from "expo-secure-store";

// todo: generate blurhash on a serverside: https://docs.expo.dev/versions/latest/sdk/image/#generating-a-blurhash-on-a-server
export const blurhash =
  "|rF?hV%2WCj[ayj[a|j[az_NaeWBj@ayfRayfQfQM{M|azj[azf6fQfQfQIpWXofj[ayj[j[fQayWCoeoeaya}j[ayfQa{oLj?j[WVj[ayayj[fQoff7azayj[ayj[j[ayofayayayj[fQj[ayayj[ayfjj[j[ayjuayj[";

export async function saveItemInSecureStore(key: string, value: string) {
  try {
    await SecureStore.setItemAsync(key, value);
  } catch (error) {
    console.log("🚀 ~ saveItemInSecureStore ~ error:", error);
  }
}
export async function getValueFromSecureStoreFor(key: string) {
  try {
    let result = await SecureStore.getItemAsync(key);
    if (result) {
      return result;
    } else {
      return null;
    }
  } catch (error) {
    console.log("🚀 ~ getValueFromSecureStoreFor ~ error:", error);
  }
}

export async function deleteValueFromSecureStore(key: string) {
  try {
    await SecureStore.deleteItemAsync(key);
  } catch (error) {
    console.log("🚀 ~ deleteValueFromSecureStore ~ error:", error);
  }
}
