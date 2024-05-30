import { collection, addDoc, doc, setDoc, getDocs, query, where, getDoc, runTransaction, deleteDoc } from 'firebase/firestore';
import { updateDoc, arrayUnion, arrayRemove, writeBatch, increment, getFirestore } from 'firebase/firestore';
import db from '../firebase/init.js'
import { email } from './LogInScripts.js';
import { ref } from 'vue';
export var postsToShow = ref([])

export async function addPost(post, username, email) {
    const userDocRef = doc(db, 'posts', username);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (!userDoc.exists()) {
                const newPost = { postid: 1, comment: post.comment, url: post.url, qt_likes: 0, likes: [], created_at: new Date().toISOString().slice(0, 16).replace('T', ' '), username: username, email: email, pictureProfile: profilePictureUser.value };
                transaction.set(userDocRef, { username: username, email: email, posts: [newPost] });
            } else {
                const posts = userDoc.data().posts || [];
                const newPostId = posts.length > 0 ? posts[posts.length - 1].postid + 1 : 1;
                const newPost = { postid: newPostId, comment: post.comment, url: post.url, qt_likes: 0, likes: [], created_at: new Date().toISOString().slice(0, 16).replace('T', ' '), username: username, email: email, pictureProfile: profilePictureUser.value };
                posts.push(newPost);
                transaction.update(userDocRef, { posts: posts });
            }
        });
        console.log('Post added successfully');
        uploadPost.value = { comment: '', url: '' };
    } catch (error) {
        console.error('Error adding post: ', error);
    }
}

export var commentBackOffice = ref('')
export var urlBackOffice = ref('')

export var msgOfSuccessEdit = ref('')
export var msgOfSuccessEditPostId = ref('')

export async function editPost(postId, username, comment, url) {
    const userDocRef = doc(db, 'posts', username);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (userDoc.exists()) {
                const posts = userDoc.data().posts || [];
                const postIndex = posts.findIndex(post => post.postid === postId);

                if (postIndex !== -1) {
                    posts[postIndex].comment = comment;
                    posts[postIndex].url = url;
                    transaction.update(userDocRef, { posts: posts });
                } else {
                    console.error('Post not found');
                }
            } else {
                console.error('User not found');
            }
        });
        commentBackOffice.value = '';
        urlBackOffice.value = '';
        msgOfSuccessEdit.value = 'Post edited successfully, refresh to see changes';
        msgOfSuccessEditPostId.value = postId;
        console.log('Post edited successfully');
    } catch (error) {
        console.error('Error editing post: ', error);
    }
}

export var uploadPost = ref({ comment: '', url: '' });

export var msgOfSuccessDelete = ref('')
export var msgOfSuccessDeletePostId = ref('')

export async function deletePost(postId, username) {
    const userDocRef = doc(db, 'posts', username);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (userDoc.exists()) {
                const posts = userDoc.data().posts || [];
                const postToDelete = posts.find(post => post.postid === postId);

                if (postToDelete) {
                    transaction.update(userDocRef, { posts: arrayRemove(postToDelete) });
                    
                } else {
                    console.log('Post not found');
                }
            } else {
                console.log('User not found');
            }
        });
        msgOfSuccessDelete.value = 'Post deleted successfully, refresh to see changes';
        msgOfSuccessDeletePostId.value = postId;
        console.log('Post deleted successfully');
    } catch (error) {
        console.error('Error deleting post: ', error);
    }
}


export async function getPosts(username) {
    const userDocRef = doc(db, 'posts', username);

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const posts = userDoc.data().posts || [];
            postsToShow.value += posts
            // console.log(posts);
            return posts;
        } else {
            console.log('User not found');
            return [];
        }
    } catch (error) {
        console.error('Error getting posts: ', error);
        return [];
    }
}

