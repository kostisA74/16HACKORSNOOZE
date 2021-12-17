"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

/** Add new story functionality */

function navAddStory(event) {
  event.preventDefault()
  $addForm.toggleClass('isVisible')
}

function navFavorites(event) {
  event.preventDefault()
  console.debug("navFavorites", event);
  hidePageComponents();
  putFavoritesOnPage();
}

function navMyStories(event) {
  event.preventDefault()
  console.debug("navMystories", event);
  hidePageComponents();
  putMyStoriesOnPage();
  $('.storyDel').on('click', (event)=>{
    deleteStory(getId(event))
    //document.querySelector(`#${event.target.id}`).parentElement.remove()
    $(`#${event.target.id}`).parent().remove()
  })
  markFavorites()
}

$navSubmit.on('click', navAddStory);
$navFavorites.on('click', navFavorites);
$navMyStories.on('click', navMyStories);