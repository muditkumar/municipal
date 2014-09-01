Template.postsList.helpers({
  posts: function() {
  	var keyword  = Session.get("search-query");
  //	console.log(keyword);
    if (!keyword){
     return Posts.find({},{sort: {tweet_id_str: -1}});
    }
    else{
    	return Posts.find({text : {$regex : keyword , $options: 'i' }}).fetch();
         //return Posts.find({'text': keyword});
    }
  }
});