export async function getPostsFollowing(username) {
    const userDocRef = doc(db, 'users', username);

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const following = userDoc.data().following || [];
            let posts = [];

            for (let i = 0; i < following.length; i++) {
                const followingUserDocRef = doc(db, 'posts', following[i]);
                const followingUserDoc = await getDoc(followingUserDocRef);

                if (followingUserDoc.exists()) {
                    const followingUserPosts = followingUserDoc.data().posts || [];
                    posts = [...posts, ...followingUserPosts];
                }
            }

            postsToShow.value += posts;
            return posts;
        } else {
            console.log('User not found');
            return [];
        }
    } catch (error) {
        console.error('Error getting posts: ', error);
        return [];
    }
}


export async function getPostById(username, postId) {
    const userDocRef = doc(db, 'posts', username);

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const posts = userDoc.data().posts || [];
            const post = posts.find(post => post.postid === postId);

            if (post) {
                console.log(post);
                return post;
            } else {
                console.log('Post not found');
                return null;
            }
        } else {
            console.log('User not found');
            return null;
        }
    } catch (error) {
        console.error('Error getting post: ', error);
        return null;
    }
}

export async function likePost(posterUsername, likerUsername, postId) {
    const userDocRef = doc(db, 'posts', posterUsername);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (userDoc.exists()) {
                const posts = userDoc.data().posts || [];
                const postToLike = posts.find(post => post.postid === postId);

                if (postToLike) {
                    if (postToLike.likes && postToLike.likes.includes(likerUsername)) {
                        console.log('User has already liked this post');
                    } else {
                        postToLike.qt_likes += 1;
                        postToLike.likes = postToLike.likes || [];
                        postToLike.likes.push(likerUsername);
                        transaction.update(userDocRef, { posts: posts });
                        console.log('Post liked successfully');
                    }
                } else {
                    console.log('Post not found');
                }
            } else {
                console.log('User not found');
            }
        });
    } catch (error) {
        console.error('Error liking post: ', error);
    }
}

export async function unlikePost(posterUsername, likerUsername, postId) {
    const userDocRef = doc(db, 'posts', posterUsername);

    try {
        await runTransaction(db, async (transaction) => {
            const userDoc = await transaction.get(userDocRef);

            if (userDoc.exists()) {
                const posts = userDoc.data().posts || [];
                const postToUnlike = posts.find(post => post.postid === postId);

                if (postToUnlike) {
                    if (postToUnlike.likes && postToUnlike.likes.includes(likerUsername)) {
                        postToUnlike.qt_likes = Math.max(0, postToUnlike.qt_likes - 1);
                        postToUnlike.likes = postToUnlike.likes.filter(user => user !== likerUsername);
                        transaction.update(userDocRef, { posts: posts });
                        console.log('Post unliked successfully');
                    } else {
                        console.log('User has not liked this post');
                    }
                } else {
                    console.log('Post not found');
                }
            } else {
                console.log('User not found');
            }
        });
    } catch (error) {
        console.error('Error unliking post: ', error);
    }
}

export async function userLikedPost(posterUserName, likerUserName, postId) {

    const postDocRef = doc(db, 'posts', posterUserName);


    const postDoc = await getDoc(postDocRef);
    if (postDoc.exists()) {

        const postData = postDoc.data();


        const post = postData.posts.find(post => post.postid === postId);


        if (post && post.likes.includes(likerUserName)) {
            // console.log('User has liked the post');
            return true;
        } else {
            // console.log('User has not liked the post');
            return false;
        }
    } else {
        // console.error('Post does not exist');
        return false;
    }
}

export async function userExists(username) {
    const userDocRef = doc(db, 'users', username);

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            console.error('Username already exists');
            return true;
        } else {
            console.log('Username does not exist');
            return false;
        }
    } catch (error) {
        console.error('Error checking user: ', error);
        return false;
    }
}

