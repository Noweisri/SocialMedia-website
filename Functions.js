const baseurl = "https://tarmeezacademy.com/api/v1"
var url
let upd_id
let UserId
let source


// Making sure that is it a new user or not
function SetUpUi() {
    let token = localStorage.getItem("token")
    if (localStorage.getItem("token") == null) { // New user
        document.getElementById("TopLogin").style.display = "block"
        document.getElementById("TopReg").style.display = "block"
        document.getElementById("TopLogout").style.display = "none"
        document.getElementById("TopUsername").style.display = "none"
        document.getElementById("TopUserImg").style.display = "none"
        if (document.getElementById("addpost") != null) {
            document.getElementById("addpost").style.visibility = "hidden"
        }

    } else {
        document.getElementById("TopLogin").style.display = "none"
        document.getElementById("TopReg").style.display = "none"
        document.getElementById("TopLogout").style.display = "block"
        document.getElementById("TopUsername").style.display = "inline"
        document.getElementById("TopUsername").innerHTML = JSON.parse(localStorage.getItem("user")).name
        document.getElementById("TopUserImg").style.display = "block"
        document.getElementById("TopUserImg").src = JSON.parse(localStorage.getItem("user")).profile_image
        if (document.getElementById("addpost") != null) {
            document.getElementById("addpost").style.visibility = "visible"
        }
    }
}

// Showing alert for user when signing in
function ShowAlert(msg) {

    const alertPlaceholder = document.getElementById('Alert')
    const appendAlert = (message, type) => {
        const wrapper = document.createElement('div')
        wrapper.innerHTML = [
            `<div class="alert alert-${type} alert-dismissible" role="alert" id="Alert">`,
            `   <div>${message}</div>`,
            '</div>'
        ].join('')

        alertPlaceholder.append(wrapper)
    }

    appendAlert(msg, 'success');

    setTimeout(() => {
        document.getElementById("Alert").style.display = "none"
    }, 2000)

}

