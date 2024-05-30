<template>
  <div id="app" class="flex container h-screen w-full">
    <!-- side nav -->
    <div class="w-1/5 border-r border-lighter px-6 py-2 flex flex-col justify-between sidebar">
      <div>
        <button class="h-12 w-12 hover:bg-lightblue text-3xl rounded-full text-blue">
          
        </button>
        <div>
          <button v-for="tab in tabs" @click="id = tab.id"
            :class="`focus:outline-none hover:text-blue flex items-center py-2 px-4 hover:bg-lightblue rounded-full mr-auto mb-3 ${id === tab.id ? 'text-blue' : ''}`">
            <i :class="`${tab.icon} text-2xl mr-4 text-left`"></i>
            <p class="text-lg font-semibold text-left block"> {{ tab.title }} </p>
          </button>
          <button @click="toggleTheme" class="focus:outline-none hover:text-blue flex items-center py-2 px-4 hover:bg-lightblue rounded-full mr-auto mb-3" v-if="themeStore.theme == 'light'">
            <i class="text-2xl mr-4 text-left"></i>
            <p class="text-lg font-semibold text-left block"> Dark theme </p>
          </button>
          <button @click="toggleTheme" class="focus:outline-none hover:text-blue flex items-center py-2 px-4 hover:bg-lightblue rounded-full mr-auto mb-3" v-if="themeStore.theme == 'dark'">
            <i class="text-2xl mr-4 text-left"></i>
            <p class="text-lg font-semibold text-left block"> Light theme </p>
          </button>
        </div>
      </div>
      <div class="w-full relative">
        <button v-if="isLoggedIn" @click="dropdown = true"
          class="flex items-center w-full hover:bg-lightblue rounded-full p-2 focus:outline-none">
          <img :src="profilePictureUser" class="w-10 h-10 rounded-full border border-lighter" />

          <div class="block ml-4">
            <p class="text-sm font-bold leading-tight"> {{ userName }} </p>
            <p class="text-sm leading-tight"> {{ email }} </p>
          </div>
          <i class="block fas fa-angle-down ml-auto text-lg"></i>
        </button>
        <div v-if="isLoggedIn === false">
          <router-link :to="`/login`">
            <button
              class="text-white bg-blue rounded-full font-semibold focus:outline-none h-auto w-full p-3 hover:bg-darkblue">
              <p class="block">Log In</p>
            </button>
          </router-link>
        </div>
        <div v-if="dropdown === true"
          class="absolute bottom-0 left-0 w-64 rounded-lg shadow-md border-lightest bg-white mb-16">
          <button @click="dropdown = false" class="p-3 flex items-center w-full hover:bg-lightest focus:outline-none">
            <img :src="profilePictureUser" class="w-10 h-10 rounded-full border border-lighter" />
            <div class="ml-4">
              <p class="text-sm font-bold leading-tight"> {{ userName }} </p>
              <p class="text-sm leading-tight"> {{ email }} </p>
            </div>
            <i class="fas fa-check ml-auto test-blue"></i>
          </button>

          <button @click="signOutUser(); dropdown = false;"
            class="w-full text-left hover:bg-lightest border-t border-lighter p-3 test-sm focus:outline-none">
            Log out {{ userName }}
          </button>
        </div>
      </div>
    </div>
    <!-- tweets -->
    <div v-if="isLoggedIn == false" class="w-full md:w-1/2 h-full overflow-y-scroll" style="display: flex;
      justify-content: center; align-items: center;">
      <h1 style="color: red; color: red; font-size: 30px; font-weight: 900;">You have to log in</h1>
    </div>
    <div class="w-full md:w-1/2 h-full overflow-y-scroll" v-if="isLoggedIn">
      <div class="px-5 py-3 border-b border-lighter flex items-center justify-between">
        <h1 class="text-xl font-bold">Home</h1>
      </div>
      <div class="px-5 py-3 border-b-8 border-lighter flex">
        <div class="flex-none">
          <img :src="profilePictureUser" class="flex-none w-12 h-12 rounded-full border border-lighter" />
        </div>
        <form v-on:submit.prevent="" class="w-full px-4 relative">
          <textarea v-model="uploadPost.comment" placeholder="What's up?" class="mt-3 pb-3 w-full focus:outline-none" />
          <div class="flex items-center">
            <button @click="showModal = true">
              <i class="text-lg text-blue mr-4 far fa-image"></i>
            </button>

          </div>
          <button @click="handleAddPost(uploadPost, userName, email)" type="submit"
            class="h-10 px-4 text-white font-semibold bg-blue hover:bg-darkblue focus:outline-none rounded-full absolute bottom-0 right-0">
            Post
          </button>
        </form>
      </div>
      <div class="flex flex-col-reverse">
        <div v-for="post in posts" class="w-full p-4 border-b hover:bg-lighter flex">
          <div class="flex-none mr-4">
            <img :src="post.pictureProfile" class="h-12 w-12 rounded-full flex-none" />
          </div>
          <div class="w-full">
            <div class="flex items-center w-full">
              <p class="font-semibold"> {{ post.username }} </p>
              <p class="text-sm text-dark ml-2"> {{ post.email }} </p>
              <p class="text-sm text-dark ml-2"> {{ post.created_at }} </p>

              <i class="fas fa-angle-down text-dark ml-auto"></i>
            </div>
            <img :src="post.url" alt="" v-if="post.url != ''" style="max-width: 400px;">
            <p class="py-2 text-left">
              {{ post.comment }}
            </p>
            <div class="flex items-center justify-between w-full">

              <button v-if="userLikedPostsMap[post.postid]" class="flex items-center text-sm text-pink-500"
                @click="unlikePost(post.username, userName, post.postid)">
                <i class="fas fa-heart mr-3"></i>
                <p> {{ post.qt_likes }}</p>
              </button>

              <button v-else class="flex items-center text-sm text-dark"
                @click="likePost(post.username, userName, post.postid);">
                <i class="fas fa-heart mr-3"></i>
                <p> {{ post.qt_likes }}</p>
              </button>

              <div class="flex items-center text-sm text-dark">
                <i class="fas fa-share-square mr-3"></i>
              </div>
            </div>
            <div v-if="isAdmin">
              <h1 style="font-weight: 900;">EDIT POST</h1>
              <div style="margin-top: 20px;">
                <input type="text" v-model="commentBackOffice" placeholder="edit the comment" style="background-color: darkblue; color: white;">
              </div>
              <div style="margin-top: 20px;">
                <input type="text" v-model="urlBackOffice" placeholder="edit the url of the picture"
                  style="background-color: darkblue; color: white;">
              </div>
              <div style="margin-top: 20px;">
                <button @click="handleEditPost(post.postid, post.username, commentBackOffice, urlBackOffice)" 
                  class="h-10 px-4 text-white font-semibold bg-blue hover:bg-darkblue focus:outline-none rounded-full bottom-0 right-0">
                  edit the post
                </button>
                
              </div>
              <div style="margin-top: 20px;">
                <button @click="handleDeletePost(post.postid, post.username)" 
                  class="h-10 px-4 text-white font-semibold bg-red-700 hover:bg-black focus:outline-none rounded-full bottom-0 right-0">
                  delete this post
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </div>




    </div>
    <!-- trending -->
    <div class="md:block hidden w-1/3 h-full border-l border-lighter py-2 px-6 overflow-y-scroll relative">
      <input class="pl-12 rounded-full w-full p-2 bg-lighter text-sm mb-4" placeholder="Search Twitter" />
      <i class="fas fa-search absolute left-0 top-0 mt-5 ml-12 text-sm text-light"></i>
      <div class="w-full rounded-lg bg-lightest trends">
        <div class="flex items-center justify-between p-3">
          <p class="text-lg font-bold">Trends for You</p>
          <i class="fas fa-cog text-lg text-blue"></i>
        </div>
        <button v-for="trend in trending"
          class="w-full flex justify-between hover:bg-lighter p-3 border-t border-lighter trends">
          <div>
            <p class="text-xs text-left leading-tight text-dark trends"> {{ trend.top }} </p>
            <p class="font-semibold text-sm text-left leading-tight trends"> {{ trend.title }} </p>
            <p class="text-left text-sm leading-tight text-dark trends"> {{ trend.bottom }} </p>
          </div>
          <i class="fas fa-angle-down text-lg text-dark"></i>
        </button>
        <button class="p-3 w-full hover:bg-lighter text-left text-blue border-t border-lighter">
          Show More
        </button>
      </div>





      <div class="w-full rounded-lg bg-lightest my-4 trends">
        <div class=" p-3">
          <p class="text-lg font-bold">Who to Follow</p>
        </div>

        <div v-if="isAdmin">
          <div v-for="user in usersFromFirebase" :key="user.username">
            <div v-if="user.username != userName" class="w-full flex hover:bg-lighter p-3 border-t border-lighter">
              <div class="block ml-4">
                <p class="text-sm font-bold leading-tight">{{ user.username }}</p>
                <p class="text-sm leading-tight">{{ user.email }}</p>
              </div>
              <button v-if="followingStatus[user.username]" @click="unfollowUser(userName, user.username)"
                class="ml-auto text-sm text-blue py-1 px-4 rounded-full border-2 border-blue">
                Unfollow
              </button>
              <button v-else @click="followUser(userName, user.username)"
                class="ml-auto text-sm text-blue py-1 px-4 rounded-full border-2 border-blue">
                Follow
              </button>
              <button  @click="handleDeleteUser(user.username)"
                class="ml-auto text-sm text-blue py-1 px-4 rounded-full border-2 border-blue">
                DELETE USER
              </button>
            </div>
          </div>
        </div>

        <div v-if="isLoggedIn && !isAdmin">
          <div v-for="user in usersFromFirebase" :key="user.username">
            <div v-if="user.username != userName" class="w-full flex hover:bg-lighter p-3 border-t border-lighter">
              <img :src="user.pictureProfile" class="w-12 h-12 rounded-full border border-lighter" />
              <div class="block ml-4">
                <p class="text-sm font-bold leading-tight">{{ user.username }}</p>
                <p class="text-sm leading-tight">{{ user.email }}</p>
              </div>
              <button v-if="followingStatus[user.username]" @click="unfollowUser(userName, user.username)"
                class="ml-auto text-sm text-blue py-1 px-4 rounded-full border-2 border-blue">
                Unfollow
              </button>
              <button v-else @click="followUser(userName, user.username)"
                class="ml-auto text-sm text-blue py-1 px-4 rounded-full border-2 border-blue">
                Follow
              </button>
            </div>
          </div>
        </div>
        <div v-else>
          <h1 class="text-red font-bold">You must log in</h1>
        </div>
        <button class="p-3 w-full hover:bg-lighter text-left text-blue border-t border-lighter showmore">
          Show More
        </button>
      </div>
    </div>
  </div>
  <ImageUpload :show="showModal" @close="showModal = false" @upload="handleImageUpload" />
