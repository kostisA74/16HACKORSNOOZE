"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();
  
  putStoriesOnPage();
  
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="favMarker" id="star${story.storyId}"></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
    
}

// Generates markup for a "myStory" that includes delete option
function generateMyStoryMarkup(story) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();
  return $(`
      <li id="${story.storyId}">
        <span class="storyDel" id="del${story.storyId}">&#128465;</span>
        <span class="favMarker" id="star${story.storyId}"></span>
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}


// get id of story marked as favorite
function getId(event){
  return event.target.parentElement.id
}

/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
  if (currentUser){
    markFavorites()
  }
  addEventListenersToMArkers()
}

function addEventListenersToMArkers(){
  $('.favMarker').on('click', (event)=>{
    $(`#${event.target.id}`).toggleClass('marked')
    currentUser.addToFavoritesArray(getId(event))
  } )
}

/**Filters favorites */

function putFavoritesOnPage() {
  console.debug("putFavoritesOnPage");

  $allStoriesList.empty();

  // loop through all of my favorite stories and generate HTML for them
  
  for (let story of currentUser.favorites) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  $('.favMarker').addClass('marked')
  addEventListenersToMArkers()
}

function putMyStoriesOnPage(){
  console.debug("putMyStoriesOnPage");
  $allStoriesList.empty();
  let myStories = storyList.stories.filter((element)=>{
    return element.username === currentUser.username
  })
  for (let story of myStories) {
    const $story = generateMyStoryMarkup(story);
    $allStoriesList.append($story);
  }
  $allStoriesList.show();
  addEventListenersToMArkers()
}

/** Handles 'adding new story' event  
 * 
 */

 async function addNewStory (event) {
  event.preventDefault()
  $addForm.toggleClass('isVisible')
  const author = $authorInput.val()
  const title = $titleInput.val()
  const url = $urlInput.val()
  await storyList.addStory(currentUser,{author,title,url})
  putStoriesOnPage()
}

$submitNew.on('click', addNewStory)

// Marks story with filled heart after login of user
function markFavorites(){
  for (let element of currentUser.favorites){
    $(`#star${element.storyId}`).addClass('marked')
  }
}

 async function deleteStory(id){
  const story = storyList.stories.filter((el)=>{
    return el.storyId === id
  })[0]
  const favoriteIds = currentUser.favorites.map((element=>{
    return element.storyId
  }))
  const indexF = favoriteIds.indexOf(id)
  if (indexF !== -1){
    currentUser.favorites.splice(indexF,1)
  }
  const iDs = storyList.stories.map((element=>{
    return element.storyId
  }))
  storyList.stories.splice(iDs.indexOf(id),1)
   //posting story to favorites
    await axios.delete(
      `https://hack-or-snooze-v3.herokuapp.com/stories/${id}`,
      {data: {"token": currentUser.loginToken}})
}