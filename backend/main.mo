import Func "mo:base/Func";
import Nat "mo:base/Nat";

import Time "mo:base/Time";
import Array "mo:base/Array";
import Text "mo:base/Text";
import Order "mo:base/Order";
import Result "mo:base/Result";
import Debug "mo:base/Debug";

actor {
  // Define the Post type
  type Post = {
    id: Nat;
    title: Text;
    body: Text;
    author: Text;
    timestamp: Time.Time;
  };

  // Stable variable to store posts
  stable var posts : [Post] = [];
  stable var nextId : Nat = 0;

  // Function to add a new post
  public func addPost(title: Text, body: Text, author: Text) : async Result.Result<Nat, Text> {
    let post : Post = {
      id = nextId;
      title = title;
      body = body;
      author = author;
      timestamp = Time.now();
    };
    posts := Array.append(posts, [post]);
    nextId += 1;
    #ok(post.id)
  };

  // Function to get all posts in reverse chronological order
  public query func getPosts() : async [Post] {
    Array.sort(posts, func (a: Post, b: Post) : Order.Order {
      if (a.timestamp > b.timestamp) { #less }
      else if (a.timestamp < b.timestamp) { #greater }
      else { #equal }
    })
  };

  // Debug print function
  public func debugPrint(text: Text) : async () {
    Debug.print(text);
  };
}