</template>

<script setup>
import { ref, reactive, onMounted, watch } from 'vue';
import '../assets/index.css';
import ImageUpload from './ImageUpload.vue';
import { useAuth, profilePictureUser } from '@/scripts/LogInScripts';
import { useThemeStore } from '../store/themeStore';

const themeStore = useThemeStore();

var colors = ""
onMounted(() => {
  colors = assignColors()
})

const toggleTheme = () => {
        themeStore.setTheme(themeStore.theme === 'light' ? 'dark' : 'light');
        colors = assignColors();
    };

const assignColors = () => {
        const colors = {
            background: themeStore.theme === "light" ? "#ffffff" : "#14161A",
            primary: themeStore.theme === "light" ? "#484b6a" : "#181B20",
            secondary: themeStore.theme === "light" ? "#E1E8ED" : "#6c757d",
            tertiary: themeStore.theme === "light" ? "#d2d3db" : "#363b50",
            text: themeStore.theme === "light" ? "#181B20" : "#6c757d",
            text2: themeStore.theme === "light" ? "#000000" : "#ffffff"
        };
        document.documentElement.style.setProperty("--backg-color", colors.background);
        document.documentElement.style.setProperty("--primary-color", colors.primary);
        document.documentElement.style.setProperty("--secondary-color", colors.secondary);
        document.documentElement.style.setProperty("--tertiary-color", colors.tertiary);
        document.documentElement.style.setProperty("--text-color", colors.text);
        document.documentElement.style.setProperty("--text-color2", colors.text2);
        return colors;
    };

