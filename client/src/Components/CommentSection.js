import { useState, useEffect, useContext } from 'react';
import { UserContext } from '../UserContext';
import axios from 'axios';
import { Link } from 'react-router-dom';

export default function CommentSection({ postId }) {
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [error, setError] = useState('');
    const { userInfo } = useContext(UserContext);

    useEffect(() => {
        fetchComments();
    }, [postId]);

    const fetchComments = async () => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_SERVER_URL}/comments/${postId}`);
            setComments(response.data);
            setError('');
        } catch (error) {
            console.error('Error fetching comments:', error);
            setError('Failed to load comments. Please try again later.');
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;

        try {
            const response = await axios.post(process.env.REACT_APP_SERVER_URL+'/comment', {
                content: newComment,
                postId: postId
            }, { withCredentials: true });
            
            setComments([response.data, ...comments]);
            setNewComment('');
            setError('');
        } catch (error) {
            if (error.response?.status === 401) {
                setError('Please log in to comment');
            } else {
                setError('Failed to post comment. Please try again.');
            }
            console.error('Error posting comment:', error);
        }
    };

    return (
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Comments</h3>
            
            {error && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-red-800">{error}</p>
                </div>
            )}
            
            {userInfo ? (
                <form onSubmit={handleSubmit} className="mb-8">
                    <textarea
                        value={newComment}
                        onChange={e => setNewComment(e.target.value)}
                        placeholder="Write a comment..."
                        className="w-full min-h-[100px] p-3 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-y font-sans"
                    />
                    <button 
                        type="submit" 
                        className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Post Comment
                    </button>
                </form>
            ) : (
                <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-md">
                    <p className="text-blue-800 mb-2">Please log in to leave a comment</p>
                    <Link 
                        to="/login" 
                        className="inline-block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                        Login
                    </Link>
                </div>
            )}

            <div className="space-y-4">
                {comments.length === 0 ? (
                    <p className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</p>
                ) : (
                    comments.map(comment => (
                        <div key={comment._id} className="bg-white p-4 rounded-md shadow-sm">
                            <div className="flex justify-between items-center mb-2 text-sm">
                                <span className="font-semibold text-blue-600">{comment.author.username}</span>
                                <span className="text-gray-500">
                                    {new Date(comment.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                            <p className="text-gray-800 leading-relaxed">{comment.content}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
} 