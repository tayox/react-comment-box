/*
  
  CommentBox
  |- CommentList
  |--- Comment
  |- Comment Form

*/

/*
  Data for model
*/


/*
  CommentBox
  <CommentBox />
*/
var CommentBox = React.createClass({
  loadCommentsFromServer : function() {
    $.ajax({
      url: this.props.url,
      datatype: 'json',
      cache: false,
      success: function(data) {
        this.setState({data: data});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());        
      }.bind(this)
    });
  },
  getInitialState : function() {
    return { data: [] };
  },
  componentDidMount: function() {    
    this.loadCommentsFromServer();
    setInterval(this.loadCommentsFromServer, this.props.pollInterval);
  },
  render : function() {
    return (
      <div className="comment__box">
        <h1>Hello, world! I'm the CommentBox.</h1>
        <CommentList data={this.state.data} />
        <CommentForm />
      </div>
    );
  }
});


/*
  CommentList
  <CommentList />
*/
var CommentList = React.createClass({
  render : function() {
    var commentNodes = this.props.data.map(function(comment) {
      return (
        <Comment author={comment.author} key={comment.id}>
          {comment.text}
        </Comment>        
      );
    });
    return (
      <div className="comment__list">
        {commentNodes}
      </div>
    );
  }
});


/*
  CommentForm
  <CommentForm />
*/
var CommentForm = React.createClass({
  render : function() {
    return (
      <div className="comment__form">
        this is the comment form!
      </div>  
    );
  }
});


/*
  Comment
  <Comment />
*/
var Comment = React.createClass({
  rawMarkup : function() {
    var rawMarkup = marked(this.props.children.toString(), {sanitize:true});
    return { __html: rawMarkup };
  },
  render : function() {
    return (
      <div className="comment">
        <h2 className="comment__author">{this.props.author}</h2>
        <span dangerouslySetInnerHTML={this.rawMarkup()} />
      </div>
    );
  }
});


ReactDOM.render(
  <CommentBox url="/api/comments" pollInterval={2000} />,
  document.getElementById('content')
)