const imageUrl = ref('')

const showModal = ref(false);

import { uploadPost, commentBackOffice, urlBackOffice, deleteUser } from '@/scripts/firebaseScripts'

const handleImageUpload = (Url) => {
  uploadPost.url = (Url);

};


const { isLoggedIn } = useAuth();


import {
  getPosts, addPost, deletePost, editPost, getPostById, postsToShow, getPostsFollowing,
  getUsers, likePost as likePostFirebase, unlikePost as unlikePostFirebase,
  userLikedPost, isUserFollowing as isUserFollowingFirebase, unfollowUser as unfollowUserFirebase, followUser as followUserFirebase
} from '@/scripts/firebaseScripts'

import {
  toggleLogin,
  emailSign,
  passwordSign,
  errMsg,
  user,
  emptyForm,
  registerSign,
  email,
  password,
  confirmPassword,
  userName,
  register,
  signOutUser,
  isAdmin
} from '@/scripts/LogInScripts';
import { comment } from 'postcss';

let posts = ref([]);
let usersFromFirebase = ref([]);


if (email.value == '') {
  email.value = emailSign.value
}




let userLikedPostsMap = ref({});
let followingStatus = ref({});

async function loadPosts() {
  try {
    if (isLoggedIn.value) {
      const userPosts = await getPosts(userName.value);
      const followingPosts = await getPostsFollowing(userName.value);
      posts.value = userPosts.concat(followingPosts);

      let promises = posts.value.map(post => userLikedPost(post.username, userName.value, post.postid));
      let results = await Promise.all(promises);
      results.forEach((result, index) => {
        userLikedPostsMap.value[posts.value[index].postid] = result;
      });
    }
    usersFromFirebase.value = await getUsers();
    await updateFollowingStatus();
  } catch (error) {
    console.error('Error loading posts:', error);
  }
}

