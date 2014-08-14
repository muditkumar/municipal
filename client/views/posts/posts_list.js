var postsData = [{
    message: 'Water supply problem',
    author: 'svkanoria'
}, {
    message: 'Several potholes on road',
    author: 'dummyuser1'
}, {
    message: 'Garbage not collected on time',
    author: 'dummyuser2'
}];

Template.postsList.helpers({
    posts: postsData
});
