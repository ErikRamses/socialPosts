Meteor.methods({
  addField(fieldName, postID) {
    check(fieldName, String);
    check(postID, String);
    this.unblock();
    Posts.update(postID, {
       $rename:{nuevocampo: fieldName}
    },
    false, true);
    console.log();
  },
  deleteField(fieldName, postID) {
    check(fieldName, String);
    check(postID, String);
    this.unblock();
    var updateQuery={$unset:{}};   
	updateQuery.$unset[fieldName]=1;   
	Posts.update( {_id: postID} ,updateQuery,false,true);
  	}    
});