async function updateFollowingStatus() {
  for (const user of usersFromFirebase.value) {
    followingStatus.value[user.username] = await isUserFollowingFirebase(userName.value, user.username);
  }
}

async function likePost(postUsername, currentUserName, postId) {
  await likePostFirebase(postUsername, currentUserName, postId);
  userLikedPostsMap.value[postId] = true;

  await loadPosts();
}

async function unlikePost(postUsername, currentUserName, postId) {
  await unlikePostFirebase(postUsername, currentUserName, postId);
  userLikedPostsMap.value[postId] = false;

  await loadPosts();

}

async function followUser(currentUser, targetUser) {
  await followUserFirebase(currentUser, targetUser);
  followingStatus.value[targetUser] = true;
  await loadPosts();
}

async function unfollowUser(currentUser, targetUser) {
  await unfollowUserFirebase(currentUser, targetUser);
  followingStatus.value[targetUser] = false;
  await loadPosts();
}

async function handleAddPost(uploadPost, userName, email) {
  try {
    await addPost(uploadPost, userName, email);
    await loadPosts();
  } catch (error) {
    console.error('Error adding post:', error);
  }
}

async function handleEditPost(postId, username, commentBackOffice, urlBackOffice) {
  try {
    await editPost(postId, username, commentBackOffice, urlBackOffice);
    await loadPosts();
  } catch (error) {
    console.error('Error editing post:', error);
  }
}

async function handleDeletePost(postId, username) {
  try {
    await deletePost(postId, username);
    await loadPosts();
  } catch (error) {
    console.error('Error deleting post:', error);
  }
}

async function handleDeleteUser(username) {
  try {
    await deleteUser(username);
    await loadPosts();
  } catch (error) {
    console.error('Error deleting user:', error);
  }
}


watch(usersFromFirebase, updateFollowingStatus, { immediate: true });

onMounted(loadPosts);





const tabs = ref([
  { icon: 'fas fa-home', title: 'Home', id: 'home' },
  { icon: 'fas fa-hashtag', title: 'Explore', id: 'explore' },
  { icon: 'far fa-bell', title: 'Notifications', id: 'notifications' },
  { icon: 'far fa-envelope', title: 'Messages', id: 'messages' },
  { icon: 'far fa-bookmark', title: 'Bookmarks', id: 'bookmarks' },
  { icon: 'fas fa-clipboard-list', title: 'Lists', id: 'lists' },
  { icon: 'far fa-user', title: 'Profile', id: 'profile' },
  { icon: 'fas fa-ellipsis-h', title: 'More', id: 'more' },
]);

const id = ref('home');
const dropdown = ref(false);

const trending = ref([
  { top: 'Trending in TX', title: 'Gigi', bottom: 'Trending with: Rip Gigi' },
  { top: 'Music', title: 'We Won', bottom: '135K Tweets' },
  { top: 'Pop', title: 'Blue Ivy', bottom: '40k tweets' },
  { top: 'Trending in US', title: 'Denim Day', bottom: '40k tweets' },
  { top: 'Trending', title: 'When Beyonce', bottom: '25.4k tweets' },
]);



const LandingPage = {
  name: 'LandingPage',
};


</script>
<style>
#app, textarea{
  background-color: var(--backg-color) !important;
  color: var(--text-color);
}
input{
  background-color: var(--secondary-color) !important;
}
.trends{
  background-color: var(--secondary-color) !important;
  border-color: var(--secondary-color) !important;
  color: var(--text-color2);
}
.showmore{
  border-color: rgb(225 232 237 / var(--tw-border-opacity));
}
</style>