export async function addUser(username, pictureProfile) {

    const userDocRef = doc(db, 'users', username);

    if (pictureProfile === '') {
        pictureProfile = 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png';
    }

    try {
        await setDoc(userDocRef, {
            username: username,
            email: email.value,
            qt_followers: 0,
            qt_following: 0,
            following: [],
            followers: [],
            pictureProfile: pictureProfile
        });
        console.log('User added successfully');
        return true;
    } catch (error) {
        console.error('Error adding user: ', error);
        return false;
    }
}



export async function deleteUser(username) {
    const userDocRef = doc(db, 'users', username);
    const postDocRef = doc(db, 'posts', username);

    try {
        await deleteDoc(userDocRef);
        await deleteDoc(postDocRef);
        console.log('User deleted successfully');
        return true;
    } catch (error) {
        console.error('Error deleting user: ', error);
        return false;
    }
}

export async function followUser(currentUser, userToFollow) {
    const currentUserDocRef = doc(db, 'users', currentUser);
    const userToFollowDocRef = doc(db, 'users', userToFollow);


    const currentUserDoc = await getDoc(currentUserDocRef);
    if (currentUserDoc.exists()) {
        const currentUserData = currentUserDoc.data();
        if (currentUserData.following.includes(userToFollow)) {
            console.log('User is already following');
            return false;
        }
    }


    const batch = writeBatch(db);

    batch.update(currentUserDocRef, {
        following: arrayUnion(userToFollow),
        qt_following: increment(1)
    });

    batch.update(userToFollowDocRef, {
        followers: arrayUnion(currentUser),
        qt_followers: increment(1)
    });

    try {
        await batch.commit();
        console.log('User followed successfully');
        return true;
    } catch (error) {
        console.error('Error following user: ', error);
        return false;
    }
}

export async function unfollowUser(currentUser, userToUnfollow) {
    const currentUserDocRef = doc(db, 'users', currentUser);
    const userToUnfollowDocRef = doc(db, 'users', userToUnfollow);


    const currentUserDoc = await getDoc(currentUserDocRef);
    if (currentUserDoc.exists()) {
        const currentUserData = currentUserDoc.data();
        if (!currentUserData.following.includes(userToUnfollow)) {
            console.log('User is not following');
            return false;
        }
    }


    const batch = writeBatch(db);


    batch.update(currentUserDocRef, {
        following: arrayRemove(userToUnfollow),
        qt_following: increment(-1)
    });


    batch.update(userToUnfollowDocRef, {
        followers: arrayRemove(currentUser),
        qt_followers: increment(-1)
    });


    try {
        await batch.commit();
        console.log('User unfollowed successfully');
        return true;
    } catch (error) {
        console.error('Error unfollowing user: ', error);
        return false;
    }
}

export async function isUserFollowing(currentUsername, targetUsername) {
    if (!currentUsername || !targetUsername) {
        console.error('Invalid arguments for isUserFollowing:', { currentUsername, targetUsername });
        return false;
    }

    const userDocRef = doc(db, 'users', currentUsername);
    console.log('Getting document for:', { userDocRef, currentUsername, targetUsername });

    try {
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log('User data fetched successfully:', userData);
            return userData.following.includes(targetUsername);
        } else {
            console.log('No such user:', currentUsername);
            return false;
        }
    } catch (error) {
        console.error('Error getting user:', { currentUsername, targetUsername, error });
        return false;
    }
}

export async function getUsers() {
    const usersCollectionRef = collection(db, 'users');

    try {
        const usersSnapshot = await getDocs(usersCollectionRef);
        const users = usersSnapshot.docs.map(doc => doc.data());
        console.log(users);
        return users;
    } catch (error) {
        console.error('Error getting users: ', error);
        return [];
    }
}

import { profilePictureUser } from './LogInScripts.js';

export async function getProfilePicture(userName) {
    const userDocRef = doc(db, 'users', userName);

    try {
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
            const userData = userDoc.data();
            console.log(userData);
            profilePictureUser.value = userData.pictureProfile;

        } else {
            console.log('No such document!');
            return null;
        }
    } catch (error) {
        console.error('Error getting user: ', error);
        return null;
    }
}