function ShowLoader(show) {
    if (show == true)
        document.getElementById("loaderdiv").style.visibility = "visible"
    else
        document.getElementById("loaderdiv").style.visibility = "hidden"
}
// Login
async function login() {
    ShowLoader(true)

    const username = document.getElementById("username")
    const pwd = document.getElementById("pwd")
    url = baseurl + "/login";
    console.log(url)
    let response = await axios.post(url, {
        "username": username.value,
        "password": pwd.value
    }).catch(function (error) {
        document.getElementById("error").innerHTML = error.response.data.message
        ShowLoader(false)
    });

    localStorage.setItem("user", JSON.stringify(response.data.user))
    localStorage.setItem("token", response.data.token)

    const modal = document.getElementById("LoginModal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    ShowAlert("Logged in successfully")
    SetUpUi()
    console.log("Login completed")
    ShowLoader(false)
}

// Register
async function Register() {
    ShowLoader(true)

    const name = document.getElementById("reg-name").value
    const username = document.getElementById("reg-username").value
    const pwd = document.getElementById("reg-pwd").value
    const img = document.getElementById("reg-img").files[0]
    console.log(name, username, pwd)

    url = baseurl + "/register";

    let formData = new FormData()
    formData.append("username", username)
    formData.append("name", name)
    formData.append("password", pwd)
    formData.append("image", img)

    let response = await axios.post(url, formData).catch((error) => {
        document.getElementById("reg-error").innerHTML = error.response.data.message
        ShowLoader(false)
        return
    });
    console.log(response.data.user)
    localStorage.setItem("user", JSON.stringify(response.data.user))
    localStorage.setItem("token", response.data.token)

    const modal = document.getElementById("RegisterModal")
    const modalInstance = bootstrap.Modal.getInstance(modal)
    modalInstance.hide()
    ShowAlert("Registration completed successfully")
    SetUpUi()
    console.log("Register completed")
    ShowLoader(false)
}

// Logout
function logout() {
    if (confirm("Aro you sure you want to logout?")) {
        localStorage.removeItem("token")
        localStorage.removeItem("user")
        SetUpUi()
        ShowAlert("Logged out successfully")
        console.log("Logout completed!")
    }
}

// Showing Timeline
async function showtimeline(page = 1, reset = true) {
    SetUpUi()
    ShowLoader(true)
    url = baseurl + "/posts?limit=3&page=" + page
    var src = 1
    let response = await axios.get(url)

    console.log("Showing timeline response:" + response)

    let posts = response.data.data
    LastPage = response.data.meta.last_page

    // Reset the PreCoded posts , for testing only 
    if (reset == true) {
        document.getElementById("posts").innerHTML = ""
    }

    let content = ``
    for (post of posts) {
        content =
            `
                <!-- Post -->
                    <div class="post card shadow-sm" style="margin-bottom: 30px; cursor: pointer; transition: all 0.5s;">
                        <div class="card-header d-flex flex-wrap flex-lg-row" style="height: 54px;" onclick="ShowPost(${post.id})">
                            <!-- user image -->
                            <div id="userimage-${post.id}">
                                <i class="bi bi-person-fill" style="font-size:2.3em;" class="rounded-circle border border-1 position-absolute"></i>
                            </div>
                            <!-- username -->
                            <b id="username" class="mx-2 position-absolute" style="left: 60px; top: 14px;">${post.author.username}</b>
                        </div>

                        <div id="Card-Header-${post.id}" class="position-absolute d-flex justify-content-end w-100" style="top:8px; right:15px;">       
                        </div>

                        <div class="card-body" onclick="ShowPost(${post.id})">
                            <!-- Post image -->
                            <div id="postimg-${post.id}">
                                
                            </div>
                            <!-- Post time -->
                            <span id="posttime" class="fw-lighter fs-6 d-block text-end mx-4">${post.created_at}</span>
                            <!-- Post title -->
                            <div id="posttitle-${post.id}">
                                
                            </div>
                            <!-- Post body -->
                            <p class="card-text" id="PostBody">${post.body}</p>
                            <hr>
                            <!-- Comments -->
                            <div>
                                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pen mb-1" viewBox="0 0 16 16">
                                    <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                    </svg>
                                <span class="me-3">${post.comments_count} Comments</span>

                                <div id="post-tags-${post.id}" style="display:inline; font-size:small;">

                                </div>
                            </div>
                        </div>
                    </div>
                `

        // Adding the post to the timeline
        document.getElementById("posts").innerHTML += content

        // if the user has no image don't show it
        userimag = "userimage-" + post.id
        if (Object.keys(post.author.profile_image).length != 0)
            document.getElementById(userimag).innerHTML = `<img src="${post.author.profile_image}" alt="" style="width: 40px; height:40px" class="rounded-circle border border-1 position-absolute">`


        // If the post has no image don't show it
        postimg = "postimg-" + post.id
        if (Object.keys(post.image).length != 0) {
            console.log()
            document.getElementById(postimg).innerHTML += `<img src="${post.image}" alt="" class="w-100 bg-light-subtle" style="max-height: 500px; object-fit:contain;" id="postimg">`
        }

        // If the post has no title don't show it
        posttitle = "posttitle-" + post.id
        if (post.title != null) {
            document.getElementById(posttitle).innerHTML += `<h5 class="card-title" id="PostTitle">${post.title}</h5>`
        }

        if (localStorage.getItem("user") != null) {
            // Add edit & delete buttons if the post belongs to the user
            if (post.author.id == JSON.parse(localStorage.getItem("user")).id)
                document.getElementById(`Card-Header-${post.id}`).innerHTML = `
                    <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#UpdatePostModal" onclick="StoreId(${post.id})">Edit</button>
                    <button type="button" class="btn btn-outline-danger ms-3" onclick="DeletePost(${post.id} , ${src} )">Delete</button>`
        }

        // Add tags to the post
        const CurrentPostTag = "post-tags-" + post.id
        for (tag of post.tags) {
            let cont = `<span class="tags ms-3 rounded">${tag.name}</span>`
            document.getElementById(CurrentPostTag).innerHTML += cont
        }
        // Finally go to the next post
    }
    ShowLoader(false)
}

// Show Post after clicking
async function ShowPost(id) {
    Scrollable = false
    SetUpUi()
    if (document.getElementById("posts") != null)
        document.getElementById("posts").innerHTML = ""
    else {
        document.getElementById("userposts").innerHTML = ""
        document.getElementById("yourposts").style.display = "none"
    }


    url = baseurl + "/posts/" + id

    let response = await axios.get(url)
    let post = response.data.data

    content =
        `
        <!-- Post -->
        <Span class="text-start fw-bolder fs-2 ms-3 mb-5 col-8 mt-5" id="ph">${post.author.name}'s Post</span>
            <div class="card shadow-sm mt-2" id = "post" style="margin-bottom: 30px;">
                <div class="card-header d-flex flex-wrap flex-lg-row" style="height: 54px;" onclick="ShowPost(${post.id})">
                    <!-- user image -->
                    <div id="userimage-${post.id}">
                        <i class="bi bi-person-fill" style="font-size:2.3em;" class="rounded-circle border border-1 position-absolute"></i>
                    </div>
                    <!-- username -->
                    <b id="username" class="mx-2 position-absolute" style="left: 60px; top: 14px;">${post.author.username}</b>
                </div>

                <div id="Card-Header-${post.id}" class="position-absolute d-flex justify-content-end w-100" style="top:8px; right:15px;">       
                </div>

                <div class="card-body" onclick="ShowPost(${post.id})">
                    <!-- Post image -->
                <div id="postimg-${post.id}">
                        
            </div>
            <!-- Post time -->
                    <span id="posttime" class="fw-lighter fs-6 d-block text-end mx-3">${post.created_at}</span>
                    <!-- Post title -->
                    <div id="posttitle-${post.id}">
                                
                    </div>
                    <!-- Post body -->
                    <p class="card-text" id="PostBody">${post.body}</p>
                    <hr>
                    <!-- Comments -->
                    <div>
                        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pen mb-1" viewBox="0 0 16 16">
                            <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                            </svg>
                        <span class="me-3">${post.comments_count} Comments</span>

                        <div id="post-tags-${post.id}" style="display:inline; font-size:small;">

                        </div>
                        <hr>
                        <div id="CommentsSection" class="p-4 rounded-3 bg-dark text-white">
                            <div id="OneComment" class="mb-5">
                                <img src="test logo.png" class="rounded-circle me-2 border border-white bg-white" style="width: 35px; height: 35px;" id="CS_UserImg" alt="">
                                <span id="CS_UserName" class="text-white fw-lighter fs-6 position-relative" style=" top:32px; right: 50px;">Nawaf</span>
                                <span id="CS_UserComment" class="p-1 rounded bg-warning text-dark fw-medium position-relative" style="right: 38px; top: 2px;"> hello</span>
                            </div>
                            <div class="input-group mt-5">
                                <input type="text" class="form-control" id="CS_Input_${id}" placeholder="Write Something." aria-label="Recipient's username" aria-describedby="button-addon2">
                                <button class="btn btn-outline-warning" type="button" id="button-addon2" onclick="PostComment(${id})">Send</button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
    `

    if (document.getElementById("posts") != null)
        document.getElementById("posts").innerHTML = content
    else {
        document.getElementById("userposts").innerHTML = content
        document.getElementById("yourpostsdiv").innerHTML = `<Span class="text-start fw-bolder fs-2 ms-3 col-8 mt-5">${post.author.name}'s Post</span>`
        document.getElementById("ph").style.display = "none"
    }

    // if the user has no image don't show it
    userimag = "userimage-" + post.id
    if (Object.keys(post.author.profile_image).length != 0)
        document.getElementById(userimag).innerHTML = `<img src="${post.author.profile_image}" alt="" style="width: 40px; height:40px" class="rounded-circle border border-1 position-absolute">`


    // If the post has no image don't show it
    postimg = "postimg-" + post.id
    if (Object.keys(post.image).length != 0) {
        console.log()
        document.getElementById(postimg).innerHTML += `<img src="${post.image}" alt="" class="w-100 bg-light-subtle" style="max-height: 500px; object-fit:contain;" id="postimg">`
    }

    // If the post has no title don't show it
    posttitle = "posttitle-" + post.id
    if (post.title != null) {
        document.getElementById(posttitle).innerHTML += `<h5 class="card-title" id="PostTitle">${post.title}</h5>`
    }



    const CurrentPostTag = "post-tags-" + post.id
    const Comments = post.comments

    // Loop showing tags
    for (tag of post.tags) {
        content = `<span class="tags ms-3 rounded">${tag.name}</span>`
        document.getElementById(CurrentPostTag).innerHTML += content
    }

    // Loop showing Comments section
    document.getElementById("CommentsSection").innerHTML = ""
    for (comment of Comments) {
        content =
            `<div class="mb-5">
                    <img src="${comment.author.profile_image}" class="rounded-circle me-2 border border-white bg-white" style="width: 35px; height: 35px;" id="CS_UserImg" alt="">
                    <span id="CS_UserName" class="text-white fw-lighter fs-6 position-relative" style=" top:32px; right: 50px;">${comment.author.username}</span>
                    <span id="CS_UserComment" class="p-1 rounded bg-warning text-dark fw-medium position-relative" style="right: 38px; top: 2px;">${comment.body}</span>
                </div>`
        document.getElementById("CommentsSection").innerHTML += content
    }
    // Adding input bar in the last
    document.getElementById("CommentsSection").innerHTML += `
            <div class="input-group mt-5">
                <input type="text" class="form-control" id="CS_Input_${id}" placeholder="Write Something." aria-label="Recipient's username" aria-describedby="button-addon2">
                <button class="btn btn-outline-warning" type="button" id="button-addon2" onclick="PostComment(${id})">Send</button>
            </div>`
}

// Post Comment function
async function PostComment(id) {

    if (localStorage.getItem("user") == null) {
        ShowAlert("Sorry, but to post a comment you have to be signed in.")
        return
    }

    let url = baseurl + "/posts/" + id + "/comments"

    let parms = {
        "body": document.getElementById(`CS_Input_${id}`).value
    }
    let response = await axios.post(url, parms, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem("token")}`
        }
    })
    console.log("Comment Posted")
    ShowPost(id)
}

// Store post Id for EditPost() method
function StoreId(id) { upd_id = id }

// Edit post
function EditPost(src) {
    url = baseurl + "/posts/" + upd_id
    parms = {
        "body": document.getElementById("UpdatePost-body").value,
    }
    axios.put(url, parms, {
        headers: {
            "authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }).then((response) => {
        const modal = document.getElementById("UpdatePostModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        ShowAlert("Post Updated successfully")

        if (src == "home")
            showtimeline()
        else {
            ShowProfileInfo()
            ShowUserPosts()
        }

    }).catch((error) => {
        document.getElementById("upd-error").innerHTML = error.data
    });

}

// Show user profile information
async function ShowProfileInfo() {

    ShowLoader(true)

    UserId = JSON.parse(localStorage.getItem("user")).id
    url = baseurl + "/users/" + UserId

    let response = await axios.get(url)

    document.getElementById("prf_userimg").src = response.data.data.profile_image
    document.getElementById("prf_username").innerHTML = "Username: " + response.data.data.username
    document.getElementById("prf_name").innerHTML = "Name: " + response.data.data.name
    document.getElementById("prf_email").innerHTML = "Email: " + response.data.data.email
    document.getElementById("prf_userposts").innerHTML = "Posts: " + response.data.data.posts_count
    document.getElementById("prf_usercomments").innerHTML = "Comments: " + response.data.data.comments_count
    document.getElementById("yourposts").style.display = "block"

    ShowLoader(false)
}

// Show user's posts in profile page
function ShowUserPosts() {
    ShowLoader(true)

    const src = 0 // Variable to know what is the sourse of clicking delete button

    UserId = JSON.parse(localStorage.getItem("user")).id
    url = baseurl + "/users/" + UserId + "/posts"

    axios.get(url).then((response) => {
        let MyPosts = response.data.data

        // Hide loading icon when showing posts
        document.getElementById("loading").style.display = "none"

        for (post of MyPosts) {
            let con =
                `
                <!-- Post -->
                <div class="post card shadow-sm" style="margin-bottom: 30px; cursor: pointer; transition: all 0.5s;">
                    <div class="card-header d-flex flex-wrap flex-lg-row" style="height: 54px;" onclick="ShowPost(${post.id})">
                        <!-- user image -->
                        <div id="userimage-${post.id}">
                            <i class="bi bi-person-fill" style="font-size:2.3em;" class="rounded-circle border border-1 position-absolute"></i>
                        </div>
                        <!-- username -->
                        <b id="username" class="mx-2 position-absolute" style="left: 60px; top: 14px;">${post.author.username}</b>
                    </div>
                    <div class="position-absolute d-flex justify-content-end w-100" style="top:8px; right:15px;">
                        <button type="button" class="btn btn-outline-secondary" data-bs-toggle="modal" data-bs-target="#UpdatePostModal" onclick="StoreId(${post.id})">Edit</button>
                        <button type="button" class="btn btn-outline-danger ms-3" onclick="DeletePost(${post.id} , ${src} )">Delete</button>
                    </div>

                    <div class="card-body" onclick="ShowPost(${post.id})">
                        <!-- Post image -->
                        <div id="postimg-${post.id}">
                            
                        </div>
                        <!-- Post time -->
                        <span id="posttime" class="fw-lighter fs-6 d-block text-end mx-4">${post.created_at}</span>
                        <!-- Post title -->
                        <div id="posttitle-${post.id}">
                            
                        </div>
                        <!-- Post body -->
                        <p class="card-text" id="PostBody">${post.body}</p>
                        <hr>
                        <!-- Comments -->
                        <div>
                            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" fill="currentColor" class="bi bi-pen mb-1" viewBox="0 0 16 16">
                                <path d="m13.498.795.149-.149a1.207 1.207 0 1 1 1.707 1.708l-.149.148a1.5 1.5 0 0 1-.059 2.059L4.854 14.854a.5.5 0 0 1-.233.131l-4 1a.5.5 0 0 1-.606-.606l1-4a.5.5 0 0 1 .131-.232l9.642-9.642a.5.5 0 0 0-.642.056L6.854 4.854a.5.5 0 1 1-.708-.708L9.44.854A1.5 1.5 0 0 1 11.5.796a1.5 1.5 0 0 1 1.998-.001zm-.644.766a.5.5 0 0 0-.707 0L1.95 11.756l-.764 3.057 3.057-.764L14.44 3.854a.5.5 0 0 0 0-.708l-1.585-1.585z"/>
                                </svg>
                            <span class="me-3">${post.comments_count} Comments</span>

                            <div id="post-tags-${post.id}" style="display:inline; font-size:small;">

                            </div>
                        </div>
                    </div>
                </div>
                    `
            document.getElementById("userposts").innerHTML += con


            // if the user has no image don't show it
            userimag = "userimage-" + post.id
            if (Object.keys(post.author.profile_image).length != 0)
                document.getElementById(userimag).innerHTML = `<img src="${post.author.profile_image}" alt="" style="width: 40px; height:40px" class="rounded-circle border border-1 position-absolute">`


            // If the post has no image don't show it
            postimg = "postimg-" + post.id
            if (Object.keys(post.image).length != 0) {
                console.log()
                document.getElementById(postimg).innerHTML += `<img src="${post.image}" alt="" class="w-100 bg-light-subtle" style="max-height: 500px; object-fit:contain;" id="postimg">`
            }

            // If the post has no title don't show it
            posttitle = "posttitle-" + post.id
            if (post.title != null) {
                document.getElementById(posttitle).innerHTML += `<h5 class="card-title" id="PostTitle">${post.title}</h5>`
            }
        }

    })
    ShowLoader(false)
}

function DeletePost(id, loc) {

    url = baseurl + "/posts/" + id

    if (confirm("Are you sure you want to delete the post?")) {
        axios.delete(url, {
            headers: {
                "authorization": `Bearer ${localStorage.getItem("token")}`
            }
        }).then((response) => {
            ShowAlert("Post deleted successfully")
            if (loc == 1)
                showtimeline()
            else
                ShowUserPosts()
        }).catch((error) => {
            console.log(error)
        })
    }
    else return
}

function UpdateProfile() {

    url = baseurl + "/updatePorfile"

    var parms = {
        "username": document.getElementById("updateprof-name").value,
        "password": document.getElementById("updateprof-pwd").value
    }

    axios.put(url, parms, {
        headers: {
            "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
    }).then((response) => {
        const modal = document.getElementById("UpdateProfileModal")
        const modalInstance = bootstrap.Modal.getInstance(modal)
        modalInstance.hide()
        ShowAlert("Profile Updated successfully")
        ShowProfileInfo()
    }).catch((error) => {
        console.log(error)
        document.getElementById("updateprof-error").innerHTML = error.response.data.message
    });
}